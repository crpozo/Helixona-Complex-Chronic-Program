# Helixona Complex Chronic Program — MVP Mockups

This file is the working context for Claude Code on this project. Read it fully before doing anything. The full requirements brief is in `docs/requirements-v1.0.md`; this file summarizes it and records the decisions made after it was written.

## 1. What we are building

An operational web application for Helixona's **Complex Chronic nine-month program** (an integrative medicine practice in Irvine, CA). The app sits next to the existing EHR, **eClinicalWorks (eCW)**, and handles everything the EHR does badly for this program: patient intake with e-signatures, configurable check-in surveys and alerts, membership lifecycle tracking, booking of program modalities (rooms and devices), the membership agreement with recurring payments, and email/SMS notifications.

Pilot target: 3–5 patients. Multi-tenant later; single tenant (Helixona) now, but keep an `organization_id` on every table.

**Current task: clickable mockups (no backend).** Mockups come first, then the real build. Mockups are reviewed by non-technical clinic owners, so they must look like a finished product, use realistic sample data, and avoid technical jargon in the UI.

## 2. Decisions already made (do not reopen)

| Topic | Decision |
|---|---|
| EHR integration | **No eCW API.** Integration runs through a bot (browser automation, dedicated eCW user) that writes the intake note and PDF into the chart, mirrors modality bookings into eCW, and reads the eCW schedule to reconcile. Every bot write is read back and verified; failures land in a visible exception queue. |
| Scheduling source of truth | **The app owns availability and bookings for program modalities** (rooms/devices). eCW receives a mirror copy. Insurance visits (NP, IV, labs) are still booked in eCW by staff; the app shows them read-only. |
| Payments | **Stripe.** Hosted collection (Checkout / Elements), card and ACH, recurring anniversary billing. The app stores only Stripe customer/payment-method/subscription IDs, never card or bank data. |
| Delivery | **By module, intake first.** Phase 1 = patient intake → signed forms → note + PDF placed in eCW. Then surveys/alerts, membership registry, booking, payments, notifications. |
| Clinical content | The Medical Director's questionnaire is implemented **exactly as supplied**. The software team does not rewrite, reorder or reinterpret clinical questions. Until the real questionnaire arrives, use clearly labeled placeholder questions. |
| Configuration over code | Surveys, alert rules, modality rules, forms, message templates and lifecycle rules are **data, versioned, edited in admin screens**, not hard-coded. |
| Enrollment | Patients never self-enroll. A patient advisor creates the record and sends a secure invitation after the website inquiry and qualification interview. |
| Money rules | Month 0 (assessment) is a separate one-time charge, not part of the $18,000 membership. Program is $2,000/month × 9, may continue month-to-month after Month 9 by physician + patient decision. A failed payment never automatically discharges a patient or changes clinical care. |
| Monitoring language | The app must never present itself as continuous, after-hours or emergency monitoring. Every survey and crash-report screen carries the "not continuously monitored, not a substitute for 911" notice. |

## 3. Users and what each one sees

| Role | Device | Core screens |
|---|---|---|
| **Patient** | Phone first, desktop second | Invitation landing, intake questionnaire (save & return), document uploads, e-signature, "my program" home, survey, crash/flare report, session booking, payment setup, receipts |
| **Patient advisor** | Desktop | Inquiry list, create patient + send invitation, internal interview notes (never visible to patient), admissions outcome, intake completeness |
| **Operations / finance (Karina)** | Desktop | Membership registry, payment status, failed-payment queue, booking exceptions, configuration review, reports |
| **Chart prep (Charlene)** | Desktop | Intake review, copyable eCW note text, PDF download, chart-prep status, eCW connector exceptions |
| **Nursing / care team** | Desktop + phone | Alert queue, patient survey history, follow-up notes, escalation |
| **Physician / Medical Director** | Desktop | Clinical config approval (publish questionnaire, survey, alert rules), escalations, Plan of Care authorization, Month 9 decisions |
| **Program admin (Cassandra)** | Desktop | Dashboards, lifecycle rules, patient-facing language approval |
| **Technical admin** | Desktop | Users, roles, system mappings, bot health, audit export |

Use first names in sample data for staff roles the way the clinic does (advisor, Karina, Charlene, nursing, physician). Use realistic but fictional patient names and internal IDs like `P-0043`.

## 4. Mockup scope and priority

### Priority 1 — Intake module (build these first, end to end)

**Patient (mobile-first):**
1. Invitation landing: "You've been invited by Helixona" → verify identity (magic link or code; show both as options) → start.
2. Intake questionnaire: multi-section, progress indicator, save & return, question types: short text, long text, single choice, multiple choice, yes/no, date, number, 0–10 scale, medication list (repeating group), conditional sections. Required-field validation. Placeholder content labeled "Sample question — final content from Medical Director".
3. Document uploads: insurance card (front/back), photo ID, medication/supplement list, labs, imaging, records, prior plans, referrals, optional advance directive. Shows inventory of what's uploaded.
4. Forms & consents: list of assigned documents (intake, HIPAA, privacy, communications consent, financial policy); each opens, scrolls, signs with typed/drawn signature, timestamp. Patient gets a copy.
5. Submission confirmation + "what happens next".

**Staff (desktop):**
6. Inquiry list (from Typeform) with pathway, source, status, owner.
7. Create patient record + send invitation; invitation status tracker (sent, delivered, opened, started, submitted, expired, reissued).
8. Internal advisor interview form (clearly marked internal; separate from medical record).
9. Admissions outcome: accepted for Month 0 / denied / fell off, with reason codes.
10. Intake review: completeness checklist, missing items, "return item to patient" action, non-clinical follow-up note, "mark ready for chart prep".
11. Chart prep screen (Charlene): formatted note preview with **copy to clipboard**, PDF download, uploaded-document inventory, status (awaiting intake → submitted → reviewed → ready for chart prep → placed in eCW → exception). Show both the manual path (copy/paste) and the automated path ("eCW connector will place this" with verification state).
12. eCW connector exception queue: job type, patient ID, failed step, screenshot thumbnail placeholder, actions "retry" / "done manually, close".

### Priority 2 — Surveys, alerts, membership

13. Admin: survey template builder (question bank, sections, scoring, branching, versions, draft → review → approved → published → retired).
14. Admin: modality configuration (identity, Plan of Care rules, scheduling rules, preparation instructions, survey follow-up offsets, alert rules, documents).
15. Admin: alert rule editor (trigger, level, recipients by role/physician/backup, response target, escalation timer, after-hours behavior) and the precedence view: global → program → stage → modality → physician → patient override, showing which layer applied.
16. Patient: survey screen (post-treatment +1/+3/+7 days), crash/flare report (severity, symptoms, free text, treatment context, onset, request contact).
17. Care team: alert queue (unassigned, assigned, acknowledged, overdue, escalated, resolved, reopened) with level pills; patient longitudinal view (scores over time).
18. Membership registry: list + patient detail with status history, reason codes, Month 0 dates, membership start, pauses, Month 9 review, total active months. Status list is in requirements §12.

### Priority 3 — Booking, payments, notifications

19. Patient: session booking showing only authorized services; per modality: "Book now", "Request", or "Not in your care plan"; spacing/frequency rules shown in plain language; insurance visits read-only from eCW.
20. Staff: resource calendar (one lane per room/device), booking exceptions (slot conflict in eCW, mirror failed).
21. Patient: agreement signing + Stripe payment setup (card/ACH), payment schedule view, receipts.
22. Karina: failed-payment queue (amount, attempt, reason category, next action, communication history), holds requiring human approval.
23. Admin: message template editor (event, audience, channel, timing, template with merge fields, stop rule) with preview and test-send; delivery log.
24. Dashboards: intake completion, chart prep, alerts, booking exceptions, contract completion, payment failures, active members, Month 9 reviews, pilot defects.

## 5. Flows the mockups must make visible

**Patient journey (requirements §3):** inquiry → advisor interview → insurance & admissions → Month 0 (separate charge, intake, paperwork) → assessment & Plan of Care → program offered (or not) → contract + payment authorization → active care (surveys, bookings, follow-up) → Month 9 review (continue / maintenance / graduate / withdraw / discharge). The contract step is **gated**: it is only available when the registry status is "Program offered".

**Intake → eCW (bot job J2):** intake marked "ready for chart prep" → job queued (idempotent key `intake_id:version`) → bot opens patient by eCW ID, confirms name + DOB → checks whether a note with marker `HLX:<intake_id>:v<n>` already exists → pastes note at the location Charlene uses → reads back → uploads PDF `Helixona_Intake_<id>_v<n>.pdf` → reads back → status "placed in eCW" + review task for Charlene. Any verification failure after a write = critical exception, no automatic retry.

**Booking → eCW mirror (bot job J3):** patient books → app validates Plan of Care, spacing, frequency, resource → app locks the resource (this is the real booking) → bot creates mirror appointment in eCW with reason `HLX:<appt_id>` → reads back → "synced". If the eCW slot is taken by a manual booking: exception for staff; the patient's booking stays valid. Patient sees "Reserved" immediately and "Confirmed" only after verification.

**Payment failure:** Stripe webhook → task in Karina's queue → patient notice → retries day 3 and day 5 (configurable) → eligible for scheduling hold after 5 days **only with staff confirmation** → never auto-discharge.

**Alert lifecycle:** survey answer or crash report → rules engine → level (informational / routine review / nurse follow-up / urgent clinical review / emergency instruction; labels configurable) → recipients by role/physician/backup → queue item → acknowledge → follow-up note → resolve / reopen; escalation when response timer lapses.

## 6. UI and content rules

- Plain language everywhere in patient-facing and staff-facing UI. No "webhook", "token", "PHI", "idempotent", "MFA" in labels. Say "secure", "verified", "copied to eCW", "waiting for confirmation".
- Patient screens: large touch targets, one question group per screen on mobile, obvious save state ("Saved just now"), progress indicator, ability to leave and resume.
- Staff screens: dense but scannable; queues as the primary metaphor (alerts, intake, chart prep, payments, eCW exceptions share one pattern); state encoded with pills and a severity stripe, not color alone.
- Every list and detail shows **who / when / why** (actor, timestamp, reason code) because the real system is fully audited.
- Show configuration version on anything clinical ("Questionnaire v3 · published by Dr. D. on …").
- Show the "not continuously monitored / not a substitute for 911" notice on survey and crash-report screens and on the patient home.
- Patients are identified by internal ID in staff lists; full name opens in the detail view. Nothing patient-identifying in notification previews (SMS/email mock content).
- Light and dark theme support is nice to have, not required for mockups.
- Branding: Helixona has no design system file yet. Use a calm clinical palette (deep teal accent, warm neutral grays), a humanist sans (e.g., IBM Plex Sans or Source Sans 3), generous spacing. Do not use default Tailwind blue/indigo or generic SaaS templates. Keep it consistent across patient and staff surfaces.

## 7. Suggested mockup stack

- **React + Vite + TypeScript + Tailwind**, all state in memory, mock data in `src/mock/*.ts`, routes per screen. No backend, no auth; a role switcher in the top bar swaps between Patient / Advisor / Karina / Charlene / Nursing / Physician / Admin views.
- Mobile viewport for patient routes (render inside a phone frame on desktop), full width for staff routes.
- One `screens.md` in the repo that lists every route, its purpose, and open questions, so the client can review by route.
- Export: the client reviews in the browser; also produce PNG screenshots per route (Playwright) into `/screenshots` for email review.

If something simpler is preferred, plain HTML + Tailwind CDN per screen is acceptable, but keep a shared stylesheet and components file so the screens stay consistent.

## 8. Open items (show as "to confirm" in the mockups, don't invent)

- Final clinical questionnaire (Medical Director).
- Exact eCW location for the intake note and PDF category (session with Charlene).
- eCW version: web client or desktop client (changes the bot design, not the mockups).
- Whether rooms/devices exist as eCW resources today.
- Final list of intake/HIPAA/financial/consent forms and who signs each (Shibani).
- Payment rules: retry cadence, grace period, hold policy, refunds (Karina + attorney).
- eCW license: any clause on automated access (attorney).
- Whether eCW offers FHIR R4 / HL7 interfaces / healow Open Access and at what cost (would replace parts of the bot).

## 9. Working agreements for Claude Code

- Keep this file updated when a decision changes. Add new decisions to §2.
- Do not add real patient data anywhere. Sample data only.
- Keep the module boundaries in §4 as folder boundaries so the mockup maps to the real build.
- When a requirement in `docs/requirements-v1.0.md` conflicts with §2 of this file, §2 wins (it is newer); note the conflict in `docs/decisions.md`.
- Spanish is fine in chat with the developer; UI copy, code, and docs are in English.
