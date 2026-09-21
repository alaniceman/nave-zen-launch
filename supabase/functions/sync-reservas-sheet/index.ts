import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";
import { replaceSheetValues } from "../_shared/googleSheets.ts";

const SPREADSHEET_ID =
  Deno.env.get("GOOGLE_SHEETS_RESERVAS_SPREADSHEET_ID") ??
  "1XNS1pVsnEY5XZbSdP_8IMJdsbOIFgUMB3M2VAFT80Fg";
const SHEET_TITLE = "Reservas Wim Hof";
const TZ = "America/Santiago";

const HEADERS = [
  "ID Reserva",
  "Fecha de Pago",
  "Estado",
  "Nombre Cliente",
  "Email",
  "Teléfono",
  "Instructor",
  "Email Instructor",
  "Servicio",
  "Sesión",
  "Categoría",
  "Fecha Sesión",
  "Hora Sesión",
  "Día Semana",
  "Precio Original (CLP)",
  "Descuento (CLP)",
  "Precio Final (CLP)",
  "Cupón",
  "Código de Sesión",
  "Paquete",
  "Fuente Reserva",
  "ID Pago MP",
];

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "Confirmada",
  PENDING_PAYMENT: "Pendiente Pago",
  CANCELLED: "Cancelada",
};

/** Wim Hof vs Yoga — simplifica la lectura posterior. */
function categoria(colorTag: string | null, serviceName: string): string {
  const tag = (colorTag ?? "").toLowerCase();
  if (tag === "yoga") return "Yoga";
  if (["wim-hof", "breathwork", "agua-fria", "hiit"].includes(tag)) return "Wim Hof";

  const n = serviceName.toLowerCase();
  if (n.includes("yoga") || n.includes("flexibilidad") || n.includes("isométrica")) return "Yoga";
  return "Wim Hof";
}

function parts(iso: string) {
  const fmt = new Intl.DateTimeFormat("es-CL", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "long",
  });
  const out: Record<string, string> = {};
  for (const p of fmt.formatToParts(new Date(iso))) out[p.type] = p.value;
  return {
    date: `${out.year}-${out.month}-${out.day}`,
    time: `${out.hour}:${out.minute}`,
    weekday: out.weekday ?? "",
  };
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Paginado: Supabase corta en 1000 filas por consulta.
    const rows: any[] = [];
    const PAGE = 1000;
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await supabase
        .from("bookings")
        .select(
          `id, customer_name, customer_email, customer_phone, date_time_start, status,
           created_at, original_price, discount_amount, final_price, mercado_pago_payment_id,
           services:service_id ( name, color_tag ),
           professionals:professional_id ( name, email ),
           discount_coupons:coupon_id ( code ),
           session_codes:session_code_id ( code, session_packages:package_id ( name ) )`,
        )
        .order("created_at", { ascending: false })
        .range(from, from + PAGE - 1);

      if (error) throw new Error(error.message);
      if (!data || data.length === 0) break;
      rows.push(...data);
      if (data.length < PAGE) break;
    }

    const values: (string | number)[][] = [HEADERS];

    for (const b of rows) {
      const serviceName: string = b.services?.name ?? "";
      const sesion = serviceName;
      const paid = parts(b.created_at);
      const sess = parts(b.date_time_start);
      const codigo = b.session_codes?.code ?? "";
      const cupon = b.discount_coupons?.code ?? "";

      values.push([
        b.id,
        `${paid.date} ${paid.time}`,
        STATUS_LABELS[b.status] ?? b.status,
        b.customer_name ?? "",
        b.customer_email ?? "",
        b.customer_phone ?? "",
        b.professionals?.name ?? "",
        b.professionals?.email ?? "",
        serviceName,
        sesion,
        categoria(b.services?.color_tag ?? null, serviceName),
        sess.date,
        sess.time,
        sess.weekday,
        b.original_price ?? "",
        b.discount_amount ?? 0,
        b.final_price ?? "",
        cupon,
        codigo,
        b.session_codes?.session_packages?.name ?? "",
        codigo ? "Código de Sesión" : cupon ? "Cupón" : "Directa",
        b.mercado_pago_payment_id ?? "",
      ]);
    }

    const dryRun = new URL(req.url).searchParams.get("dryRun") === "1";
    if (!dryRun) {
      await replaceSheetValues(SPREADSHEET_ID, SHEET_TITLE, values, "V");
    }

    return new Response(
      JSON.stringify({ success: true, dryRun, bookings: rows.length, rowsWritten: values.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("sync-reservas-sheet error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
