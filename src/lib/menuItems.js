import { readFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";

import { fetchMenuFromGoogle } from "./sheets";

/** Maps the same labels used for Google Sheet tabs to files under data/menus/ */
const MENU_CSV_FILES = {
  "Dinner Menu": "dinner-menu.csv",
  "Cocktails & Spirits": "cocktails-spirits.csv",
};

function parseMenuCsv(content) {
  const text = content.charCodeAt(0) === 0xfeff ? content.slice(1) : content;
  const records = parse(text, {
    columns: (header) => header.map((h) => h.trim().toLowerCase()),
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  });
  return records
    .filter((row) => (row.name ?? "").trim())
    .map((row) => ({
      section: row.section ?? "",
      name: row.name ?? "",
      description: row.description ?? "",
      price: row.price ?? "",
    }));
}

/**
 * Menu rows for a tab. Reads `data/menus/<file>.csv` when mapped; otherwise Google Sheets if configured.
 * CSV header (any column order): section, name, description, price
 * @param {string} sheetName - e.g. "Dinner Menu", "Cocktails & Spirits"
 */
export async function getMenuItems(sheetName) {
  const fileName = MENU_CSV_FILES[sheetName];
  if (fileName) {
    const csvPath = path.join(process.cwd(), "data", "menus", fileName);
    try {
      const raw = await readFile(csvPath, "utf8");
      return parseMenuCsv(raw);
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }
  }
  return fetchMenuFromGoogle(sheetName);
}
