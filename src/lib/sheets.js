import { google } from "googleapis";

let warnedSheetsNotConfigured = false;

function isSheetsConfigured() {
  return Boolean(
    process.env.GOOGLE_SPREADSHEET_ID?.trim() &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim() &&
      process.env.GOOGLE_PRIVATE_KEY?.trim(),
  );
}

function getAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

/**
 * Fetches menu rows from Google Sheets (used only when no CSV exists for that menu).
 * Expects columns: section | name | description | price
 * @param {string} sheetName - Tab name in the spreadsheet (e.g. "Dinner Menu")
 * @returns {Promise<Array<{section: string, name: string, description: string, price: string}>>}
 */
export async function fetchMenuFromGoogle(sheetName) {
  if (!isSheetsConfigured()) {
    if (process.env.NODE_ENV === "development" && !warnedSheetsNotConfigured) {
      warnedSheetsNotConfigured = true;
      console.warn(
        "[sheets] Google Sheets env vars missing and no CSV for this menu; section will be empty. Use data/menus/*.csv or see docs/google-sheets-setup.md",
      );
    }
    return [];
  }

  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    range: `'${sheetName}'!A:D`,
  });

  const rows = response.data.values ?? [];

  return rows
    .slice(1)
    .filter((row) => row[1])
    .map((row) => ({
      section: row[0] ?? "",
      name: row[1] ?? "",
      description: row[2] ?? "",
      price: row[3] ?? "",
    }));
}
