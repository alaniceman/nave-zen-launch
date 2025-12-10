import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { jsPDF } from "npm:jspdf@2.5.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token } = await req.json();

    if (!token) {
      throw new Error("Token is required");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get codes with this token
    const { data: codes, error: codesError } = await supabase
      .from("session_codes")
      .select("code, is_used, expires_at, package_id, applicable_service_ids, buyer_name")
      .eq("giftcard_access_token", token);

    if (codesError || !codes || codes.length === 0) {
      throw new Error("Gift card not found");
    }

    // Get package info
    const packageId = codes[0].package_id;
    const { data: packageData } = await supabase
      .from("session_packages")
      .select("name, sessions_quantity, validity_days")
      .eq("id", packageId)
      .single();

    // Get service names
    const serviceIds = codes[0].applicable_service_ids || [];
    const { data: services } = await supabase
      .from("services")
      .select("name")
      .in("id", serviceIds);

    const packageName = packageData?.name || "Paquete de Sesiones";
    const buyerName = codes[0].buyer_name;
    const expiryDate = new Date(codes[0].expires_at).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const serviceNames = services?.map(s => s.name).join(" • ") || "";

    // Create PDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    // Background gradient effect (using rectangles)
    doc.setFillColor(103, 58, 183); // Primary purple
    doc.rect(0, 0, pageWidth, 80, "F");

    // Header area
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text("STUDIO LA NAVE", pageWidth / 2, 25, { align: "center" });

    doc.setFontSize(36);
    doc.text("🎁 GIFT CARD", pageWidth / 2, 50, { align: "center" });

    doc.setFontSize(14);
    doc.text(packageName, pageWidth / 2, 65, { align: "center" });

    // White content area
    const contentStartY = 90;

    // From section
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text("De parte de:", margin, contentStartY);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(buyerName, margin, contentStartY + 7);

    // Valid until
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text("Válido hasta:", pageWidth - margin, contentStartY, { align: "right" });
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(expiryDate, pageWidth - margin, contentStartY + 7, { align: "right" });

    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, contentStartY + 15, pageWidth - margin, contentStartY + 15);

    // Session codes title
    let currentY = contentStartY + 30;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text("Tus códigos de sesión:", margin, currentY);

    currentY += 10;

    // Codes
    const availableCodes = codes.filter(c => !c.is_used);
    doc.setFontSize(18);

    for (const codeData of availableCodes) {
      // Code box
      doc.setDrawColor(103, 58, 183);
      doc.setLineWidth(0.5);
      doc.roundedRect(margin, currentY, contentWidth, 15, 3, 3, "S");

      // Code text
      doc.setTextColor(103, 58, 183);
      doc.setFontSize(16);
      doc.text(codeData.code, pageWidth / 2, currentY + 10, { align: "center" });

      currentY += 20;
    }

    // Services section
    if (serviceNames) {
      currentY += 5;
      doc.setFillColor(245, 245, 250);
      doc.roundedRect(margin, currentY, contentWidth, 20, 3, 3, "F");

      doc.setTextColor(100, 100, 100);
      doc.setFontSize(10);
      doc.text("Válido para:", margin + 5, currentY + 8);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text(serviceNames, margin + 5, currentY + 15);

      currentY += 30;
    }

    // Instructions
    currentY += 10;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("¿Cómo usar tus códigos?", margin, currentY);

    currentY += 10;
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);

    const instructions = [
      "1. Ve a studiolanave.com/agenda-nave-studio",
      "2. Selecciona el profesional, fecha y hora",
      "3. Ingresa tu código en el formulario de reserva",
      "4. ¡Tu sesión quedará confirmada sin costo!",
    ];

    for (const instruction of instructions) {
      doc.text(instruction, margin, currentY);
      currentY += 7;
    }

    // Footer
    const footerY = pageHeight - 25;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text("Studio La Nave", pageWidth / 2, footerY, { align: "center" });
    doc.text("studiolanave.com", pageWidth / 2, footerY + 5, { align: "center" });
    doc.setFontSize(8);
    doc.text("Cada código puede usarse una sola vez.", pageWidth / 2, footerY + 12, { align: "center" });

    // Get PDF as base64
    const pdfBase64 = doc.output("datauristring").split(",")[1];

    console.log("Gift card PDF generated successfully");

    return new Response(
      JSON.stringify({ pdf: pdfBase64 }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error generating gift card PDF:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
