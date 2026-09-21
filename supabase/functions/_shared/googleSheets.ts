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

/** Obtain an access token for the Sheets API using the service account. */
export async function getSheetsAccessToken(): Promise<string> {
  const saJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
  if (!saJson) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_JSON");

  const credentials = JSON.parse(saJson);
  const auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  const token = tokenResponse?.token;
  if (!token) throw new Error("Failed to obtain Google access token");
  return token;
}

/**
 * Replace the contents of a sheet range with `rows` (full rewrite).
 * Clears the target range first so stale rows never linger.
 */
export async function replaceSheetValues(
  spreadsheetId: string,
  sheetTitle: string,
  rows: (string | number)[][],
  lastColumn = "Z",
): Promise<void> {
  const token = await getSheetsAccessToken();
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
  const clearRange = `'${sheetTitle}'!A1:${lastColumn}`;

  const clearRes = await fetch(`${base}/values/${clearRange}:clear`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: "{}",
  });
  if (!clearRes.ok) {
    throw new Error(`Google Sheets clear error ${clearRes.status}: ${await clearRes.text()}`);
  }

  const writeRange = `'${sheetTitle}'!A1`;
  const writeRes = await fetch(
    `${base}/values/${writeRange}?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ values: rows }),
    },
  );
  if (!writeRes.ok) {
    throw new Error(`Google Sheets update error ${writeRes.status}: ${await writeRes.text()}`);
  }

  await writeRes.text();
  console.log(`[Google Sheets] Rewrote '${sheetTitle}' with ${rows.length} row(s)`);
}
