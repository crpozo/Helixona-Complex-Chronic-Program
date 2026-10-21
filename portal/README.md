# Helixona systems portal — bot.helixona.com

A single page that lists every Helixona application, mockup and tool. Plain HTML, no build step.

## Files

| File | Purpose |
|---|---|
| `index.html` | The page (layout, styles, search). Rarely needs changes. |
| `systems.js` | **The list of systems.** Edit this to add, remove or reorder cards. |
| `CNAME` | Tells GitHub Pages the custom domain (`bot.helixona.com`). |
| `.github/workflows/deploy-pages.yml` | Publishes the repository root to GitHub Pages on every push to `main`. |
| `logo-on-dark.png`, `favicon.svg` | Brand assets. |

## Adding a system

Open `systems.js` and add an entry inside the right group:

```js
{
  name: "Name shown on the card",
  description: "One sentence about what it does.",
  url: "https://…",          // leave "" for a placeholder
  status: "live",            // live | internal | soon | external
  tags: ["ops"],             // optional
  links: [{ label: "Sub-page", url: "https://…" }],   // optional quick links
}
```

Save, commit, push to `main`. The site updates in about a minute.

## Pointing bot.helixona.com at this site

Do this once, in two places.

**1. DNS (where helixona.com is managed, e.g. GoDaddy, Cloudflare, Squarespace):**

| Type | Host / Name | Value / Target | TTL |
|---|---|---|---|
| CNAME | `bot` | `crpozo.github.io` | default |

If the DNS is on Cloudflare, set the record to **DNS only** (grey cloud) so GitHub can issue the certificate.

**2. GitHub:** repository **Settings → Pages**:
- Source: **GitHub Actions**.
- Custom domain: `bot.helixona.com` → Save. GitHub checks the DNS record (can take a few minutes after the DNS change).
- Tick **Enforce HTTPS** once the check passes.

Until the DNS is in place the portal is reachable at `https://crpozo.github.io/helixona-main/`.

## Local preview

Open `index.html` in a browser, or run `npx serve .` in this folder.
