# TrES Workspace
### Built by CodeScriptors IT Solutions

A unified client management, utilities studio, and executive resume tool — built with React 18 + Vite 5.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the development server (opens at http://localhost:5173)
npm run dev

# 3. Build for production
npm run build

# 4. Preview the production build locally
npm run preview
```

---

## Project Structure

```
tres-workspace/
├── index.html          ← Vite HTML entry point
├── vite.config.js      ← Vite configuration
├── package.json
├── vercel.json         ← Vercel SPA routing config
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx        ← ReactDOM.createRoot entry
    ├── index.css       ← Global reset
    └── App.jsx         ← Entire application (single file)
```

---

## Deploy to Vercel

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel --prod
```

### Option B — Vercel Dashboard
1. Push this folder to a GitHub repository
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy**

The included `vercel.json` handles SPA client-side routing automatically.

---

## Backend API Routes (Future)

The following routes are wired in the UI and ready to activate:

| Route | Method | Description |
|---|---|---|
| `/api/convert/pdf` | POST | Heavy Document Node — PDF export |
| `/api/convert/docx` | POST | Heavy Document Node — DOCX export |
| `/api/convert/pptx` | POST | Heavy Document Node — PPTX export |
| `/api/links/create` | POST | Self-Destruct Simulator — create one-time link |
| `/api/links/:id` | DELETE | Self-Destruct Simulator — destroy link |

Add these as Vercel Serverless Functions in an `/api` folder, or proxy to your own backend.

---

## Tech Stack

- **React 18** — UI framework
- **Vite 5** — build tool & dev server
- **Web Crypto API** — AES-GCM 256 encryption (Card 1, Security)
- **Canvas API** — image format conversion & compression
- **Blob + URL.createObjectURL** — all file downloads
- **localStorage** — theme and auth persistence
- **CSS-in-JS** — all styles inline via style props

No external UI libraries. No CSS frameworks. Zero runtime dependencies beyond React.

---

© 2026 TrES Workspace. Built and owned by **CodeScriptors IT Solutions**. All rights reserved.
