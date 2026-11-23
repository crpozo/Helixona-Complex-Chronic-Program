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
| Enrollment | Patients never self-enroll in the program. Website “Become a patient” form (replaces Typeform) has two doors: **Complex Chronic** asks three qualifying questions, then a screening call, then the advisor sends the questionnaire link; **Health Optimization** gets its secure link automatically. Separate **“Book a treatment”** flow lets anyone book and pay for a single therapy (with that therapy's consent) without enrolling; EBOO and Erchonia laser require physician clearance. (Weekly review Oct 20, 2026.) |
| Money rules | Month 0 (assessment) is a separate one-time charge, not part of the $18,000 membership. Program is $2,000/month × 9, may continue month-to-month after Month 9 by physician + patient decision. A failed payment never automatically discharges a patient or changes clinical care. |
| Healing Roadmap | Every patient is on one of **seven roadmap stages** (What is your Why → Stabilization → Identify Lead Actors → Resolve Lead Actor → Resolve Next Actors → Rewiring Resilience → Graduate to Maintenance & Longevity) and has a list of **actors** (root causes such as Mold, Lyme) with one lead actor. The stage and actors are visible to the patient (home, booking) and to every staff screen about the patient; each modality declares the stages it is permitted in, whether physician authorization is required **per pathway** (Complex Chronic / Chronic / Health Optimization) and which lead actors it applies to. Choosing a room or device sets its eCW resource automatically. Oxygen nano bath and hydrogen nano bath are separate modalities. (Nov 6, 2026.) |
| Patient-screen rules (Nov 12, 2026) | Health Optimization shows **no time estimate** for its questionnaire (not known yet). The crash report does not list chest pain or shortness of breath as symptoms; it carries a fixed line telling the patient to call 911 for those. A contact request from a crash report **notifies the care team in eCW**. Booking lists bookable therapies first and lets the patient **request a review** of any therapy not available to them, or of the plan. Staff can record a phone inquiry with the **same two options as the website** (Chronic or Complex Chronic Recovery / Health Optimization). Every text, email and call is kept in a **communication log** on the patient record. The inquiry list has no NP-care pathway. |
| Staff product rules (Nov 16, 2026) | **One Patients screen**: invitation, intake review, chart prep and eCW exceptions are views and filters of the same list; the detail has tabs for each, plus Notes / Communication and Scores & check-ins. Membership and payments stay on their own screens. **Staff see full names, not internal IDs** (this replaces the earlier ID-only rule); the eCW number is secondary. Notes have categories (chart prep, intake, admission, billing, scheduling, general), show at once when saved, and the newest shows on the overview. **Metric tiles and saved views are per user.** The bot is called the **AI Agent** in the interface. Admissions outcomes include **Waitlist** and **Pending information**. Membership statuses offered: Active · 9-month, Active · month-to-month, Paused, Maintenance, Graduated, Withdrawn, Discharged, each with a start and end date; when terms change the **agreement is sent for e-signature**. **Family plans** exist (one payer, several members). An alert is either **Resolved or Pending** with the action still needed; there is no separate acknowledge step, and escalating asks for confirmation. The calendar shows **time down the side and treatments across the top**, with selectable time steps; each treatment is sold in **lengths with their own price**. The SF-36 is called the **Quality of Life questionnaire** and repeats **every 3 months**. The staff menu is a grouped sidebar with an **Admin setup** section. |
| Inquiries, patients and naming (Nov 18, 2026, from the clinic's sheets) | The assessment step is called **A&P** in the interface (statuses: Pending information, Accepted for A&P, A&P scheduled, A&P in progress, A&P complete). Older text that says Month 0 means the same step. **An inquiry is not a patient.** Inquiry statuses, in order: Lead received, Waiting for response, Pending information, Interview scheduled, Waiting for admission review, Accepted, Waitlisted, Denied (give reason). **Accepted adds the person to the patient list**; Waitlisted adds them to the email list; Denied stops contact. Once accepted: create the eCW account (system), send the new patient survey and consents (system), schedule the A&P appointment (advisor). The inquiry page collects the fields the clinic listed (contact, insurance incl. out-of-network deductible and out-of-pocket maximum, referral, health, commitment, dates) plus an internal section (level 1/2/3, priority, advisor notes, admission team review, notification date). The Inquiries screen shows one count per status, filtered by a period or custom dates, opens on **All**, and lets an advisor **take ownership**. **A&P complete** records the program (9-month, Stabilization, À la carte) and triggers contract and payment plus an eCW flag, or standard paperwork for à la carte. Every patient is marked **Cash or Insurance**. Patients report a **Flare or a Crash** using the clinic's two definitions, then how much it affects daily activities; a flare can be changed to a crash keeping its start date. The chart tab is called **Data** and includes digestion. Patients have a **Medications & supplements** screen. Admin setup has **Packages & documents** (packages assigned per case, several per person) and **Users & permissions** (administrators only). Status lists always follow journey order. |
| Medications and flare reporting (Nov 19, 2026, from the clinic's two HCOS briefs in `docs/source/`) | **My Medications & Supplements** keeps three separate facts per item: ordered (eCW prescription, Fullscript, or added by the patient), obtained (Fullscript delivery, pharmacy fill, or unknown; unknown is not unfilled), and what the patient reports taking (Taking as directed, Taking inconsistently with most days / some days / rarely, Not started, Paused, Stopped, Decided not to start, with a short reason). **No daily pill log**: the patient reports changes when they happen and confirms the list monthly (No changes / Something changed / Review my full list; unchecked never means stopped; silence shows "Not recently confirmed"). A patient report never changes the physician's order. Patients can add outside medications and self-started supplements (search, manual entry, bottle scan later). The physician sees **Since the last visit**: recommended / started / not started with the names shown at once, other changes, and items for today's visit. Use the word **medication** for drugs and supplements; therapy and treatment mean provider- or device-delivered care. The **flare or crash report** opens with a safety check (any warning sign stops the report and shows Call 911), then flare or crash and impact, symptoms in groups with follow-up questions only for the ones selected, overall severity, onset and trend, optional contributors (incl. a recent treatment or a medication change), and what to do with the report. Its wording is a draft until the Medical Director approves it. List + detail admin screens show the list at full width and open the detail in a side panel. |
| Inquiry page and list (Nov 19, 2026) | The Inquiries list has one column per fact: Name (preferred name underneath), Age, Inquiry received, City / State, Status, Insurance, Owner. The inquiry page collects **first name and last name** separately, **preferred name / nickname**, **date of birth** (age is calculated, never typed), **biological sex**, and a **ZIP code that fills in city and state**. Uploaded documents can be read by the **AI Agent**, which drafts a summary for the advisor (a draft, never a clinical opinion). The internal section ends with an **admission decision**: Accept patient, Discuss / review, Declined (reason required: distance, not sick enough, finances, cannot commit to the schedule, better served by another kind of care, other) or Waitlist; each sets the inquiry status. |
| Interview scheduling (Nov 19, 2026) | The advisor has an **Interview calendar** connected to her **Google Calendar**. She sets weekly windows and the interview length; times busy in Google or already booked are never offered, and only busy/free is read. From the inquiry she **sends a scheduling link**; the person picks a day and time on a public page and can **choose a different time** later from the same link. Booking sets the inquiry to Interview scheduled and adds the event to the advisor's calendar. The decision notification records the **date and the method (email or phone)**. |
| Advisor's inquiry requests (Nov 19, 2026, email from the patient advisor) | The phone number is typed as **digits only** and formatted by the app. Insurance is a **drop-down of the PPO plans the clinic accepts** (list in `insurancePlans`, `src/mock/store.ts`) plus Other with free text. The inquiry records **in-network and out-of-network** deductible and out-of-pocket maximum, each with the amount met, and accepts uploads of the **primary card (front, back)**, the **secondary / supplemental card (front, back)**, the **insurance plan document** and the **plan analysis** for the admissions meeting. "How many specialists" is a drop-down: 0 to 9, 10+, 20+. The internal section has a **Patient interaction & mutual respect assessment** on five levels. The Inquiries list also shows **Priority**. |
| Patient app review (Nov 23, 2026) | **Wording:** patient screens never name a physician; they say **your provider**. Response time is always **1–2 business days**. Sessions are booked **at least 2 hours ahead**. **Home:** under "Your next step" come six large blocks (Daily check-in, Report a flare or crash, Medications & supplements, Book a session, Ask Helixona, Message the clinic), then a **to-do list that shows only what is still open**; the roadmap **starts collapsed** and remembers the patient's choice; membership, payments, sharing and notifications live under **Settings** (gear icon). **Daily check-in v4** (`docs/source/HCOS_Daily_Health_Checkin_v4.md`): every slider runs **0 = worst, 10 = best**; categories are Energy, Physical Comfort, Mental Clarity, Sleep Quality, Digestive Comfort (the separate fatigue slider was removed at the review); each has a definition behind an info button and optional details (symptom checkboxes, follow-ups, note); yesterday's value is shown for reference and only counts if the patient taps **Same as yesterday**. **Medications:** statuses are Taking as directed, Taking inconsistently, Not started, Paused, Stopped, Decided not to start; reasons use the clinic's revised wording plus "I ran out and have not refilled it" (asks how long) and "My prescription expired" (asks whether to renew); the change date is asked separately from today's date; a different amount than recommended is captured as amount, frequency and date; in the full-list review **every unchecked item asks what happened**; items new since the last visit are listed on top; an item can be added as prescribed by a Helixona provider; a **monthly check-in prompt** opens on the home screen. **Flare report:** the "What happens next?" note and the footer use the clinic's wording. **Booking** follows the website: earliest times as cards, "Not seeing a time that works?" (weekdays, time windows, date), View full calendar, Ask our team to help me schedule (note or call). **Plan of Care:** patients and staff see the full current plan and a summary of what changed in each version. **Sharing:** the patient names a person (full name, email or phone), ticks what they may see, whether the clinic may talk with them, and signs an authorization. **Voice typing:** every free-text box offers a microphone. **Ask Helixona** answers with buttons that open the right screen and can hand over to a person; **Call the clinic** is one tap and is greyed out with "The office is currently closed" outside Mon–Fri 8 AM–5 PM. App notifications are an optional third channel. |
| Inquiries review (Nov 23, 2026) | The mutual respect assessment uses the clinic's five classifications with definitions, defaults to **Not yet assessed** and is never assigned automatically. Decline reasons: distance, does not meet clinical criteria, looking for a primary care provider (PCP), finances, cannot commit to the schedule, better served by another kind of care, other. **Discuss / review** and **Waitlist** also record reasons; Waitlisted means on the waitlist and the email list. The inquiry has a **Summary** in the advisor's admissions format (copyable), a **Notes and communication** log saved with time and status, optional **reminders** that appear in **Tasks & reminders** (grouped by person, editable), and **Send a form** for extra forms such as travel and driver arrangement. The list filters by **several statuses at once** and lets the advisor **select inquiries and download their summaries** in one file. The interview calendar connects to the **Microsoft Teams calendar**. The Data tab's check-in history can be **downloaded**. |
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
16. Patient: daily health check-in (sliders for energy, fatigue, pain, brain fog, sleep + follow-up on treatments actually received), crash/flare report (severity, symptoms, free text, treatment context, onset, request contact).
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
- Staff lists show the patient's full name (decision of Nov 16, 2026); the internal ID is not shown and the eCW number is secondary. Nothing patient-identifying in notification previews (SMS/email mock content).
- Light and dark theme support is nice to have, not required for mockups.
- Branding: Helixona has no design system file yet. Use a calm clinical palette (deep teal accent, warm neutral grays), a humanist sans (e.g., IBM Plex Sans or Source Sans 3), generous spacing. Do not use default Tailwind blue/indigo or generic SaaS templates. Keep it consistent across patient and staff surfaces.

## 7. Suggested mockup stack

- **React + Vite + TypeScript + Tailwind**, all state in memory, mock data in `src/mock/*.ts`, routes per screen. No backend, no auth; a role switcher in the top bar swaps between Patient / Advisor / Karina / Charlene / Nursing / Physician / Admin views.
- Mobile viewport for patient routes (render inside a phone frame on desktop), full width for staff routes.
- One `screens.md` in the repo that lists every route, its purpose, and open questions, so the client can review by route.
- Export: the client reviews in the browser; also produce PNG screenshots per route (Playwright) into `/screenshots` for email review.

If something simpler is preferred, plain HTML + Tailwind CDN per screen is acceptable, but keep a shared stylesheet and components file so the screens stay consistent.

## 8. Open items (show as "to confirm" in the mockups, don't invent)

- ~~Final clinical questionnaire (Medical Director).~~ Received Oct 22, 2026 as `docs/source/NP - Questionnaires 2.xlsx`; implemented as supplied in `src/mock/questionnaireContent.ts` (generated by `scripts/build_questionnaire.py`). Complex Chronic = all six forms (New Patient Packet, SF-36, Metabolic, Mold, Lyme, Brain); Health Optimization = L2/L3 New Patient + Follow-Up. Still open: clinical publish by Dr. D.
- Exact eCW location for the intake note and PDF category (session with Charlene).
- eCW version: web client or desktop client (changes the bot design, not the mockups).
- Whether rooms/devices exist as eCW resources today.
- ~~Final list of intake/HIPAA/financial/consent forms (Shibani).~~ Received Oct 22, 2026: ten consents in `docs/source/consents/`, generated into `src/mock/consentContent.ts` by `scripts/build_consents.py`. Still open: who countersigns, which are signed at intake vs. first visit, annual renewal, and the Privacy Officer contact placeholder in the Notice of Privacy Practices.
- Who in eCW receives a crash-report contact request, and in what form (message, telephone encounter, task).
- E-signature provider and the agreement text for each membership status (attorney).
- Family plan pricing, who may share a plan, and what happens when one member pauses or leaves.
- Session lengths and prices per treatment (the mockup shows sample prices).
- Where prescription changes come from for the scores chart (eCW medication list or entered by staff).
- What A&P stands for, for a first-time reader (the mockup shows only the abbreviation), and whether patients see the same word.
- Who orders and edits the medication and supplement list (eCW medication list or entered here), and how adherence is used clinically.
- Final permission matrix per role, and who besides administrators may edit packages.
- Medications: whether Fullscript and pharmacy fill data can be received, which source screens for interactions, caregiver access, and who reviews patient-added items.
- Flare report: Medical Director approval of the safety check, follow-up questions and which answers stop the report; the recovery check-in interval.
- Inquiry AI summary: which documents it may read, what it must never state, and who signs off on it before the admission review.
- Interview scheduling: one Teams calendar per advisor or a shared clinic calendar, how far ahead a person may book or change, and whether the call is by phone or video.
- Daily check-in v4: whether Physical Exhaustion returns as a sixth slider, and whether a standard pain-intensity score is kept next to Physical Comfort (clinical leadership).
- Sharing with a caregiver: final authorization wording, expiration and sensitive categories (attorney).
- Plan of Care: where it is written today and how each new version reaches the app.
- Voice typing: which speech service may be used with health information.
- Payment rules: retry cadence, grace period, hold policy, refunds (Karina + attorney).
- eCW license: any clause on automated access (attorney).
- Whether eCW offers FHIR R4 / HL7 interfaces / healow Open Access and at what cost (would replace parts of the bot).

## 9. Working agreements for Claude Code

- Keep this file updated when a decision changes. Add new decisions to §2.
- Do not add real patient data anywhere. Sample data only.
- Keep the module boundaries in §4 as folder boundaries so the mockup maps to the real build.
- When a requirement in `docs/requirements-v1.0.md` conflicts with §2 of this file, §2 wins (it is newer); note the conflict in `docs/decisions.md`.
- Spanish is fine in chat with the developer; UI copy, code, and docs are in English.
