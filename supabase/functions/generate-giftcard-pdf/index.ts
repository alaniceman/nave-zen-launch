import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { jsPDF } from "npm:jspdf@2.5.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Corporate colors
const NAVY_BLUE = { r: 30, g: 41, b: 59 }; // #1E293B
const LIGHT_NAVY = { r: 51, g: 65, b: 85 }; // #334155
const ACCENT_BLUE = { r: 59, g: 130, b: 246 }; // #3B82F6
const GOLD = { r: 234, g: 179, b: 8 }; // #EAB308

// San Valentin colors
const PINK = { r: 236, g: 72, b: 153 }; // #EC4899
const ROSE = { r: 190, g: 24, b: 93 }; // #BE185D
const LIGHT_PINK = { r: 252, g: 231, b: 243 }; // #FCE7F3

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
    const serviceNames = services?.map(s => s.name).join(", ") || "";

    // Detect San Valentin promo by package name
    const isSanValentin = packageName.toLowerCase().includes("valentin");

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

    // Choose colors based on promo type
    const headerColor = isSanValentin ? PINK : NAVY_BLUE;
    const accentColor = isSanValentin ? ROSE : GOLD;
    const textAccentColor = isSanValentin ? PINK : NAVY_BLUE;

    // Header background
    doc.setFillColor(headerColor.r, headerColor.g, headerColor.b);
    doc.rect(0, 0, pageWidth, 85, "F");

    // Decorative accent line
    doc.setFillColor(accentColor.r, accentColor.g, accentColor.b);
    doc.rect(0, 85, pageWidth, 3, "F");

    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("STUDIO LA NAVE", pageWidth / 2, 20, { align: "center" });

    // GIFT CARD title
    doc.setFontSize(42);
    doc.setFont("helvetica", "bold");
    const giftCardTitle = isSanValentin ? "SAN VALENTIN" : "GIFT CARD";
    doc.text(giftCardTitle, pageWidth / 2, 48, { align: "center" });

    // Package name
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(accentColor.r, accentColor.g, accentColor.b);
    doc.text(packageName, pageWidth / 2, 65, { align: "center" });

    // Sessions count
    const sessionsCount = codes.filter(c => !c.is_used).length;
    doc.setFontSize(11);
    doc.setTextColor(200, 200, 200);
    doc.text(`${sessionsCount} ${sessionsCount === 1 ? 'sesion' : 'sesiones'} disponibles`, pageWidth / 2, 75, { align: "center" });

    // White content area
    const contentStartY = 100;

    // From section
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(isSanValentin ? "Con amor de:" : "De parte de:", margin, contentStartY);
    doc.setTextColor(textAccentColor.r, textAccentColor.g, textAccentColor.b);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(buyerName, margin, contentStartY + 8);

    // Valid until
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Valido hasta:", pageWidth - margin, contentStartY, { align: "right" });
    doc.setTextColor(textAccentColor.r, textAccentColor.g, textAccentColor.b);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(expiryDate, pageWidth - margin, contentStartY + 8, { align: "right" });

    // Divider line
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(margin, contentStartY + 18, pageWidth - margin, contentStartY + 18);

    // Session codes title
    let currentY = contentStartY + 35;
    doc.setTextColor(textAccentColor.r, textAccentColor.g, textAccentColor.b);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Tus codigos de sesion:", margin, currentY);

    currentY += 12;

    // Codes
    const availableCodes = codes.filter(c => !c.is_used);

    for (const codeData of availableCodes) {
      // Code box with themed border
      doc.setDrawColor(textAccentColor.r, textAccentColor.g, textAccentColor.b);
      doc.setLineWidth(1);
      doc.roundedRect(margin, currentY, contentWidth, 16, 4, 4, "S");

      // Code text
      doc.setTextColor(textAccentColor.r, textAccentColor.g, textAccentColor.b);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(codeData.code, pageWidth / 2, currentY + 11, { align: "center" });

      currentY += 22;
    }

    // Services section
    if (serviceNames) {
      currentY += 5;
      const bgColor = isSanValentin ? LIGHT_PINK : { r: 245, g: 247, b: 250 };
      doc.setFillColor(bgColor.r, bgColor.g, bgColor.b);
      doc.roundedRect(margin, currentY, contentWidth, 22, 4, 4, "F");

      doc.setTextColor(120, 120, 120);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Valido para:", margin + 8, currentY + 9);
      doc.setTextColor(textAccentColor.r, textAccentColor.g, textAccentColor.b);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(serviceNames, margin + 8, currentY + 17);

      currentY += 32;
    }

    // Instructions
    currentY += 8;
    doc.setTextColor(textAccentColor.r, textAccentColor.g, textAccentColor.b);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Como usar tus codigos?", margin, currentY);

    currentY += 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);

    const instructions = [
      "1. Ve a studiolanave.com/agenda-nave-studio",
      "2. Selecciona el profesional, fecha y hora",
      "3. Ingresa tu codigo en el formulario de reserva",
      "4. Tu sesion quedara confirmada sin costo!",
    ];

    for (const instruction of instructions) {
      doc.text(instruction, margin, currentY);
      currentY += 8;
    }

    // Footer
    const footerY = pageHeight - 30;
    
    // Footer divider
    doc.setDrawColor(textAccentColor.r, textAccentColor.g, textAccentColor.b);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY - 10, pageWidth - margin, footerY - 10);

    // Footer content
    doc.setTextColor(textAccentColor.r, textAccentColor.g, textAccentColor.b);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Studio La Nave", pageWidth / 2, footerY, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("studiolanave.com", pageWidth / 2, footerY + 6, { align: "center" });
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Cada codigo puede usarse una sola vez.", pageWidth / 2, footerY + 14, { align: "center" });

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
