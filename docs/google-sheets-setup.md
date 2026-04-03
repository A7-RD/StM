# Google Sheets Setup

## CSV files in the repo (no Google)

If you do not use Google Sheets, edit the CSV files in **`data/menus/`**:

| File | On the site |
|------|-------------|
| `dinner-menu.csv` | Dinner tab |
| `cocktails-spirits.csv` | Cocktails & Spirits tab |

**Columns** (first row is the header; order can change): `section`, `name`, `description`, `price`

From **Excel**, use **Save As → CSV UTF-8**. Commit and deploy when you change menus.

If a CSV file is **missing**, the app falls back to Google Sheets when those env vars are set (below).

---

## Google Sheets (optional)

This section explains how to connect a Google Sheet so menu changes update without editing the repo.

---

## Option A — Recommended (2 steps)

Share your Google Sheet with our service account. This is the fastest option.

1. Open your Google Sheet and click **Share** (top right)
2. Add this email as a **Viewer**:

```
st-martins-menus@st-martins-dinner-menu.iam.gserviceaccount.com
```

Then send us your **Spreadsheet ID** — it's the long string in the URL:

```
https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
```

That's it. We'll update the site config and you're live.

---

## Option B — Full Ownership

Use this if you want the integration to live entirely under your own Google account.

### Step 1: Create a Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click **Select a project** → **New Project**
3. Name it anything (e.g. "St Martins Menu") and click **Create**

### Step 2: Enable the Google Sheets API

1. In your new project, go to **APIs & Services** → **Library**
2. Search for **Google Sheets API**
3. Click it and hit **Enable**

### Step 3: Create a Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service account**
3. Give it a name (e.g. "menu-reader") and click **Done**

### Step 4: Generate a Private Key

1. Click on the service account you just created
2. Go to the **Keys** tab
3. Click **Add Key** → **Create new key** → **JSON**
4. A `.json` file will download — keep this safe, send it to us securely

### Step 5: Share your Google Sheet

1. Open your Google Sheet and click **Share**
2. Add the service account email as a **Viewer** (it looks like `name@project-id.iam.gserviceaccount.com`)

### Step 6: Send us

- The downloaded `.json` key file (via a secure channel)
- Your **Spreadsheet ID** from the sheet URL

---

## Sheet Format

Your spreadsheet tabs must be named exactly:

| Tab Name             |
|----------------------|
| `Dinner Menu`        |
| `Wine List`          |
| `Cocktails & Spirits`|

Each tab should have columns in this order, **with a header row**:

| A         | B      | C           | D     |
|-----------|--------|-------------|-------|
| Section   | Name   | Description | Price |
| Starters  | Soup   | Tomato soup | 8     |

- **Section** groups items under a heading on the site
- **Description** and **Price** are optional — leave the cell blank if not needed
- Do not merge cells or add extra formatting to the data rows
