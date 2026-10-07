// Takes a PNG per route into /screenshots for email review.
// Usage: npm run build && npm run screenshots
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFileSync, statSync, existsSync, mkdirSync } from 'node:fs'
import { join, extname } from 'node:path'

const BASE = '/Helixona-Complex-Chronic-Program/'
const DIST = new URL('../dist/', import.meta.url).pathname
const OUT = new URL('../screenshots/', import.meta.url).pathname
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' }

const server = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]).replace(BASE, '/')
  let file = join(DIST, p)
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(DIST, 'index.html')
  res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' })
  res.end(readFileSync(file))
}).listen(4173)

const routes = [
  ['00-screens-index', '/screens', 'desktop'],
  ['01-patient-invite', '/patient/invite', 'phone'],
  ['02-patient-questionnaire', '/patient/intake', 'phone'],
  ['03-patient-uploads', '/patient/uploads', 'phone'],
  ['04-patient-forms', '/patient/forms', 'phone'],
  ['05-patient-submitted', '/patient/submitted', 'phone'],
  ['05b-patient-home', '/patient/home', 'phone'],
  ['06-staff-inquiries', '/staff/inquiries', 'desktop'],
  ['07-staff-patients', '/staff/patients', 'desktop'],
  ['07b-staff-create-patient', '/staff/patients/new?inquiry=INQ-2208', 'desktop'],
  ['07c-staff-invitation-tracker', '/staff/patients/P-0045?tab=invitation', 'desktop'],
  ['08-staff-advisor-interview', '/staff/patients/P-0043?tab=interview', 'desktop'],
  ['09-staff-admissions-outcome', '/staff/patients/P-0043?tab=admissions', 'desktop'],
  ['10-staff-intake-review-queue', '/staff/intake-review', 'desktop'],
  ['10b-staff-intake-review-detail', '/staff/patients/P-0043?tab=intake', 'desktop'],
  ['11-staff-chart-prep-queue', '/staff/chart-prep', 'desktop'],
  ['11b-staff-chart-prep-detail', '/staff/chart-prep/P-0044', 'desktop'],
  ['12-staff-ecw-exceptions', '/staff/ecw-exceptions', 'desktop'],
]

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined })
for (const [name, route, kind] of routes) {
  const ctx = await browser.newContext({ viewport: kind === 'phone' ? { width: 430, height: 932 } : { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  await page.goto(`http://localhost:4173${BASE}#${route}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: kind !== 'phone' })
  console.log('✓', name)
  await ctx.close()
}
await browser.close()
server.close()
