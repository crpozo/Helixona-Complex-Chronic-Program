# Screens — Helixona Complex Chronic Program mockups

Live mockup: **https://crpozo.github.io/Helixona-Complex-Chronic-Program/**
Routes use a `#` prefix (e.g. `…/#/patient/intake`) so every link works on GitHub Pages. Use the **role switcher** in the top bar to change who you are viewing as; the **All screens** index lists everything below.

All data is fictional. Clinical questions are placeholders labeled *“Sample question — final content from Medical Director.”* Anything marked **To confirm** is an open item from CLAUDE.md §8, not a decision.

## Priority 1 — Intake module (built)

### Patient (phone frame on desktop, full-screen on phones)

| # | Route | Purpose | Open questions |
|---|---|---|---|
| 1 | `#/patient/invite` | “You’ve been invited by Helixona” landing. Verify by secure email link **or** texted 6-digit code (both shown), then a “what we’ll do together” checklist. | Final sign-in method (Carlos). Whether the patient should see the advisor's name. |
| 2 | `#/patient/intake` | Section overview with progress, “Saved just now”, resume where you left off. Each section: one question group per screen, all question types (short/long text, single/multi choice, yes/no, date, number, 0–10 scale, repeating medication list), conditional questions, required-field validation. | Real questionnaire (Medical Director). Whether sections can be answered out of order. |
| 3 | `#/patient/uploads` | Required and optional document slots; take photo / choose file; inventory; **returned item** flow (advisor asks for a new copy). | Max file size and accepted types. Whether insurance card is already collected by the advisor. |
| 4 | `#/patient/forms` | Assigned documents with version and signer; open → must scroll to end → agree → typed **or** drawn signature → timestamped. Patient gets a copy by email. | Final form list, versions, and who signs (Shibani). Which forms need staff countersign. |
| 5 | `#/patient/submitted` | Confirmation + “what happens next” (advisor review → chart prep → Month 0 scheduling + fee). | Exact wording about Month 0 fee timing. |
| — | `#/patient/home` | “My program” home: next step, package status tiles, locked future features, monitoring notice. | — |

### Staff (desktop)

| # | Route | Role | Purpose | Open questions |
|---|---|---|---|---|
| 6 | `#/staff/inquiries` | Advisor | Typeform inquiries with pathway, source (incl. campaign), status, owner, next action; tabs for Complex Chronic vs. other pathways. | Duplicate-matching rules. Who owns non-Complex-Chronic inquiries. |
| 7 | `#/staff/patients/new` | Advisor | Create patient record (pre-filled from inquiry) and send invitation: method, channels, expiry, message preview with no patient-identifying content. | Reminder cadence (Priority 3 templates). |
| 7 | `#/staff/patients` and `#/staff/patients/P-0045?tab=invitation` | All staff | Patients by internal ID with invitation state (sent → delivered → opened → started → submitted; expired/reissued), intake %, chart-prep status. Invitation tracker with delivery history and reissue/remind actions. | — |
| 8 | `#/staff/patients/P-0043?tab=interview` | Advisor | Internal qualification interview, clearly marked **never visible to the patient**, stored separately from the medical record. Insurance details collected during interview. | Interview question set (advisor team). |
| 9 | `#/staff/patients/P-0043?tab=admissions` | Advisor / Karina | Admissions outcome: Accepted for Month 0 / Denied / Patient fell off, with reason codes (ADM-, DEN-, FO-), effective date, alternate pathway, notes, staff member. | Final reason-code list. |
| 10 | `#/staff/intake-review` and `#/staff/patients/P-0043?tab=intake` | Advisor | Queue + detail: completeness checklist (questionnaire, each document, each form), **Return item to patient** with reason and message, non-clinical follow-up note, **Mark ready for chart prep** (blocked until complete, with override). | Whether “mark ready anyway” should exist. |
| 11 | `#/staff/chart-prep` and `#/staff/chart-prep/P-0044` | Charlene | Queue by chart-prep status (Awaiting intake → Submitted → Reviewed → Ready → Placed in eCW / Exception). Detail: formatted note with **Copy to clipboard**, **Download PDF**, document inventory, and both placement paths: **eCW connector** (8 verified steps, duplicate marker, nightly schedule, verification state) and **Copy & paste** (3 steps + confirmation). | Exact eCW note location and PDF category (Charlene). eCW web vs. desktop client. |
| 12 | `#/staff/ecw-exceptions` | Charlene / technical admin | Exception queue: job type (J2 note+PDF, J3 booking mirror, J4 schedule read-back), patient ID, failed step, severity (critical = after a write, no auto-retry), screenshot placeholder, **Retry** / **Done manually · close** with required note. | Connector health thresholds. |

## Priority 2 — Surveys, alerts, membership (placeholders only)

`#/staff/registry`, `#/staff/alerts`, `#/staff/clinical-config` show what will be mocked after Priority 1 review (CLAUDE.md §4, screens 13–18).

## Priority 3 — Booking, payments, notifications (placeholders only)

`#/staff/calendar`, `#/staff/payments`, `#/staff/dashboards` (CLAUDE.md §4, screens 19–24). Patient booking, agreement + Stripe payment setup, and message templates will be added here.

## Shared patterns

- **Queues** share one table pattern: severity stripe + status pill (text, never color alone), who/when/why on every row.
- **Who · when · why** appears on every list and detail (actor, timestamp, reason code) because the real system is fully audited.
- **Version tags** on anything clinical: “Questionnaire v3 · published by Dr. D. on Sep 15, 2026”.
- **Monitoring notice** (“not continuously monitored, not a substitute for 911”) on the patient home; it will appear on every survey and crash-report screen in Priority 2.

## Brand

Helixona's live site was not reachable from the build environment, so the palette follows CLAUDE.md §6: deep teal accent (`#0F6E6A`), warm neutral grays, Source Sans 3 for UI and Fraunces for headings. All colors are tokens in `src/index.css` (`@theme`) and can be swapped in one place when the official palette is supplied. The wordmark/helix mark is a placeholder.
