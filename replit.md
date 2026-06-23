# Digital Godfather

AI-powered real estate automation SaaS dashboard for brokers to manage leads, site visits, and WhatsApp conversations via the Rohan AI bot.

## Run & Operate

- `pnpm --filter @workspace/digital-godfather run dev` — run the frontend (port 24857)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + Tailwind CSS 4 (artifact: `digital-godfather`)
- API: Express 5 (artifact: `api-server`)
- Icons: FontAwesome 6 (CDN in index.html)
- Fonts: Inter (Google Fonts CDN)

## Where things live

- `artifacts/digital-godfather/src/lib/api.ts` — all n8n webhook URLs and fetch functions (source of truth for API layer)
- `artifacts/digital-godfather/src/hooks/` — `useLeads.ts`, `useAppointments.ts`, `useSettings.ts` (data hooks with fallback)
- `artifacts/digital-godfather/src/components/` — `Sidebar`, `Analytics`, `Scheduler`, `ChatLogs`, `BotSettings`
- `artifacts/digital-godfather/src/pages/Dashboard.tsx` — main page, tab switching
- `artifacts/digital-godfather/src/App.tsx` — Wouter router

## Architecture decisions

- n8n webhooks are called directly from the browser (no proxy). If a webhook is down, the hook gracefully falls back to demo data and shows an amber warning banner.
- All tab state lives in `Dashboard.tsx` via `useState<TabId>` — no router-based tabs, intentional for simplicity.
- Settings are POSTed to n8n as JSON on form submit; the form is local state until save is clicked.
- FontAwesome is loaded via CDN in `index.html` so it's available across all components with `<i className="fas ...">`.

## Product

- **Analytics & Leads**: Live lead table pulled from n8n with Hot/Warm/Cold AI tags, search, and metric cards.
- **Site Visit Scheduler**: Calendar view + upcoming visit cards pulled from n8n appointments webhook.
- **WhatsApp Chat Logs**: Split-screen chat UI with Hinglish AI conversation, AI typing indicator, and Human Takeover toggle.
- **Bot Settings**: Form to update Rohan AI's project knowledge, POSTed to n8n on save.

## n8n Webhooks

| Purpose           | URL                                                                 | Method |
|-------------------|----------------------------------------------------------------------|--------|
| Get Leads         | https://n8n-production-8556.up.railway.app/webhook/get-leads        | GET    |
| Get Appointments  | https://n8n-production-8556.up.railway.app/webhook/get-appointments | GET    |
| Update Settings   | https://n8n-production-8556.up.railway.app/webhook/update-settings  | GET    |

## User preferences

- Dark-first, slate-900 background, violet/cyan/emerald accent system.
- Hinglish tone for the Rohan AI bot.
- Panvel, Navi Mumbai project location.

## Gotchas

- FontAwesome classes (`fas`, `fab`) require the CDN link in `index.html` — do NOT remove it.
- The `@tailwindcss/typography` plugin was removed from `index.css` (was causing build warnings on unused plugin); do not re-add unless needed.
- n8n webhooks may return CORS errors in development — the hooks handle this silently with fallback data.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
