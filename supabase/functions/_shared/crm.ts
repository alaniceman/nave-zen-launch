/**
 * CRM helper: upsert customer + log event
 */
export async function upsertCustomerAndLogEvent(
  supabase: any,
  data: {
    email: string;
    name: string;
    phone?: string | null;
    eventType: string;
    eventTitle: string;
    eventDescription?: string | null;
    amount?: number | null;
    metadata?: Record<string, any>;
    statusIfNew?: string;
  }
) {
  const email = data.email.toLowerCase().trim();

  try {
    // 1. Upsert customer
    const { data: customer, error: upsertError } = await supabase
      .from("customers")
      .upsert(
        {
          email,
          name: data.name,
          phone: data.phone || null,
        },
        { onConflict: "email" }
      )
      .select("id, status")
      .single();

    if (upsertError || !customer) {
      console.error("CRM upsert error:", upsertError);
      return;
    }

    // 2. Update status if appropriate (only escalate, never downgrade)
    const statusPriority: Record<string, number> = {
      new: 0,
      trial_booked: 1,
      trial_attended: 2,
      purchased: 3,
      member: 4,
    };

    const desiredStatus = data.statusIfNew || "new";
    const currentPriority = statusPriority[customer.status] ?? 0;
    const desiredPriority = statusPriority[desiredStatus] ?? 0;

    if (desiredPriority > currentPriority) {
      await supabase
        .from("customers")
        .update({ status: desiredStatus })
        .eq("id", customer.id);
    }

    // 3. Log event
    await supabase.from("customer_events").insert({
      customer_id: customer.id,
      event_type: data.eventType,
      title: data.eventTitle,
      description: data.eventDescription || null,
      amount: data.amount || null,
      metadata: data.metadata || {},
      event_date: new Date().toISOString(),
    });

    console.log(`CRM: logged ${data.eventType} for ${email}`);
  } catch (err) {
    console.error("CRM helper error (non-blocking):", err);
  }
}
