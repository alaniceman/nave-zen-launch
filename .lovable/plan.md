

## Plan: Sync clases de prueba a Google Sheets

Ya tengo el JSON de la service account y el Spreadsheet ID. Voy a implementar la integración directa con Google Sheets API desde la edge function.

### Pasos

**1. Guardar 2 secrets**
- `GOOGLE_SERVICE_ACCOUNT_JSON` — el JSON completo de la service account
- `GOOGLE_SHEETS_SPREADSHEET_ID` — `1Ol06gVqipVbVkVBMVXSln-FSbVVAT1C7PSXfJOMm7w4`

**2. Crear helper `supabase/functions/_shared/googleSheets.ts`**
- Función `appendToSheet(rows: string[][])` que:
  - Parsea el JSON de la service account
  - Genera un JWT firmado con RS256 para `https://www.googleapis.com/auth/spreadsheets`
  - Obtiene access token de Google OAuth
  - Llama `POST sheets.googleapis.com/v4/spreadsheets/{id}/values/A:G:append` con los datos

**3. Modificar `supabase/functions/book-trial-class/index.ts`**
- Después de crear el booking (paso 3), llamar `appendToSheet` con una fila:
  `[fecha_inscripción, nombre, email, teléfono, clase, fecha_clase, hora]`
- Non-blocking: errores se logean pero no bloquean el booking

### Requisito previo
Asegurar que el spreadsheet `1Ol06gVqipVbVkVBMVXSln-FSbVVAT1C7PSXfJOMm7w4` esté compartido con `nave-studio@robust-doodad-322422.iam.gserviceaccount.com` como Editor.

### Archivos
- `supabase/functions/_shared/googleSheets.ts` — nuevo helper
- `supabase/functions/book-trial-class/index.ts` — agregar llamada al helper

