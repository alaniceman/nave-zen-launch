/**
 * Google Sheets API helper — append rows using a Service Account.
 * Uses google-auth-library for reliable JWT auth.
 */

import { GoogleAuth } from "npm:google-auth-library@9.14.2";

/**
 * Append rows to a Google Sheet.
 * Reads `GOOGLE_SERVICE_ACCOUNT_JSON` and `GOOGLE_SHEETS_SPREADSHEET_ID` from env.
 */
export async function appendToSheet(
  rows: string[][],
  range = "Sheet1",
): Promise<void> {
  const saJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
  const spreadsheetId = Deno.env.get("GOOGLE_SHEETS_SPREADSHEET_ID");

  if (!saJson || !spreadsheetId) {
    console.warn("[Google Sheets] Missing secrets — skipping sync");
    return;
  }

  const credentials = JSON.parse(saJson);
  const auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  const accessToken = tokenResponse?.token;

  if (!accessToken) {
    throw new Error("Failed to obtain Google access token");
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: rows }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google Sheets append error ${res.status}: ${text}`);
  }

  await res.text();
  console.log(`[Google Sheets] Appended ${rows.length} row(s)`);
}
