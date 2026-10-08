# Helixona · Complex Chronic Program — MVP mockups

Clickable, no-backend mockups for the operational app that sits next to eClinicalWorks for Helixona's nine-month Complex Chronic program. See [`CLAUDE.md`](CLAUDE.md) for scope and decisions, [`screens.md`](screens.md) for every route, and [`docs/`](docs) for the requirements brief and decision log.

**Live:** https://crpozo.github.io/Helixona-Complex-Chronic-Program/

## Run locally

```bash
npm install
npm run dev          # http://localhost:5173/Helixona-Complex-Chronic-Program/
npm run build        # type-check + production build to dist/
npm run screenshots  # PNG per route into screenshots/ (needs Playwright's Chromium)
```

## Deploy

Every push to `main` or a `claude/**` branch runs `.github/workflows/deploy-pages.yml`, which builds the site and publishes `dist/` to GitHub Pages. The workflow enables Pages automatically on first run; if the deploy job is skipped, set **Settings → Pages → Source** to **GitHub Actions** once.

## Structure

```
src/
  components/      shared UI (pills, queue table, audit list, fields, signature pad, phone frame)
  mock/            sample data (patients, inquiries, eCW jobs, placeholder questionnaire)
  modules/
    shell/         top bar, role switcher, navigation
    overview/      screen index (#/screens)
    intake/        Priority 1 — patient/ (phone) and staff/ (desktop)
    surveys/       Priority 2 — patient survey & crash report, alert queue, longitudinal view
    config/        Priority 2 — survey builder, modalities, alert rules & precedence
    registry/      Priority 2 — membership registry and member detail
    booking/       Priority 3 — patient booking, resource calendar & exceptions
    payments/      Priority 3 — agreement + Stripe setup, schedule & receipts, failed-payment queue
    notifications/ Priority 3 — message templates and delivery log
    dashboards/    Priority 3 — program dashboards and pilot defects
screenshots/       one PNG per route for email review
```

Stack: React + Vite + TypeScript + Tailwind v4, hash routing (works on GitHub Pages), all state in memory. No real patient data anywhere.
