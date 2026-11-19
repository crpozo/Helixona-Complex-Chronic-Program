# HELIXONA | HCOS Medication & Supplement Module

**Conversation export / development archive**  
**Date:** November 17, 2026  
**Purpose:** Preserve the decisions, discussion, screen concepts, clinical workflows, integration requirements, and developer specifications shared in this conversation.

> **Scope note:** This is a faithful **reconstructed conversation archive**, not a byte-for-byte transcript of every assistant response. The user's requests and decisions are reproduced in sequence, with assistant contributions consolidated to preserve the specifications, examples, and recommendations. Interactive prototypes from the chat are represented in Markdown descriptions rather than executable controls. The ChatGPT conversation itself remains the source for exact original wording and interactive examples.

---

## Conversation 1 — Initial request: patient-reported medication changes

### User

> For the HLOS, I would like to have a section of the software on the patient's view where they document prescription changes. So we need to be able to have a section where it shows what the doctor has prescribed, either through medications or supplements, and what date the doctor prescribed them. And then there needs to be an area where the patient will put the date they started taking them, if they started taking them consistently or inconsistently, and if they have chosen not to take the medicine, like, I'm not taking this medicine. So it can be documented back in the system, and we can know. And as we're overlaying data on flares, on their daily activities, on prescriptions and the treatments, we can see where they start and stop, and we can know if they have consistently taken the medication or if they're kind of been a little willy-nilly with it. So can you help create a structure that I could share with Carlos to create this screen that will track this information in a very user-friendly form that patients with brain fog can still manage this without feeling overwhelmed. And please ask me any questions before you fully design it.

### Assistant — Discovery questions and guiding architecture

Nine initial design decisions were raised: (1) automatic versus manual order entry; (2) change reporting versus daily/weekly check-ins; (3) how to express inconsistent use; (4) reasons for stopping or declining; (5) outside medications and self-started supplements; (6) physician versus patient dose changes; (7) linking medication changes to flares/crashes; (8) event-specific care-team alerts; and (9) simple expandable cards versus dense tables.

The assistant proposed three distinct information layers:

1. **Prescribed:** Physician orders, dates, doses, and instructions.
2. **Reported by patient:** Actual start dates, frequency, pauses, stops, and declined recommendations.
3. **Health timeline:** Medication changes overlaid with symptoms, daily activities, flares, crashes, and completed treatments.

Core principle: patient reports never silently change an authorized physician order. Uncertain dates and "I'm not sure" should be supported.

---

## Conversation 2 — User decisions and physician summary requirements

### User

> Here are my decisions for the HCOS medication and supplement tracking screen:
> 1. Where prescriptions come from
> A combination of automatic and manual entry
>
> 2. How often patients report
> A combination of change reporting and check-ins
>
> 3. What does inconsistent use mean?
> Include a simple frequency (most days, sometimes, rarely)
>
> 4. When a patient stops or declines
> Yes, simple reasons to choose from
>
> 5. Patient-added medications and supplements
> Yes, both
>
> 6. Dose changes
> Yes, both physician and patient changes
>
> 7. Linking symptoms to prescriptions
> Yes, directly within flare/crash reporting
>
> 8. Care-team notifications
> Different rules based on the event
>
> 9. How much information is visible initially?
> Yes, simple cards that expand
>
> Additional notes: This information will be used for retrospective studies in aggregate and by individual patient. The changes in patients actual taking of the medication needs to go in the chart with a summary for the physician of changes since last visit, possibly and executive summary of changes with then data underneath it that the physician can review prior to the visit. The summary should include: Treatments done since last visit, flares/crashes, daily check in chart, medication overview (did they start what was ordered, were they consistent, did they stop or not even start the medication, etc.. this is for supplements and prescriptions). Patient should be able to add presriptions and supplements that they are taking from other docs or on there own.
>
> Please use these to design the patient-facing experience and the developer specification for Carlos, explaining any recommended defaults for unanswered items.

### Assistant — Proposed full module architecture

**Patient screen:** "My Medications & Supplements," with filters All / Medications / Supplements and one expandable card per item. Cards show name, dose, prescribed date/source, current status, date started if known, and a simple "Update what I'm taking" action. Patient-added outside medications and independently started supplements supported.

**Status choices:** Taking regularly, taking sometimes, not started, paused, stopped, chose not to take; select reasons such as possible reaction, forgot, cost, concerns, difficulty taking, doctor-directed change, or other. Use approximate dates and explicit unknown responses when necessary.

**Check-in design:** Distinguish change events from interval-based consistency reports; don't make a medically complex patient log every pill every day. A report of "most days" is not equivalent to an exact adherence percentage.

**Physician pre-visit briefing:** A short executive summary followed by expandable details, spanning recommendations started/not started, medication and supplement changes, treatments completed, flare/crash dates and severity, daily survey trends, unresolved issues, and clinical review. Reports should compare with the previous completed physician visit.

**Chart workflow:** Automated draft, then physician review/acceptance into the record. Preserve source records, links, and auditability.

**Research:** Preserve original and corrected events; effective vs recorded dates; source and reporter; incomplete reporting; recommended versus actual doses; ability to reconstruct longitudinal exposure periods without assuming that a prescription was taken.

**Initial entity proposal:** TherapyItem, PrescriptionOrder, PatientTherapy, TherapyEvent, AdherenceReport, ClinicalReview. These names were **subsequently corrected** by the user to consistently use "Medication" rather than "Therapy" for medications/supplements.

---

## Conversation 3 — Existing HCOS visualization

### User

> This is the current layout of the data. We will overlay the presription information here after the patient provides it.

*The original user-provided screenshot of the current HCOS graph was supplied in the conversation. It is not embedded in this Markdown export.*

### Assistant — Visualization requirements

Preserve the existing survey and health-graph layout. Add medication/supplement information as a **selectable layer**, not a separate competing graph. Distinguish recommended/order dates from actual patient-reported start dates. Show meaningful time spans for regular and intermittent use, not just isolated markers. Flares, crashes, treatment visits, and daily health surveys should remain separately toggleable. Selecting a marker opens source detail. Timeline relationships represent timing, **not proven causality**.

Assistant also outlined an interactive example using fictional data and suggested modular patient-card and physician-summary interfaces.

---

## Conversation 4 — Names, terminology, and confirmation cadence

### User

> should we have the data pull from a supplement and prescirption data base? or will that confuse patients? i agree with allowing a caregiver to access this information. I also agree with "Not recently confirmed" and allow the physician or MA to update on their end when they have the next office visit so it is always current as of the last office visit. I agree with the language "taking sometimes". I agree with change reporting with monthly checkin. For the executive summary I would say if the patient started the recommended meds/supplements from the last visit and then list details below. That will inform the office visit and when the patient has not improved then may inform that as well. In your layout, your developer specification underlying data structure, you say patient therapy. That's confusing because I think what it needs to be is patient medication. Therapy is a different thing. It needs to be patient medication, and it's the medication history. And then therapy event should be medication event. Because, you know, therapy, it's different. That's more of an action taken with a provider or a device. It's not medication. So that needs to change. You know, instead of therapy, it's medication. And then...

### Assistant — Agreed refinements

- **Catalog search:** Yes; type-ahead suggestions from medication and supplement catalogs, with a visible "I don't see mine — enter it myself" path. Search should reduce typing, not increase cognitive burden.
- **Medication identifiers:** RxNorm/RxNav for standardized medications; DailyMed for labeling; NIH Dietary Supplement Label Database for supplement products; Helixona catalog for commonly recommended products. Product identity is not the same as prescribed/patient dose.
- **Caregiver access:** Permissioned, auditable, role-based proxy updates.
- **Confirmation cadence:** Monthly, plus change events any time.
- **Not recently confirmed:** Keep last-known status, separately indicate its confirmation is overdue. Do not automatically treat silence as stopped.
- **Office reconciliation:** MA or physician updates actual-use statements, with review date and reporter; physician retains authority for prescribing.
- **Executive summary:** Lead with follow-through on the previous visit's recommendations, then detail supporting facts. If recommended treatments weren't started, this is clinically important context when progress is limited; it is not a definitive explanation for poor progress.
- **Naming:** `MedicationCatalogItem`, `MedicationOrder`, `PatientMedication`, `MedicationEvent`, `MedicationUseReport`, `MedicationReview`. Prescription, OTC, and supplement types remain distinguishable. Treatments/Therapies are separate.

---

## Conversation 5 — Fullscript, compounding pharmacies, and bottle scanning

### User

> The doctor currently orders supplements through Fullscript, and we highly recommend that patients use Fullscript to be able to get, you know, ensure the safety of the product, as many times Amazon you can't properly source where the product came from, so you don't know how safe it is and if it's a knockoff or if it's the original brand name. So we do recommend that they go through Fullscript, and I would like to have whatever was ordered in Fullscript show up in there as ordered so that we can see if they fulfilled it through Fullscript. We should be able to have that integration, so then we can at least say fulfilled on this date, and then when they started taking it. So there should be able to do that. Also, you know, we do a lot of compounding medications through King's Pharmacy or other compounders, and those are ordered through the system. So we need to somehow, you know, we can have that document in there what was ordered, but then we don't know when it was filled. So I don't know if there's a data point that comes back to us when a prescription is actually filled. If they ordered it and didn't fill it, do we get any notification? Is that something that's available, or do we have to just count on the patient's input for that? And then, yeah. Yeah, and then there's the manual entry. So okay, I think that's it for now. In your executive summary, I would think that under the dashboard of five recommended, they list it three started. List the three that were started and list the two that were not started. I think just he'd want to glance and see that. He doesn't want to have to dig for that information. I guess it's just below supporting details, but it just feels like visually he'd want to just know what that is instantly. He'd see the two not started. Okay, what is it? And he'd want to see that instantly. I love the scan bottle feature. That could be so helpful for our patients. Just really, really helpful.

### Assistant — Integration and physician design

**Fullscript:** Long-term API integration should connect physician recommendations to Fullscript purchase/order events and, where available, shipment/delivery and refill details. Verify capabilities and permissions with Fullscript; distinguish recommendation, purchase, fulfilled/delivered, and **patient-reported actual start**. Product purchased is not proof of ingestion.

**Compounding pharmacies:** E-prescribing through eClinicalWorks is already in place, but transmitting an Rx does not prove a fill-status response is available. Investigate Surescripts **RxFill** messaging and actual eClinicalWorks access, plus each pharmacy's participation. Some compounders may not provide a usable dispensing message. A missing fill notification means "fill status unknown," not "unfilled." Patient confirmation is the fallback. Retain exact compound formulation and concentration when known.

**Executive summary:** Show actual names instantly beneath counters. Example:

- **5 recommended / 3 started / 2 not started**
- **Started:** Cetirizine — taking regularly; Magnesium glycinate — taking regularly; Vitamin D3 — taking sometimes.
- **Not started:** Compounded medication A — unable to obtain; Supplement B — patient declined.
- Display separate unknown/unconfirmed group if present.

**Scan bottle:** Patient can photograph a label, receive suggested product/strength/instructions, and confirm or correct the extracted data. Images and uncertain matches must be handled securely and clearly. Useful for outside medicines, supplements, and compound preparations.

---

## Conversation 6 — Full pre-visit medication reconciliation

### User

> Expand the HCOS physician summary to show a full pre-visit medication reconciliation and dated changes, with treatment and flare information.

### Assistant — Physician briefing design

**First screen:** "Pre-Visit Clinical Briefing" scoped from the last completed visit to the upcoming visit. Show short counts (recommendations started, not started/declined, completed treatments, flares/crashes), a brief narrative, and immediately visible item names and reasons.

**Proposed sections:**

1. **Plan vs. Actual / Medication Follow-Through** — each prior recommendation and what actually happened, with start/stop dates, consistency, reason and unresolved status.
2. **Other Medication Changes** — self-directed dose changes, new outside items, pauses/stops, possible reactions.
3. **Treatments Completed** — dates, modality, deviations from plan, responses.
4. **Flares & Crashes** — dates, severity, function impact, recovery, possible triggers.
5. **Daily Check-In Trends** — overall health, energy/function, symptoms, completeness.
6. **Items for Today's Visit** — concise actionable questions, not an exhaustive data dump.

**Example of chronological event history** (fictional): Oct 20 physician recommended five items; Oct 23 started cetirizine; Oct 28 started magnesium; Oct 29 started vitamin D3; Nov 3 IV completed; Nov 5 flare; Nov 6 outside medication started; Nov 8 outside medication reported; Nov 10 red light completed; Nov 12 crash; Nov 14 IV completed; Nov 16 monthly confirmation.

**MA/physician workflow:** Before visit HCOS prepares the summary; during rooming MA verifies use and marks unresolved discrepancies; physician assesses the clinical issues and changes orders when indicated; reviewed summary can enter the chart. Record both list-level review date and individual item confirmation dates. Unverified items are never automatically marked verified.

**Guiding goal:** Doctor identifies what was recommended, what patient actually did, what happened to health, and what needs attention today without reconstructing disconnected records.

---

## Conversation 7 — Faster confirmations and physician-first design

### User

> I know we're currently sending e-prescriptions through eClinicalWorks to our compounding pharmacy. So I think the connection exists. Once a patient is consistently on a medication, the check-in should be easier. You know, when you're beginning or ending, it's, you know, simple, but, like, just where they could almost, like, select all that you are still taking, or something like that. That makes the check-in just really easy. Some method like that. So once you, you know, it's, you know, it's just acknowledging, yes, I'm still taking these, and then have a place to add in anything new or remove. I really like the changes after last visit thing. I mean, really what we're trying to do is make the doctor's job easier of finding the information that is important for him to be able to help the patient.

### Assistant — Minimal monthly check-in

**Recommended entry choices:**

1. **No changes:** "I'm still taking everything as listed."
2. **Something changed:** "I started, stopped, or changed something."
3. **Review my full list:** "I'd like to check each item."

When choosing no changes, show a concise confirmation of the current list; the patient confirms once, preserving previously reported "taking sometimes" statuses. The full list option provides large checkboxes, select all, and a way to report changes. **Unchecked does not mean stopped**. No default preselection should silently count as confirmation. Allow add/new item at any time.

A patient who is taking many stable items should not have to answer individual questions about every one of them. A monthly affirmation is patient-report confirmation of the list, not proof that every prescribed dose was taken.

**Physician-first rule:** "Changes Since Last Visit" should be near the top of the existing physician dashboard, prioritizing names and reasons for exceptions before the full medication history. The physician sees deviations from the previous plan, new outside products, completed treatments, flare/crash patterns, and questions to resolve.

**eClinicalWorks note:** Existing e-prescribing means outbound prescriptions are supported; confirm separately whether inbound fill-status information can be accessed through the actual system configuration.

---

## Conversation 8 — Comprehensive Carlos development brief

### User

> That's great. Now can you, with all these new updated decisions, put together what I should send to Carlos for him to design this section for patients, with all, you know, everything clearly outlined?

### Assistant — Consolidated implementation specification

The assistant prepared a long development brief titled **"HELIXONA | HCOS — Medication & Supplement Management Module: Patient Experience & Development Requirements"** and covered these sections:

1. **Purpose and vision:** Brain-fog-friendly reporting, prescribed/obtained/actually taken distinctions, physician briefing, chart reconciliation, longitudinal research.
2. **Terminology:** Medications and supplements separate from device/provider-delivered treatment modalities. Use `Medication` entity names rather than `Therapy` for drug/supplement histories.
3. **Patient navigation:** "My Medications & Supplements," expandable cards and filter, current status and last confirmation.
4. **Sources:** eClinicalWorks orders, Fullscript recommendations/order data, outside prescriptions, self-started supplements, and manual entries.
5. **Catalog:** Assisted medication/supplement search and always-available manual entry.
6. **Bottle scan:** Photograph/barcode, extract candidates, patient verification, secure handling.
7. **Lifecycle:** Recommended/prescribed -> obtained -> actually taken, with independent statuses and dates.
8. **Fill integration:** Investigate RxFill, eClinicalWorks configuration, pharmacy participation, and patient fallback.
9. **Medication statuses:** Not started, regularly, sometimes, paused, stopped, declined, stale/unconfirmed, unknown; reasons captured through short choices.
10. **New-start workflow:** "Have you started?" -> start date -> regularly/sometimes/different dose; defer when not yet/unknown.
11. **Monthly confirmation:** No changes / something changed / review list; select-all path; don't equate unchecked with stopped.
12. **Not recently confirmed:** Preserve last known statement and separately flag overdue verification.
13. **Caregiver:** Permissioned, role-attributed, audited proxies.
14. **Ad hoc changes:** Starts, dose changes, partial adherence, pauses, stops, restarts with effective and entered dates.
15. **Clinical safety routing:** Risk-stratified queues, prompt clinical review for significant changes, no automatic order modifications.
16. **Flare/crash linkage:** Offer recent medication changes as possible self-reported factors; patient may select yes/maybe/no/unknown and relevant products.
17. **Existing timeline:** Independent overlays and clickable events, regular/intermittent-use spans, uncertainty shown.
18. **Pre-visit briefing:** List specific recommended/started/not-started/declined/unknown names immediately; treatments, health outcomes, problems requiring attention; editable, source-linked clinical summary.
19. **MA/physician review:** Reconcile and record discrepancies, maintain clinical authority and verified status dates.
20. **Data architecture:** `MedicationCatalogItem`, `MedicationOrder`, `PatientMedication`, `MedicationFulfillment`, `MedicationEvent`, `MedicationUseReport`, `MedicationReview`. Immutable or fully auditable historical changes and source attribution.
21. **Research:** Timelines, status and dose intervals, overlap with outcomes, missing data, approximate dates, product formulation, de-identification and research permissions.
22. **Delivery phases:** Core patient workflow and history first; advanced integrations, scanning, dashboard, visualization next; longitudinal research/analytics thereafter, while designing research-ready events from day one.
23. **Acceptance tests:** New orders, Fullscript products, compounds, 15-item monthly check-in, dose changes, outside bottle, flare link, physician briefing, office reconciliation, historical event reconstruction.
24. **Design standard:** Less patient effort, greater physician clarity, clinically meaningful and research-ready data.

This section is consolidated to avoid duplicating the full technical specification later in the archive.

---

## Conversation 9 — Permanent integrations, reminders, overlays, interaction screening

### User

> I would like to build an integration with Fullscripts and HCOS for long-term. For the monthly review, it should be a push notification or a text to remind them to update their medication list or confirm what they're taking. Yes, the flare reporting is an overlay to the patient view. So we have the patient survey results, the crash reports, the medication change notifications of what they're, you know, if they change their medication, an little note on there, and then also any treatments that they've done. All of these layered over time with the ability to remove one of the layers or, you know, or just isolate a layer, I think would be helpful as the doctor is trying to find patterns. Within the logic of the medication thing, the databases should have a way to be able to highlight if something isn't recommended. So say the doctor's ordered, you know, different supplements and medications, and then the patient adds in a supplement and there's contraindications. They need to be able to put an alert saying, Hey, there's a contraindication with taking this with one of your other drugs, or something like that where it can do a scan and give a warning.

### Assistant — Development addendum

#### A. Permanent Fullscript synchronization

Build long-term sync, not a one-off import. Reconcile patient identities, order IDs, recommendation IDs, catalog/product IDs, purchase and fulfillment events, and refills where available. Implement retry handling, webhook/polling reconciliation and an audit trail. Clarify actual Fullscript API permissions with the vendor.

#### B. Monthly reminders

Patient-selectable push or SMS, default reminder around 30 days after last completed reconciliation. Suggested one gentle follow-up reminder after seven days. Secure link to authenticated medication check-in; keep protected health details out of SMS and lock-screen notifications; manage patient consent and preferences, delivery status, opt-out, caregiver permissions. Completed office reconciliation can reset routine cadence. Silence remains "not recently confirmed," not presumed stopped.

#### C. Four timeline layers

1. Daily patient health surveys
2. Flares and crashes
3. Medication and supplement changes
4. Completed treatments

Each layer supports show/hide, isolate, show all, and date-range filtering (e.g. 7, 30, 90 days, since last visit, custom). Markers connect to detail records. Current reported-use intervals may appear as solid/patterned timeline bands; unknown periods should remain uncertain.

#### D. Clinical interaction screening

Separately license or integrate an appropriate **clinical interaction decision-support knowledge source**. A product-identification catalog such as RxNorm or a supplement label database is not by itself a comprehensive clinical interaction engine. Evaluate drug–drug, drug–supplement, supplement–supplement where supported, duplicate ingredients, allergies/sensitivities, contraindications and dose-related cautions. The assistant suggested assessing a source such as First Databank, while also evaluating existing eClinicalWorks capabilities before duplicating licenses.

Screen when a new order is imported, a Fullscript recommendation is added, an outside item is entered or scanned, actual doses change, missing formulation details become available, the list is reconciled, or meaningful knowledge-base changes warrant re-review.

**Alerts:** Distinguish high-priority, moderate, informational, and **screening incomplete**. A compounded or multi-ingredient product that cannot be reliably matched should not falsely display "no interactions." Avoid disruptive or repetitive warnings. Show the interaction pair, severity, referenced knowledge source, review state and appropriate next step. Route significant findings to clinicians according to medical leadership-approved rules; no automatic patient instruction to discontinue an existing prescription. Emergency symptoms need immediate appropriate guidance.

**New entities:** `MedicationInteractionResult`, `MedicationInteractionReview`, `MedicationNotification`, `ExternalIntegrationEvent`, `MedicationIngredient`.

#### E. Prioritization

The assistant recommended building catalog/product mapping and historical data before activating interaction warnings. Patient-facing safety messaging should only launch with a validated knowledge base and approved clinical triage rules. Fullscript integration, reminders, and timeline overlays can proceed as parallel tracks where feasible.

---

## Conversation 10 — Request for this export

### User

> can you please provide an export in .md of this full conversation? Thank you! This will be so helpful to patients and the doctor!

---

# Current Consolidated Decision Register

The following decisions represent the latest direction across the conversation. They supersede early alternative suggestions where the direction changed.

| Area | Final direction |
|---|---|
| Module name | My Medications & Supplements |
| Terminology | Medication entities for drugs/supplements; separate Treatments/Therapies module |
| Order sources | Combined automated imports and manual entry |
| eClinicalWorks | Receive prescription orders; verify fill-status/RxFill capability separately |
| Fullscript | Long-term integration for recommendations, orders, and available purchase/fulfillment history |
| Outside products | Patient and authorized caregiver may add outside prescriptions and self-selected supplements |
| Product discovery | Assisted catalog search plus manual entry and future bottle scanning |
| Patient cards | Simple collapsed cards expandable for edits |
| New-start reporting | Date started, use frequency, different dose if applicable, declined/not started and reasons |
| Regular-use language | Taking regularly / Taking sometimes; most days, some days, rarely if inconsistent |
| Routine confirmation | Monthly, plus immediate change reporting |
| Easy check-in | No changes / Something changed / Review full list; select-all with explicit confirmation |
| Reminder | Patient-choice push notification or SMS with secure HCOS link |
| Missing check-in | Not recently confirmed; do not infer stopped |
| Caregiver | Permissioned access, distinct reporter attribution |
| Office verification | MA or physician confirms actual use and unresolved issues; authorized physician handles order changes |
| Physician briefing | Changes Since Last Visit and Plan vs. Actual prominent; actual started and not-started names shown instantly |
| Treatment & symptoms | Completed treatments, flares, crashes and daily surveys summarized with dates and trends |
| Timeline | Four independently toggleable/isolateable layers over time |
| Interactions | Clinical drug/supplement decision-support screening and risk-based alerts, with incomplete screening explicitly shown |
| Historical data | Event-based, source-attributed, date-precise, auditable, research-ready |
| Clinical safety | Patient report never silently alters a physician order; clinical judgment remains with licensed staff |

---

# Developer Handoff — Minimum Core Data Model

| Entity | Why it exists |
|---|---|
| `MedicationCatalogItem` | Standardized product identity and type |
| `MedicationIngredient` | Ingredient identity, amounts and formulation-source mapping |
| `MedicationOrder` | Clinician's original recommendation/prescription and revisions |
| `PatientMedication` | Patient-specific list and history |
| `MedicationFulfillment` | Purchased, filled, dispensed, shipped, delivered, obtained, unknown |
| `MedicationEvent` | Started, paused, dose changed, stopped, restarted, declined, etc. |
| `MedicationUseReport` | Patient/caregiver interval confirmations and frequency |
| `MedicationReview` | MA/physician reconciliation, open questions, verification |
| `MedicationInteractionResult` | Interaction finding, pair, severity, source, database/version |
| `MedicationInteractionReview` | Clinician disposition and follow-up |
| `MedicationNotification` | Channel, consent linkage, delivery, completion |
| `ExternalIntegrationEvent` | Source system event IDs, sync status and audit trail |

**Essential timeline fields:** stable patient/medication/order IDs; event type; clinically effective time and time entered; exact/approximate confidence; before/after values; reporter and authority; import/source system; clinical confirmation; corrections and provenance. Prefer explicit unknowns and audit history over destructive status overwrite.

---

# Example Physician View — Plan vs. Actual

*Illustrative, fictional data only.*

**Since previous visit: 5 recommended; 3 started; 2 not started.**

**Started**

- Cetirizine — taking regularly.
- Magnesium glycinate — taking regularly.
- Vitamin D3 — taking sometimes.

**Not started**

- Compounded medication A — patient reported unable to obtain; pharmacy fill status not independently confirmed.
- Supplement B — patient declined because of tolerance concerns.

**Other change**

- Outside medication C — patient reports a start on November 6; formulation/dose still require reconciliation.

**Treatments**

- IV treatments: November 3 and November 14.
- Red light treatment: November 10.

**Symptom events**

- Flare: November 5.
- Crash: November 12.

**For clinician attention**

- Clarify the compounded prescription access problem.
- Discuss the declined supplement.
- Confirm frequency of vitamin D3.
- Verify the outside medication and screen for interactions.
- Review treatment and medication timelines against the flare and crash, without treating temporal association as confirmed causality.

---

# Practical UI Acceptance Criteria

1. A patient with 15–25 stable items can complete a monthly no-change confirmation in a few taps.
2. A missed monthly check-in preserves last-known statuses and flags lack of recent confirmation.
3. A patient can add a drug/supplement from an outside source, via assisted search, manual entry, or planned bottle scan.
4. A Fullscript-recommended item can independently record recommendation, purchase/fulfillment, and actual patient-reported start.
5. A compounded e-prescription can show ordered even when dispensing is unknown; fill updates only when actually supported.
6. A patient can report taking a different dose without changing the authorized medication order.
7. Clinicians can review a current list, reconcile items, and preserve differences between patient statements and verified records.
8. A physician's summary visibly lists specific started and not-started recommendations and reasons, plus important new drugs and symptom/treatment changes.
9. The existing HCOS timeline supports show/hide and isolate for daily surveys, flares/crashes, medication changes, and treatments.
10. A new supplement triggers an appropriate ingredient-aware interaction check, with defensible severity, provenance, handling of uncertain matches, and clinician escalation.
11. Historic exports reproduce dated exposure/event intervals without treating unreported days as proof of use or nonuse.
12. Notifications use patient-selected SMS or push, consent and permission checks, and links to authenticated workflows.

---

**HELIXONA**  
*Advanced Medical Treatment Facility*  
**ELIMINATE. NOURISH. REPAIR.™**
