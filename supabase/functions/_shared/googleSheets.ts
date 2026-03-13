/**
 * Google Sheets API helper — append rows using a Service Account.
 * Uses djwt for RS256 JWT creation.
 */

import { create, getNumericDate } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

/** Import a PEM private key for RS256 signing */
async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const normalizedPem = pem.replace(/\\n/g, "\n");
  const pemBody = normalizedPem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const binaryDer = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    "pkcs8",
    binaryDer.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

/** Exchange a signed JWT for a Google access token */
async function getAccessToken(
  clientEmail: string,
  privateKey: string,
): Promise<string> {
  const key = await importPrivateKey(privateKey);

  const jwt = await create(
    { alg: "RS256", typ: "JWT" },
    {
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      iat: getNumericDate(0),
      exp: getNumericDate(3600),
    },
    key,
  );

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google token error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

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

  const sa = JSON.parse(saJson);
  const accessToken = await getAccessToken(sa.client_email, sa.private_key);

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
