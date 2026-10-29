# eCW bot flows — build specification

Audience: Kai (bot builder), Carlos. Status: draft v1, Oct 27 2026. Companion to `How-the-solution-fits-together.pdf` and CLAUDE.md §2 and §5.

One bot, one dedicated eClinicalWorks (eCW) user, five job types. The app (Helixona platform) is the source of truth for intake, program bookings and treatment bookings; eCW receives copies and stays the source of truth for insurance visits and the legal chart. The bot never decides anything clinical and never deletes or edits an existing eCW record.

| Job | Name | Direction | When | Writes to eCW? |
|---|---|---|---|---|
| J1 | Verify chart | read | when the advisor creates a patient record | no |
| J2 | Intake note + PDF | write | when intake is marked "ready for chart prep" | yes (note, document) |
| J3 | Appointment mirror | write | when a program or treatment booking is confirmed by the app | yes (appointment) |
| J4 | Schedule read | read | every morning, and on demand | no |
| J5 | Appointment update / cancel mirror | write | when an app booking is rescheduled or cancelled | yes (existing mirror appointment only) |

## 0. Rules that apply to every job

1. **Dedicated user.** The bot logs in to eCW as its own user (suggested name `HLX Bot`) with the minimum rights: open chart, add progress note / document, create and edit appointments, read schedule. Every eCW audit line then shows who wrote it.
2. **Queue, not calls.** The app writes a job row (`bot_jobs`: id, type, patient_id, payload, idempotency_key, status, attempts, created_by, created_at). The bot polls the queue, claims one job at a time, and writes back status, timestamps, read-back result and a screenshot per step. Statuses: `queued → running → verified | needs_review | failed`.
3. **Idempotency.** Every job carries a key (table below). Before writing, the bot looks for the marker in eCW. If it finds it, the job ends as `verified (already present)` and nothing is written twice.
4. **Read back after every write.** A write is not done until the bot reopens the record and reads the marker back. No read-back = `needs_review` (critical exception). No automatic retry after a write attempt.
5. **Retry only before the first write.** Login, navigation and search steps may retry 3 times with 30 s, 2 min, 10 min backoff. Once a write has been attempted, stop and escalate.
6. **Patient identity check.** Before any write the bot confirms, on the open chart: last name, first name and date of birth equal the app record (normalize case, accents and spaces). Mismatch = `failed: identity mismatch`, nothing written.
7. **Screenshots.** One PNG per step, kept 90 days, shown as thumbnails in the eCW connector exception queue (`#/staff/ecw-exceptions`). Never store screenshots with PHI outside the app's storage.
8. **Working hours.** Writes only between 6:00 and 22:00 Pacific, and never while eCW shows a maintenance banner. J4 runs at 6:30.
9. **Session hygiene.** One browser profile, logout at the end of each batch, re-login on any "session expired" screen. Never save passwords in the browser.
10. **No surprises for staff.** Everything the bot writes carries the prefix `HLX` so Charlene and the front desk can tell bot entries from human ones.

Idempotency keys and markers:

| Job | Key | Marker written in eCW |
|---|---|---|
| J1 | `verify:<patient_id>` | none |
| J2 | `intake:<intake_id>:v<n>` | note text starts with `HLX:<intake_id>:v<n>`; document named `Helixona_Intake_<intake_id>_v<n>.pdf` |
| J3 | `appt:<appointment_id>` | appointment reason / notes = `HLX:<appointment_id>` |
| J4 | `schedule:<date>` | none |
| J5 | `appt:<appointment_id>:<revision>` | same appointment, notes updated to `HLX:<appointment_id>:r<revision>` |

## J1 — Verify chart

**Trigger.** Advisor saves a new patient record in the app (`#/staff/patients/new`) with an eCW chart number, or with name + DOB only.

**Input.** patient_id, first name, last name, DOB, eCW chart number (optional), phone (optional).

**Steps.**
1. Log in. Open Patient Lookup.
2. If a chart number was given: search by chart number. If not: search by last name + DOB.
3. Zero results → outcome `not found`. More than one exact name + DOB match → outcome `ambiguous`, list the chart numbers found.
4. One match: open the chart, read name, DOB, chart number, phone.
5. Compare with the app record (rule 6).
6. Write back to the app: `verified` with chart number, or `mismatch` with the differing fields.

**Outcomes in the app.** Patient record shows "eCW chart verified · <number> · <time>", or a task for the advisor: "Chart not found / Several charts match / Name or DOB differs". J2 cannot run until the chart is verified.

**Never.** J1 never creates a patient in eCW. Creating the chart is a front-desk action (to confirm with Charlene whether the app should ever do it).

## J2 — Intake note + PDF

**Trigger.** Charlene (or the advisor) clicks "Mark ready for chart prep" on the intake review (`#/staff/intake-review`). The app renders the note text and the PDF first; the job carries both.

**Input.** intake_id, version n, patient_id, eCW chart number (verified by J1), note text (plain text, structured headers, starts with the marker line), PDF file, PDF title.

**Preconditions.** J1 verified; note and PDF generated and stored; no other J2 job running for the same patient.

**Steps.**
1. Log in. Open the chart by chart number. Identity check (rule 6).
2. **Marker check.** Open the notes / documents list for the chart and search for `HLX:<intake_id>:v<n>`. Found in both places → end `verified (already present)`. Found in one place only → continue with the missing half only.
3. **Place the note.** Navigate to the location Charlene uses today (open item: exact note type and section, see CLAUDE.md §8). Paste the note text. Save.
4. **Read back the note.** Reopen the note from the list. Confirm the first line equals the marker and the character count equals the app's text ±1 % (eCW may normalize line breaks). Screenshot.
5. **Upload the PDF.** Open Patient Documents, choose the category agreed with Charlene (open item), upload `Helixona_Intake_<intake_id>_v<n>.pdf`, set the document date to the intake submission date. Save.
6. **Read back the PDF.** Confirm the document appears in the list with that file name and the date. Open it and confirm the first page renders the marker. Screenshot.
7. Write back `verified`, with the eCW note id / document id if visible on screen.

**Outcomes in the app.** Chart prep status → "Placed in eCW" with who / when, plus a review task for Charlene ("Check the note placement, then close"). Intake remains copyable for the manual path at all times.

**Failure handling.**
- Step 1–2 failures: retry per rule 5, then `failed` (nothing written). Charlene uses the manual copy / paste path.
- Step 3 or 5 attempted but read-back failed: `needs_review`, critical. Charlene opens the chart, fixes by hand and closes the exception with "Done manually". The bot never retries this version.
- New intake version (patient re-submits a returned item): new job with `v<n+1>`. The old note stays; the new note's first line states it supersedes v<n>.

## J3 — Appointment mirror (program bookings and treatment bookings)

**Trigger.** The app confirms a booking: a program session from `#/patient/book` (after Plan of Care, spacing and resource checks pass) or a treatment booking from `#/public/book` (after payment succeeds). The app has already locked the room or device; the patient sees "Reserved".

**Input.** appointment_id, patient_id, eCW chart number, service name, resource (room / device, mapped to the eCW resource or provider column, see mapping table), start, end, duration, patient-visible notes, booking source (program / treatment-only).

**Preconditions.** J1 verified. For treatment-only bookings by a brand-new person (no chart), the job waits in state `waiting for chart` and the front desk gets a task to create the chart; J3 runs once J1 verifies it.

**Steps.**
1. Log in. Open the scheduler on the appointment date and the mapped resource column.
2. **Marker check.** Search appointments for `HLX:<appointment_id>` (same day, same patient). Found → `verified (already present)`.
3. **Slot check.** Read the resource column for the start–end window. If any appointment already occupies it: do **not** write; end `conflict` with the existing appointment's details. The patient's booking in the app stays valid; staff resolve in the booking exceptions queue (`#/staff/calendar`).
4. Create the appointment: patient by chart number, resource / provider, start, duration, visit type agreed with the clinic (open item), reason or notes = `HLX:<appointment_id>` followed by the service name. Save.
5. **Read back.** Reopen the slot, confirm patient, start, duration and the marker. Screenshot.
6. Write back `verified` → the app shows the patient "Confirmed" and sends the confirmation message.

**Failure handling.** Step 4 attempted and step 5 failed: `needs_review`, critical; the patient still sees "Reserved" with "waiting for confirmation" until staff close the exception. Never create a second appointment for the same id.

## J4 — Schedule read

**Trigger.** Every day at 6:30 Pacific for today and the next 14 days; on demand from the resource calendar ("Refresh from eCW").

**Steps.**
1. Log in. For each day in the window, open the scheduler view that shows all resources / providers.
2. Read every appointment: patient chart number, provider or resource, start, end, visit type, status (scheduled, checked in, cancelled, no-show), notes.
3. Classify: notes starting with `HLX:` = mirror appointment; everything else = eCW-native (insurance visits: NP, IV, labs, front-desk bookings).
4. Reconcile against the app:
   - Mirror present in eCW and app → ok; copy status changes (checked in, cancelled, no-show) into the app.
   - Mirror missing in eCW but confirmed in the app → exception "Mirror missing" (someone deleted it); staff decide whether to re-queue J3.
   - Mirror present in eCW but cancelled in the app → J5 should have handled it; raise exception "Stale mirror".
   - eCW-native appointment overlapping an app-held resource → exception "Slot conflict" for the front desk.
5. Store eCW-native appointments for program patients so the patient home shows insurance visits read-only ("From the clinic calendar").
6. Write back a run summary: appointments read, mirrors matched, exceptions raised. No screenshots except on parse errors.

**Never.** J4 writes nothing. It is the safety net that catches whatever J2 / J3 / J5 and humans did differently.

## J5 — Appointment update or cancel mirror

**Trigger.** A confirmed app booking is rescheduled or cancelled (patient, staff, or payment-failure hold with staff confirmation).

**Steps.**
1. Log in. Find the appointment by marker `HLX:<appointment_id>` on the original date.
2. Not found → `needs_review` ("Mirror not found"); the app booking change still stands.
3. Reschedule: run the J3 slot check for the new window; conflict → `conflict`, nothing changed, staff resolve. Otherwise edit start / resource, append `:r<revision>` to the marker, save, read back.
4. Cancel: set status cancelled with reason "HLX cancelled by <patient | staff name>", save, read back.
5. Write back `verified`.

**Never.** J5 never edits an appointment whose notes do not start with `HLX:`.

## Mapping tables the app must hold (editable by the technical admin)

- App resource (room / device / IV chair) → eCW resource or provider column name.
- App service → eCW visit type.
- Note type and section for J2; document category for J2 (both to be confirmed with Charlene).
- Bot user name, working-hours window, retry limits, screenshot retention.

## What Kai needs from Helixona before building

1. eCW access for the bot user and a test patient chart ("Test, HLX").
2. Which eCW client: web or desktop (changes the automation tool, not the flows).
3. A 30-minute screen share with Charlene recording where she pastes the note and which document category she uses (J2 steps 3 and 5).
4. Whether rooms and devices exist today as eCW resources, or only providers (J3 step 1).
5. The visit type to use for program sessions and for treatment-only bookings.
6. Confirmation from the attorney that automated access is allowed under the eCW license.

## Test plan (acceptance per job)

| Job | Case | Expected |
|---|---|---|
| J1 | chart number exists, name matches | verified |
| J1 | DOB differs by one digit | mismatch, nothing written |
| J2 | first run | note and PDF present, read back ok, status Placed in eCW |
| J2 | run twice with the same key | second run ends "already present", no duplicate |
| J2 | eCW closes the upload dialog mid-way | needs_review with screenshot, no retry |
| J3 | free slot | mirror created, patient Confirmed |
| J3 | slot taken by a manual booking | conflict, app booking kept, exception for staff |
| J4 | staff deletes a mirror in eCW | "Mirror missing" exception next morning |
| J5 | patient reschedules | mirror moved, marker revision incremented |
