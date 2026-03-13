/**
 * Google Sheets API helper — append rows using a Service Account.
 * Uses RS256 JWT for authentication (no external libs needed in Deno).
 */

// --- crypto helpers ---

function base64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function str2ab(str: string): ArrayBuffer {
  return new TextEncoder().encode(str).buffer;
}

/** Import a PEM private key for RS256 signing */
async function importPrivateKey(pem: string): Promise<CryptoKey> {
  // Ensure literal \n are real newlines (env vars may escape them)
  const normalizedPem = pem.replace(/\\n/g, "\n");
  const pemBody = pem
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

/** Create a signed JWT for Google OAuth2 */
async function createJWT(
  clientEmail: string,
  privateKey: string,
  scopes: string[],
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: clientEmail,
    scope: scopes.join(" "),
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const encodedHeader = base64url(str2ab(JSON.stringify(header)));
  const encodedPayload = base64url(str2ab(JSON.stringify(payload)));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const key = await importPrivateKey(privateKey);
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(signingInput),
  );

  return `${signingInput}.${base64url(signature)}`;
}

/** Exchange a signed JWT for a Google access token */
async function getAccessToken(
  clientEmail: string,
  privateKey: string,
): Promise<string> {
  const jwt = await createJWT(clientEmail, privateKey, [
    "https://www.googleapis.com/auth/spreadsheets",
  ]);

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

// --- public API ---

/**
 * Append rows to a Google Sheet.
 * Reads `GOOGLE_SERVICE_ACCOUNT_JSON` and `GOOGLE_SHEETS_SPREADSHEET_ID` from env.
 *
 * @param rows  Array of row arrays, e.g. [["val1","val2",...]]
 * @param range Optional sheet range (default "Sheet1")
 */
export async function appendToSheet(
  rows: string[][],
  range = "Sheet1",
): Promise<void> {
  const saJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
  const spreadsheetId = Deno.env.get("GOOGLE_SHEETS_SPREADSHEET_ID");

  if (!saJson || !spreadsheetId) {
    console.warn("[Google Sheets] Missing GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_SHEETS_SPREADSHEET_ID — skipping sync");
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

  await res.text(); // consume body
  console.log(`[Google Sheets] Appended ${rows.length} row(s)`);
}
