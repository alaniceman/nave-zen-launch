const MAILERLITE_API_URL = "https://connect.mailerlite.com/api";

function getApiHeaders(): Record<string, string> {
  const apiKey = Deno.env.get("MAILERLITE_ECOMMERCE_API_KEY");
  if (!apiKey) throw new Error("MAILERLITE_ECOMMERCE_API_KEY not configured");
  return {
    Authorization: `Bearer ${apiKey}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

function splitName(fullName: string): { first_name: string; last_name: string } {
  const parts = fullName.trim().split(/\s+/);
  return {
    first_name: parts[0] || "",
    last_name: parts.slice(1).join(" ") || "",
  };
}

export interface OrderData {
  order_id: string;
  order_type: string;
  total: number;
  subtotal?: number;
  customer_email: string;
  customer_name: string;
  items: Array<{
    product_id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

export interface SyncResult {
  status: "success" | "failed" | "already_synced";
  http_status?: number;
  log_id?: string;
  error?: string;
}

/**
 * Gets or creates the MailerLite shop for Nave Studio.
 * Never reuses existing shops — always creates a fresh one if none is stored in DB.
 */
export async function getOrCreateShop(
  supabase: any
): Promise<{ shop_id: string; config: any }> {
  // 1. Check DB for existing shop_id
  const { data: config } = await supabase
    .from("integrations_mailerlite")
    .select("*")
    .eq("is_active", true)
    .maybeSingle();

  if (config?.mailerlite_shop_id) {
    console.log("MailerLite shop already exists:", config.mailerlite_shop_id);
    return { shop_id: config.mailerlite_shop_id, config };
  }

  // 2. Create new shop (NEVER list or reuse existing shops)
  console.log("Creating new MailerLite shop...");
  const shopPayload = {
    name: config?.shop_name || "Nave Studio CLP 2026",
    currency: config?.currency || "CLP",
    url: "https://studiolanave.com/",
  };

  const response = await fetch(`${MAILERLITE_API_URL}/ecommerce/shops`, {
    method: "POST",
    headers: getApiHeaders(),
    body: JSON.stringify(shopPayload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to create MailerLite shop [${response.status}]: ${errorBody}`
    );
  }

  const shopData = await response.json();
  const shopId = shopData.data?.id;

  if (!shopId) {
    throw new Error("MailerLite shop creation returned no ID");
  }

  console.log("MailerLite shop created:", shopId);

  // 3. Save/update in DB
  if (config) {
    await supabase
      .from("integrations_mailerlite")
      .update({ mailerlite_shop_id: shopId })
      .eq("id", config.id);
  } else {
    await supabase.from("integrations_mailerlite").insert({
      mailerlite_shop_id: shopId,
      shop_name: "Nave Studio CLP 2026",
      currency: "CLP",
    });
  }

  return {
    shop_id: shopId,
    config: { ...config, mailerlite_shop_id: shopId },
  };
}

/**
 * Syncs an order to MailerLite e-commerce.
 * Handles idempotency: if order already synced, skips.
 * Logs all attempts to orders_sync_log.
 */
export async function syncOrderToMailerLite(
  supabase: any,
  orderData: OrderData
): Promise<SyncResult> {
  console.log("Syncing order to MailerLite:", orderData.order_id);

  // 1. Ensure shop exists
  const { shop_id } = await getOrCreateShop(supabase);

  // 2. Idempotency: check if already synced
  const { data: existingLog } = await supabase
    .from("orders_sync_log")
    .select("id, status")
    .eq("order_id", orderData.order_id)
    .eq("status", "success")
    .maybeSingle();

  if (existingLog) {
    console.log("Order already synced to MailerLite:", orderData.order_id);
    return { status: "already_synced", log_id: existingLog.id };
  }

  // 3. Build MailerLite order payload
  const { first_name, last_name } = splitName(orderData.customer_name);
  const payload = {
    order_id: orderData.order_id,
    currency: "CLP",
    total: orderData.total,
    subtotal: orderData.subtotal || orderData.total,
    status: "paid",
    customer: {
      email: orderData.customer_email,
      first_name,
      last_name,
    },
    items: orderData.items.map((item) => ({
      product_id: item.product_id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
  };

  // 4. Create pending log entry
  const { data: logEntry, error: logError } = await supabase
    .from("orders_sync_log")
    .insert({
      order_id: orderData.order_id,
      order_type: orderData.order_type,
      status: "pending",
      request_body: payload,
    })
    .select("id")
    .single();

  if (logError) {
    console.error("Error creating sync log:", logError);
  }

  // 5. POST to MailerLite e-commerce orders API
  let responseBody: any;
  let httpStatus: number;

  try {
    const response = await fetch(
      `${MAILERLITE_API_URL}/ecommerce/shops/${shop_id}/orders`,
      {
        method: "POST",
        headers: getApiHeaders(),
        body: JSON.stringify(payload),
      }
    );

    httpStatus = response.status;
    responseBody = await response.json();

    console.log(
      `MailerLite sync response [${httpStatus}]:`,
      JSON.stringify(responseBody)
    );
  } catch (fetchError: any) {
    httpStatus = 0;
    responseBody = { error: fetchError.message };
    console.error("MailerLite API fetch error:", fetchError);
  }

  // 6. Update log entry
  const isSuccess = httpStatus >= 200 && httpStatus < 300;

  if (logEntry?.id) {
    await supabase
      .from("orders_sync_log")
      .update({
        status: isSuccess ? "success" : "failed",
        response_body: responseBody,
        http_status: httpStatus,
        error_message: isSuccess ? null : JSON.stringify(responseBody),
      })
      .eq("id", logEntry.id);
  }

  return {
    status: isSuccess ? "success" : "failed",
    http_status: httpStatus,
    log_id: logEntry?.id,
    error: isSuccess ? undefined : JSON.stringify(responseBody),
  };
}

/**
 * Health check: tests MailerLite API connectivity.
 */
export async function mailerliteHealthCheck(): Promise<{
  ok: boolean;
  message: string;
  account_id?: string;
}> {
  try {
    const response = await fetch(
      `${MAILERLITE_API_URL}/subscribers?limit=1`,
      { headers: getApiHeaders() }
    );

    if (response.ok) {
      const data = await response.json();
      return {
        ok: true,
        message: `API conectada correctamente. Total suscriptores: ${data.meta?.total || "N/A"}`,
      };
    }

    return {
      ok: false,
      message: `API retornó ${response.status}: ${await response.text()}`,
    };
  } catch (error: any) {
    return { ok: false, message: `Error de conexión: ${error.message}` };
  }
}
