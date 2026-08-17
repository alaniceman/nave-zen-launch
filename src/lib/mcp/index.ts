import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listServicesTool from "./tools/list-services";
import listWeeklyScheduleTool from "./tools/list-weekly-schedule";
import listAvailableSlotsTool from "./tools/list-available-slots";
import listBookingsTool from "./tools/list-bookings";
import searchCustomersTool from "./tools/search-customers";
import getStudioInfoTool from "./tools/get-studio-info";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "studiolanave",
  title: "studiolanave",
  version: "0.1.0",
  instructions:
    "Herramientas de Nave Studio (Las Condes, Santiago): servicios y precios, horario semanal, cupos disponibles, reservas, clientes del CRM e información del estudio. Las reservas y clientes requieren una cuenta con permisos de administrador. Zona horaria America/Santiago.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listServicesTool,
    listWeeklyScheduleTool,
    listAvailableSlotsTool,
    listBookingsTool,
    searchCustomersTool,
    getStudioInfoTool,
  ],
});
