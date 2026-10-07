| **Document**          | **Details**                                                                                                            |
|-----------------------|------------------------------------------------------------------------------------------------------------------------|
| **Purpose**           | Authorize and guide the first build of the software needed to enroll and support the Complex Chronic nine-month pilot. |
| **Pilot target**      | Three to five patients in the first pilot cohort.                                                                      |
| **Delivery approach** | Phased MVP with configurable engines rather than hard-coded clinical rules.                                            |
| **Prepared for**      | Carlos and the Helixona launch team.                                                                                   |
| **Version**           | 1.0 September 30 2026.                                                                                                 |

# Build directive

Carlos should begin with the platform structure described in this brief. Clinical questionnaires, survey questions, modality-specific follow-up rules, alert thresholds, forms, and communications will continue to be supplied and refined by the authorized Helixona team. The software must make those items configurable without requiring a developer to rewrite the application each time the program changes.

The Medical Director owns the clinical questionnaire and clinical decision content. The initial questionnaire must be implemented exactly as provided. Carlos and the software team are not being asked to assess, rewrite, remove, or reinterpret clinical questions.

This document defines the MVP product vision, required modules, configuration model, workflows, guardrails, acceptance criteria, technical decisions for Carlos, and the source material his team must collect. It is intended to get architecture and development underway while operational and clinical content is still being completed.

# Contents

1.  Product goal and operating model

2.  MVP scope and boundaries

3.  End to end patient journey

4.  Users roles and permissions

5.  Core platform principles

6.  Website inquiry and advisor initiated intake

7.  Clinical intake forms consents and eCW output

8.  Configurable survey monitoring and alert engine

9.  Modality and care rule configuration

10. Member scheduling and eCW integration

11. Contract recurring payment and financial controls

12. Membership registry and lifecycle automation

13. Notification and communication engine

14. Administration reporting audit and security

15. Integrations and source of truth

16. Pilot acceptance criteria

17. Technical decisions for Carlos

18. Assigned follow up and source collection

19. Recommended build sequence

20. Standards and implementation references

# 1 Product goal and operating model

The MVP will support the Complex Chronic nine-month program from qualified inquiry through active membership. It should reduce manual handoffs, give patients a far easier experience than the current eClinicalWorks interfaces, and begin accumulating structured data for HCOS without attempting to replace eCW during the pilot.

The operating model is integration first. eCW remains the medical record and Helo remains the patient portal for ongoing medical-record functions. The AWS application becomes the operational layer for intake, signed documents, survey monitoring, member scheduling, payments, and lifecycle management. The structure should support future HCOS modules and future multi-tenant use, but the pilot must remain focused on Helixona.

## Program rules that shape the build

- The patient does not self-enroll in the Complex Chronic pathway. A patient advisor initiates the intake after the website inquiry and qualification interview.

- Month 0 is the separate Assessment and Plan period. It is not included in the \$18,000 membership.

- The nine-month program is \$2,000 per month for nine months and may continue at \$2,000 per month when the physician and patient agree that active care should continue after Month 9.

- Cash modalities ordered in the Plan of Care are included in the membership. Insurance-covered office visits, diagnostics, and IV services remain subject to the patient responsibility determined by the insurance plan.

- The patient signs the membership agreement only after the Month 0 diagnosis and Plan of Care are reviewed and the program is formally offered.

- The system supports clinical monitoring and staff follow-up. It must never present itself as continuous, after-hours, or emergency monitoring.

# 2 MVP scope and boundaries

| **Included in the pilot MVP**                                      | **Not required for the first pilot**                                 |
|--------------------------------------------------------------------|----------------------------------------------------------------------|
| **Website pathway updates and Typeform handoff**                   | Replacement of the entire Helixona website                           |
| **Advisor-created patient record and secure invitation**           | Open public self-enrollment into Complex Chronic care                |
| **Medical Director questionnaire exactly as supplied**             | Clinical rewriting or optimization by the software team              |
| **Digital intake forms uploads signatures and staff review**       | A replacement for the full Helo patient portal                       |
| **Copyable eCW note output and a readable PDF**                    | Automated population of every structured eCW field                   |
| **Configurable surveys modality rules alerts and queues**          | Final clinical content for every future condition and treatment      |
| **Member scheduling for authorized services with eCW integration** | A full independent scheduling platform that ignores eCW              |
| **Membership contract card and ACH recurring payment**             | In-house storage or processing of raw card or bank data              |
| **Lightweight lifecycle registry notes and audit history**         | The full future HCOS CRM                                             |
| **Current required forms consents and document signatures**        | The mature Phase Two consent library and advanced consent automation |
| **Email and SMS notifications with configurable timing**           | Marketing automation unrelated to the patient journey                |
| **HIPAA-aligned AWS deployment roles logs and backups**            | Full commercial multi-clinic administration for launch               |
| **Three to five patient pilot support and defect tracking**        | Broad public launch before the pilot is reviewed                     |

# 3 End to end patient journey

| **Step** | **Stage**                       | **System outcome**                                                                                                             |
|----------|---------------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| **1**    | Website inquiry                 | Patient completes the existing Typeform for the appropriate care pathway.                                                      |
| **2**    | Advisor qualification           | Patient advisor conducts the internal interview and gathers insurance information.                                             |
| **3**    | Insurance and admissions review | Karina reviews benefits and financial exposure. The admissions decision is recorded.                                           |
| **4**    | Month 0 enrollment              | Accepted patient pays the separate Month 0 amount and receives the full clinical intake and current required paperwork.        |
| **5**    | Assessment and Plan             | The Medical Director evaluates the patient, orders testing, reviews findings, and prepares the Plan of Care.                   |
| **6**    | Program decision                | The nine-month program is offered only when Helixona determines it is appropriate. The patient may accept or decline.          |
| **7**    | Contract and recurring payment  | The patient signs the membership package and authorizes card or ACH recurring payments.                                        |
| **8**    | Active care                     | The patient books authorized services, receives surveys, reports reactions or crashes, and receives care-team follow-up.       |
| **9**    | Month 9 review                  | The physician and patient decide whether to continue active care, transition to maintenance, graduate, withdraw, or discharge. |

## Three website pathways

- Complex Chronic nine-month program with advisor-led qualification and Month 0.

- Insurance-covered care with the nurse practitioner.

- Self-directed care for patients using individual services outside the comprehensive program.

Carlos should preserve the inquiry source and pathway selection on the patient record. Only the Complex Chronic pathway enters the workflow defined in this brief.

# 4 Users roles and permissions

| **Role**                                | **MVP responsibilities**                                                                                                                                                    | **Access expectation**                                                                                |
|-----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|
| **Patient**                             | Complete assigned intake and forms, upload records, sign documents, complete surveys, report a crash or flare, schedule permitted services, and view payment confirmations. | Access only the patient’s own assigned items and authorized scheduling options.                       |
| **Patient advisor and Shibani**         | Create or initiate records, conduct follow-up, monitor intake completion, record admissions outcomes, document nonclinical notes, and send assigned communications.         | Operational access without authority to alter clinical questionnaire content or clinical alert logic. |
| **Karina**                              | Insurance, billing, deposits, payment failures, reconciliation, lifecycle oversight, configuration review, and operational reporting.                                       | Operational and financial administrator access; payment tokens only, never raw account data.          |
| **Charlene**                            | Review intake output and complete chart preparation in eCW.                                                                                                                 | Read completed intake, copy formatted note text, download PDF, and mark chart-prep status.            |
| **Nursing and care team**               | Review assigned survey alerts, contact patients, document follow-up, and escalate according to approved rules.                                                              | Clinical queue access limited by role and assignment.                                                 |
| **Physician**                           | Own questionnaire and clinical rules, review escalations, update Plan of Care authorization, and complete Month 9 decisions.                                                | Clinical configuration approval and patient clinical oversight.                                       |
| **Cassandra**                           | Program oversight, content approval, lifecycle and policy decisions, and launch authorization.                                                                              | Program administrator and reporting access.                                                           |
| **Carlos and technical administrators** | Architecture, configuration tools, integrations, deployment, monitoring, support, and audited administrative maintenance.                                                   | No routine clinical content authority; privileged actions logged and minimized.                       |

# 5 Core platform principles

| **ID**      | **Requirement**                                                                                                                                                                                                             |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **PLAT-01** | Configuration over hard coding. Survey schedules, modality rules, alerts, recipients, reminders, lifecycle actions, forms, and permissions must be editable through authorized administration screens.                      |
| **PLAT-02** | Clinical ownership. The Medical Director’s questionnaire and approved clinical logic must be implemented exactly as supplied and versioned. Only an authorized clinical administrator may publish revised clinical content. |
| **PLAT-03** | Single patient identity. Use one Helixona program record linked to the corresponding eCW patient and future HCOS identity.                                                                                                  |
| **PLAT-04** | Role-based minimum necessary access. Permissions must control view, create, edit, approve, assign, export, and administrative actions.                                                                                      |
| **PLAT-05** | Full auditability. Retain who changed a record or configuration, the previous and new values, timestamp, patient when applicable, and reason when required.                                                                 |
| **PLAT-06** | Versioning and effective dates. Forms, questionnaires, survey templates, modality rules, contracts, disclosures, and communication templates must retain historical versions.                                               |
| **PLAT-07** | API-first modular design. Isolate eCW, Typeform, payment, email, and SMS integrations behind services that can be replaced without rebuilding the core workflow.                                                            |
| **PLAT-08** | Future HCOS readiness. Use structured data and stable identifiers. Avoid storing important program decisions only in generated PDFs or free-text notes.                                                                     |
| **PLAT-09** | Future multi-tenant readiness. Include an organization or tenant boundary in the data model without building the full commercial administration layer for the pilot.                                                        |
| **PLAT-10** | Safe failure. Failed integrations, alerts, payments, messages, or scheduling writes must create a visible exception instead of silently disappearing.                                                                       |

# 6 Website inquiry and advisor initiated intake

| **ID**     | **Requirement**                                                                                                                                                                              |
|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **WEB-01** | Continue using the current Typeform as the short public inquiry for the MVP, with approved field adjustments and the three pathway choices.                                                  |
| **WEB-02** | Capture contact information, reason for seeking care, major diagnoses, insurance carrier, referral source, state, availability, readiness, contact permission, and preferred contact method. |
| **WEB-03** | Receive Typeform submissions through a secure webhook or supported integration and preserve source, campaign data when available, pathway, submission ID, and submission timestamp.          |
| **WEB-04** | Create an inquiry record and prevent obvious duplicates using defined identity matching rules.                                                                                               |
| **WEB-05** | Do not create an active Complex Chronic patient account directly from a public form.                                                                                                         |
| **WEB-06** | Allow the patient advisor to create the patient’s secure intake assignment after interview and admissions steps reach the appropriate point.                                                 |
| **WEB-07** | Support an invitation workflow using the authentication approach Carlos recommends. Track sent, delivered, opened, started, submitted, expired, and reissued states.                         |
| **WEB-08** | Store the internal advisor interview separately from the medical-record output. The patient must not see this interview record.                                                              |
| **WEB-09** | Record admissions outcomes including accepted for Month 0, denied, and patient fell off or stopped responding, with notes, reason codes, date, and staff member.                             |

# 7 Clinical intake forms consents and eCW output

## Clinical content directive

The initial clinical questionnaire will be supplied by the Medical Director and must be implemented as provided. The build team should preserve question wording, sequence, choices, required status, and branching instructions. If the software cannot represent an item exactly, Carlos should document the technical limitation and request a clinical decision rather than changing the content.

| **ID**     | **Requirement**                                                                                                                                                                                                                                        |
|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **INT-01** | Provide a responsive mobile and desktop intake experience with save and return, progress indication, clear validation, and accessible controls.                                                                                                        |
| **INT-02** | Support common question types including short text, long text, single choice, multiple choice, yes or no, date, number, scale, medication list, repeating groups, and conditional sections.                                                            |
| **INT-03** | Support uploads for insurance cards, photo identification, medication and supplement lists, laboratory reports, imaging, medical records, prior diagnoses and plans, referral documents, and optional advance-directive or representative information. |
| **INT-04** | Scan or validate uploaded file types and sizes, retain upload metadata, and display a clear inventory to staff.                                                                                                                                        |
| **INT-05** | Allow the patient advisor or coordinator to review completeness, return an item for completion, add a nonclinical follow-up note, and mark the package ready for chart preparation.                                                                    |
| **INT-06** | Support all current required intake, HIPAA, privacy, communication, financial, and other patient paperwork supplied by Shibani and the team.                                                                                                           |
| **INT-07** | Capture an electronic signature with signer identity, document version, consent language version, timestamp, and audit evidence. Provide the patient a copy of signed documents.                                                                       |
| **INT-08** | Store signed PDFs in the compliant AWS environment and support placement of a copy in eCW.                                                                                                                                                             |
| **INT-09** | Generate one readable copy-and-paste output for the eCW clinical-note location and one well-formatted PDF containing the complete patient-facing intake responses.                                                                                     |
| **INT-10** | The note output should use a clear title, numbered questions and answers, readable lists for medications, allergies, diagnoses, symptoms, and history when the source structure supports them, plus an uploaded-document inventory.                    |
| **INT-11** | Track chart-prep states including awaiting intake, submitted, reviewed for completeness, ready for chart prep, placed in eCW, and exception.                                                                                                           |
| **INT-12** | Carlos must review Charlene’s exact current copy-and-paste process before finalizing the output and acceptance test.                                                                                                                                   |

## Source collection tasks for this module

- Obtain the Medical Director’s questionnaire and implement it as provided.

- Meet with Charlene to observe the current eCW note location, copy-and-paste steps, PDF upload, and chart-prep completion process.

- Obtain every current intake form, HIPAA form, financial form, consent, disclosure, and signature document from Shibani and the team.

- Create an inventory showing document owner, version, when it is assigned, who signs, whether a witness or staff countersignature is required, and where the completed document is stored.

# 8 Configurable survey monitoring and alert engine

Carlos should build the survey and monitoring infrastructure before every survey is fully written. Authorized clinical users must be able to add and revise content, publish versions, and assign rules without a code deployment.

## Survey template configuration

| **ID**     | **Requirement**                                                                                                                                                                                        |
|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **SUR-01** | Support baseline, optional daily pulse, weekly core, stage-specific, Lead Actor-specific, post-treatment, progress-review, and patient-initiated crash or flare survey types.                          |
| **SUR-02** | Provide a reusable question bank and versioned survey templates with sections, question order, required status, question type, answer choices, scoring, branching, and calculated fields.              |
| **SUR-03** | Allow a survey template to be assigned by program, care stage, Lead Actor, modality, physician, patient cohort, or individual patient override.                                                        |
| **SUR-04** | Allow schedules to use one-time dates, recurring cadence, treatment-relative offsets, multiple follow-up offsets, end dates, and stop conditions.                                                      |
| **SUR-05** | For each modality, allow authorized staff to set whether a follow-up survey is required, which survey version applies, when it is sent, how many follow-up days are used, and when the sequence stops. |
| **SUR-06** | Support configurable reminder timing and maximum reminder count for incomplete surveys.                                                                                                                |
| **SUR-07** | Allow patients to submit a crash or flare report at any time, including severity, symptom selections, free text, treatment context, onset, and request for contact.                                    |
| **SUR-08** | Display longitudinal answers and scores so authorized staff can recognize changes and patterns over time.                                                                                              |
| **SUR-09** | Track assignment, delivery, opening, submission, review, alert creation, follow-up, and closure.                                                                                                       |

## Alert rule configuration

| **ID**     | **Requirement**                                                                                                                                                                              |
|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **ALT-01** | Allow alerts to be triggered by a specific answer, severity level, calculated score, score change, red-flag combination, repeated pattern, treatment context, or missed-review condition.    |
| **ALT-02** | Support alert levels such as informational, routine review, nurse follow-up, urgent clinical review, and emergency instruction. Labels and thresholds must be configurable.                  |
| **ALT-03** | Allow recipients to be configured by role, named user, assigned care team, ordering physician, treating physician, program, location, day or time, and backup recipient.                     |
| **ALT-04** | Support configurable response targets, escalation timers, after-hours behavior, acknowledgement, ownership transfer, follow-up notes, resolution reason, and reopened status.                |
| **ALT-05** | Maintain a queue showing unassigned, assigned, acknowledged, overdue, escalated, resolved, and reopened alerts.                                                                              |
| **ALT-06** | Send staff notifications through configured channels without placing unnecessary PHI in email or SMS.                                                                                        |
| **ALT-07** | Display patient-facing emergency language when configured. The system must clearly state that submissions are not continuously monitored and are not a substitute for 911 or emergency care. |
| **ALT-08** | Support an eCW documentation workflow or output for clinical follow-up. The exact placement can be refined after the pilot.                                                                  |
| **ALT-09** | Every rule version and alert action must be auditable. Changes to clinical alert rules require an authorized clinical publisher.                                                             |

## Configuration precedence

Carlos should propose and document a predictable rule hierarchy. The recommended starting order is global default, program, care stage, modality, physician, and patient-specific override. The system must show which rule ultimately applied and prevent contradictory hidden settings.

# 9 Modality and care rule configuration

The modality record should be the shared configuration source for scheduling, surveys, patient instructions, consents, and monitoring. Carlos already has much of the scheduling information; he should confirm that the existing data can populate the fields below.

| **Configuration group** | **Required fields or controls**                                                                                                                     |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| **Identity**            | Internal ID, display name, category, active status, location, eCW service or resource mapping, and effective dates.                                 |
| **Plan of Care**        | Whether physician authorization is required, permitted stages, Lead Actor applicability, start and stop conditions, and patient-specific limits.    |
| **Scheduling**          | Duration, buffer, rooms, equipment, staff, booking mode, cadence, minimum spacing, maximum frequency, lead time, cancellation window, and capacity. |
| **Preparation**         | Patient instructions, prerequisites, contraindication prompts supplied by clinical leadership, and required acknowledgements.                       |
| **Survey follow-up**    | Required yes or no, survey template, initial offset, repeat offsets, duration, reminders, stop rules, and patient-initiated reporting availability. |
| **Alert logic**         | Applicable rule set, severity mapping, recipients, response target, physician routing, after-hours behavior, and emergency language.                |
| **Documents**           | Required consent or acknowledgement versions and when they must be completed.                                                                       |
| **Operations**          | Responsible department, escalation contact, staff notes, and audit history.                                                                         |

## Initial modalities to support

- Red light therapy

- Oxygen and hydrogen nano baths

- Salt room

- BEMER

- Erchonia laser

- Hydrogen inhalation

- NanoVi

- RIFE

- BioCharger

- Any additional modality activated through the same configuration model

# 10 Member scheduling and eCW integration

| **ID**     | **Requirement**                                                                                                                                                                                                   |
|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **SCH-01** | Present a simple member scheduling interface that shows only services the patient is currently authorized to book.                                                                                                |
| **SCH-02** | Enforce the active Plan of Care, program status, modality cadence, minimum spacing, maximum frequency, required resources, staff availability, location, and payment or administrative holds.                     |
| **SCH-03** | Support direct booking into eCW for approved services when the eCW API supports safe real-time creation.                                                                                                          |
| **SCH-04** | Use real-time availability or another concurrency control so two people cannot take the same resource or appointment.                                                                                             |
| **SCH-05** | Support cancellation and rescheduling within configured rules and synchronize the result with eCW.                                                                                                                |
| **SCH-06** | Distinguish instant booking, request for review, and staff-only scheduling at the modality level.                                                                                                                 |
| **SCH-07** | Record the source, patient, modality, authorization, rule checks, selected resource, eCW identifier, timestamps, and any integration error.                                                                       |
| **SCH-08** | Create a visible exception queue for failed eCW writes or mismatched appointments. Do not silently claim the appointment is confirmed.                                                                            |
| **SCH-09** | Support separate resources for each room or device, including each nano bath room and other capacity-limited equipment.                                                                                           |
| **SCH-10** | Carlos must verify eCW API access, authentication, resource availability, appointment creation, cancellation, rescheduling, webhook or polling options, rate limits, error behavior, and test-environment access. |

# 11 Contract recurring payment and financial controls

The payment workflow should use a qualified third-party processor with hosted or tokenized payment collection. Helixona’s application should not store raw card numbers, security codes, or complete bank-account credentials. The final contract and financial policies remain subject to attorney and operational approval.

| **ID**     | **Requirement**                                                                                                                                                                                  |
|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **PAY-01** | Keep Month 0 as a separate one-time charge or invoice. Do not automatically convert Month 0 into the nine-month recurring membership.                                                            |
| **PAY-02** | Allow membership enrollment only after the program has been offered, the approved agreement is signed, and payment authorization is completed.                                                   |
| **PAY-03** | Support card and ACH, with a processor token stored in the application and raw payment credentials handled by the processor.                                                                     |
| **PAY-04** | Capture authorization terms including amount, frequency, first payment date, anniversary date, payment method, cancellation or revocation instructions, signer, timestamp, and document version. |
| **PAY-05** | Provide the patient a copy of the signed agreement and payment authorization.                                                                                                                    |
| **PAY-06** | Charge \$2,000 on the membership start date and on the same calendar date each month for the nine-month term, subject to the approved agreement and processor handling for short months.         |
| **PAY-07** | Support continuation at \$2,000 per month after Month 9 only after the Month 9 decision and continuation authorization are recorded.                                                             |
| **PAY-08** | Keep insurance patient responsibility, deposits, refunds, and other charges separate from the membership schedule unless separately authorized.                                                  |
| **PAY-09** | Issue a receipt after each successful payment and preserve processor transaction identifiers and reconciliation status.                                                                          |
| **PAY-10** | Provide Karina a failed-payment queue with amount, attempt, reason category, next recommended action, communication history, and patient contact information.                                    |
| **PAY-11** | Support configurable retries, grace periods, notices, scheduling holds, pause, cancellation, refund, write-off, and manual override rules with an audit trail.                                   |
| **PAY-12** | No failed payment may automatically discharge a patient or make a clinical decision. Holds and membership changes require the configured operational approval.                                   |
| **PAY-13** | Provide settlement, payment, failure, refund, chargeback, outstanding balance, and reconciliation reports with export capability.                                                                |

## Recommended starting payment defaults

| **Event**                     | **Recommended configurable default**                                                                                                                         |
|-------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Upcoming recurring charge** | Courtesy reminder three calendar days before the anniversary charge, unless the approved agreement and counsel advise otherwise.                             |
| **Successful payment**        | Immediate receipt by email and availability in the patient record.                                                                                           |
| **First failure**             | Immediate patient notice and task in Karina’s queue. Preserve the processor reason without exposing sensitive payment data.                                  |
| **Retry**                     | Retry on Day 3 and Day 5 when permitted by the processor and applicable payment rules. Make cadence configurable.                                            |
| **Scheduling hold**           | Eligible for hold after five days, but require Karina or an authorized staff member to confirm the hold.                                                     |
| **Clinical access**           | Do not automatically cancel care, discharge the patient, or override clinical judgment because a payment failed.                                             |
| **Pause cancellation refund** | Staff-approved workflows with reason, effective date, financial effect, patient notice, and audit history. Final rules are approved by Helixona and counsel. |

## Compliance-oriented implementation notes

- Use a processor and implementation designed to minimize Helixona’s PCI DSS scope.

- For recurring ACH debits, capture a signed or similarly authenticated authorization and provide a copy to the patient.

- Preserve evidence of identity, assent, the exact terms accepted, and later revocation or replacement of authorization.

- Require counsel and processor review before production use of the final authorization, retry, cancellation, refund, and continuation rules.

# 12 Membership registry and lifecycle automation

The registry is a lightweight operational control center for the pilot. It is not the final HCOS CRM, but its data should migrate cleanly into HCOS.

| **Status**                      | **Meaning**                                            | **Suggested system action**                                                |
|---------------------------------|--------------------------------------------------------|----------------------------------------------------------------------------|
| **Inquiry received**            | New Typeform or staff-created inquiry.                 | Create owner and outreach task.                                            |
| **Advisor outreach**            | Outreach underway.                                     | Track attempts, response, and next action.                                 |
| **Advisor interview completed** | Internal qualification completed.                      | Open insurance and admissions work.                                        |
| **Insurance benefits review**   | Karina reviewing coverage and financial exposure.      | Record review status and summary.                                          |
| **Admissions review**           | Program and financial acceptance decision pending.     | Allow recorded decision.                                                   |
| **Accepted for Month 0**        | Patient approved to enter assessment.                  | Enable Month 0 payment, intake, and scheduling.                            |
| **Denied**                      | Not accepted for the Complex Chronic pathway.          | Record reason and alternate pathway when appropriate.                      |
| **Patient fell off**            | Patient stopped responding before enrollment.          | Stop reminders after approved sequence and retain history.                 |
| **Month 0 scheduled**           | Initial assessment booked.                             | Track intake and document completion.                                      |
| **Month 0 in progress**         | Testing and assessment underway.                       | Track Plan of Care milestone.                                              |
| **Plan of Care completed**      | Plan reviewed with patient.                            | Allow program offer decision.                                              |
| **Program offered**             | Patient eligible for nine-month membership.            | Enable contract and payment package.                                       |
| **Program not offered**         | Helixona determined program is not appropriate.        | Record reason and alternate care path.                                     |
| **Patient declined**            | Patient did not accept the offered program.            | Record reason and follow-up permission.                                    |
| **Contract pending**            | Agreement assigned but incomplete.                     | Run configurable reminders.                                                |
| **Payment pending**             | Agreement complete and payment setup incomplete.       | Run financial follow-up.                                                   |
| **Active member**               | Membership current and care active.                    | Enable authorized scheduling and surveys.                                  |
| **Temporarily paused**          | Approved pause such as travel or clinical need.        | Apply approved payment, survey, and scheduling effects.                    |
| **Month 9 review**              | Continuation decision due.                             | Create physician review task.                                              |
| **Continued active care**       | Active care continues after Month 9.                   | Continue recurring payment and month count.                                |
| **Maintenance**                 | Patient transitioned to maintenance care.              | Apply the maintenance rules.                                               |
| **Graduated**                   | Program goals reached and active membership completed. | Close recurring plan and preserve record.                                  |
| **Withdrawn**                   | Patient elected to stop.                               | Apply approved financial and communication workflow.                       |
| **Discharged**                  | Helixona ended participation.                          | Apply approved access, payment, communication, and documentation workflow. |

| **ID**     | **Requirement**                                                                                                                              |
|------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| **CRM-01** | Track current status, status history, effective date, actor, reason code, notes, and supporting task or document.                            |
| **CRM-02** | Track Month 0 dates, membership start, initial nine-month end, pause periods, Month 9 review, continuation, and total months in active care. |
| **CRM-03** | Allow authorized care-team and operations users to update status within permissions.                                                         |
| **CRM-04** | Provide configurable transition rules, required fields, tasks, notifications, scheduling effects, payment effects, and approvals.            |
| **CRM-05** | Start with suggested automations but allow Carlos and Helixona to refine them without database changes or code rewrites.                     |
| **CRM-06** | Prevent irreversible automatic transitions for discharge, refund, cancellation, or clinical disposition.                                     |

# 13 Notification and communication engine

Email and SMS are the MVP channels. Each message type should be managed through a configuration record rather than hard-coded timing or recipients.

| **Configuration field** | **Purpose**                                                                                                                  |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------|
| **Event or trigger**    | Status change, assigned form, due date, failed payment, upcoming appointment, survey event, alert, or manual staff action.   |
| **Audience**            | Patient, caregiver only when later authorized, advisor, Shibani, Karina, Charlene, nursing, physician, or technical support. |
| **Channel**             | Email, SMS, in-application staff task, or configured combination.                                                            |
| **Timing**              | Immediate, offset before or after an event, business-hour window, recurrence, and maximum sends.                             |
| **Template**            | Versioned subject and message body with approved merge fields and minimal PHI.                                               |
| **Reply behavior**      | Reply-to destination, monitored or no-reply status, and staff owner.                                                         |
| **Stop rule**           | Completed action, status change, opt-out where applicable, manual stop, or maximum reminder count.                           |
| **Escalation**          | Create a staff task when delivery fails, the patient remains incomplete, or another configured condition occurs.             |
| **Audit**               | Template version, recipient, channel, time, delivery result, and originating event.                                          |

## Initial message families

- Inquiry confirmation and advisor follow-up

- Missing insurance information and admissions outcome

- Month 0 payment, intake assignment, incomplete intake, and appointment reminders

- Contract ready, contract incomplete, payment confirmation, and failed payment

- Survey assignment, survey reminder, crash-report acknowledgement, and staff alert

- Member welcome, scheduling confirmation, change, cancellation, and preparation instructions

- Month 9 review and continuation decision

- Warm outreach when the team has not heard from the patient

Communication templates and timing will be filled in by Helixona. Carlos should provide the configuration structure, preview, test-send function, version control, and delivery reporting.

# 14 Administration reporting audit and security

| **ID**     | **Requirement**                                                                                                                                                                             |
|------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **ADM-01** | Provide administration screens for forms, survey templates, question bank, modality rules, alert rules, message templates, lifecycle rules, roles, users, and system mappings.              |
| **ADM-02** | Separate draft, review, approved, published, retired, and archived states where content affects patients or clinical workflows.                                                             |
| **ADM-03** | Require an authorized clinical publisher for clinical questionnaire, survey, scoring, and alert-rule publication.                                                                           |
| **ADM-04** | Provide operational dashboards for intake completion, chart prep, alerts, scheduling exceptions, contract completion, payment failures, active members, Month 9 reviews, and pilot defects. |
| **ADM-05** | Provide exports appropriate to the user’s permissions and log exports containing patient data.                                                                                              |
| **ADM-06** | Maintain audit logs for authentication, patient access, record changes, configuration changes, signatures, payments, alerts, scheduling, communications, and administrative actions.        |
| **ADM-07** | Use unique accounts, role-based access, MFA for staff, secure session controls, automatic logoff, strong password or identity-provider controls, and rapid access termination.              |
| **ADM-08** | Encrypt ePHI in transit and at rest, manage keys securely, minimize PHI in logs and messages, and use secrets management rather than source-code credentials.                               |
| **ADM-09** | Maintain tested backups, recovery objectives, monitoring, alerting, vulnerability management, dependency updates, and an incident-response process.                                         |
| **ADM-10** | Use separate development, test, and production environments. Do not use production PHI in development or ordinary testing.                                                                  |
| **ADM-11** | Confirm appropriate BAAs and contracts for AWS and every vendor that creates, receives, maintains, or transmits ePHI.                                                                       |

# 15 Integrations and source of truth

| **System**            | **MVP role**                                                                                                                           | **Source of truth direction**                                                                        |
|-----------------------|----------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| **Typeform**          | Public inquiry entry point.                                                                                                            | Source submission is imported; AWS application owns the operational inquiry record.                  |
| **AWS application**   | Intake, forms, surveys, configuration, queues, membership registry, document storage, operational history, and future HCOS foundation. | Operational source of truth for the MVP modules described in this brief.                             |
| **eClinicalWorks**    | Medical record, appointments, chart documents, clinical note placement, and Helo portal.                                               | Medical chart and appointment system of record during the MVP.                                       |
| **Payment processor** | Hosted card and ACH capture, tokens, recurring charges, refunds, settlement, and processor transaction history.                        | Payment credential and transaction source; AWS stores tokens, statuses, and reconciliation metadata. |
| **Email provider**    | Transactional email.                                                                                                                   | Delivery status returned to AWS.                                                                     |
| **SMS provider**      | Transactional text messages and staff alerts.                                                                                          | Delivery and opt-out status returned to AWS.                                                         |
| **Future HCOS**       | Long-term unified operating and clinical platform.                                                                                     | MVP data must remain structured and exportable for migration.                                        |

## Integration controls

- Use stable external identifiers and an internal patient identifier.

- Use idempotency or duplicate prevention for webhook, payment, scheduling, and message events.

- Record request, response, timestamp, correlation identifier, result, retry count, and exception without logging unnecessary PHI or payment data.

- Provide retry, reconciliation, and manual resolution tools for failed integrations.

- Document rate limits, expected latency, downtime behavior, and the owner of each interface.

# 16 Pilot acceptance criteria

| **Area**                 | **Acceptance test**                                                                                                                                                       |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Patient initiation**   | An advisor can create the record and send a secure invitation. Public users cannot self-enroll in Complex Chronic care.                                                   |
| **Intake**               | A patient can save and return, answer the Medical Director’s questionnaire exactly as configured, upload records, sign assigned paperwork, and submit from a phone.       |
| **Staff review**         | Shibani or the coordinator can see completion status and missing items. Charlene can generate the copyable eCW note and PDF and complete chart prep.                      |
| **Documents**            | The system can present, sign, version, store, retrieve, and provide patient copies of the current required forms.                                                         |
| **Surveys**              | Staff can configure a survey without a code deployment and assign it by stage, modality, physician, or patient.                                                           |
| **Treatment follow-up**  | A modality can be configured to send surveys at multiple treatment-relative times and stop according to its configured rule.                                              |
| **Alerts**               | A configured answer or score creates the correct queue item, recipient notification, response target, acknowledgement, follow-up record, escalation, and closure history. |
| **Scheduling**           | An active member sees only authorized services. A permitted appointment is created in eCW without double booking, or a visible exception is created.                      |
| **Contract and payment** | The patient signs the approved package, enrolls by card or ACH, receives a copy, and the recurring anniversary schedule appears correctly.                                |
| **Payment failure**      | A simulated failure creates Karina’s task, sends the configured notice, supports retry, and does not automatically discharge the patient.                                 |
| **Lifecycle**            | Authorized staff can move a test patient through every approved status while preserving history, reasons, tasks, and total active months.                                 |
| **Security**             | Role tests prevent unauthorized access. Staff MFA, audit logging, session controls, backup, restore, and vendor configuration are verified.                               |
| **Pilot readiness**      | Three to five pilot patients can be supported with an issue log, named owners, severity, workaround, and resolution status.                                               |

# 17 Technical decisions for Carlos

Carlos should answer these questions in his architecture proposal. They are not blockers to beginning discovery and foundational development.

21. What application framework, database, hosting pattern, and deployment approach does he recommend for the MVP and the future HCOS path?

22. Which AWS services will be used, which contain ePHI, and how will BAA coverage, encryption, keys, secrets, backups, recovery, monitoring, and audit logs be handled?

23. What is the proposed data model for patient identity, program enrollment, forms, survey versions, modality rules, alerts, appointments, payments, communications, tasks, and lifecycle history?

24. How will tenant or organization boundaries be included now without expanding the pilot into a full multi-tenant product?

25. What authentication approach should patients use for the MVP: account and password, secure magic link, or another approach? How will identity proofing, password reset, invitation expiry, and duplicate prevention work?

26. What staff identity provider and MFA approach will be used?

27. How will the system enforce role, location, patient assignment, clinical publisher, financial administrator, and technical administrator permissions?

28. How will Typeform data enter the platform, and how will webhook retries and duplicate submissions be handled?

29. What eCW APIs are available for patient matching, resource availability, appointment creation, rescheduling, cancellation, document upload, and clinical notes?

30. What eCW sandbox or test environment and credentials are available, and what technical or contractual restrictions apply?

31. How will the application reconcile eCW appointments and detect mismatches or writes that failed after the patient saw a confirmation?

32. Which payment processor best supports hosted card and ACH capture, tokenization, recurring anniversary billing, refunds, retries, receipts, webhooks, reporting, and acceptable fees?

33. How will PCI scope be minimized, and what responsibilities remain with Helixona?

34. Which email and SMS services will be used, and how will PHI minimization, consent, opt-out, delivery status, and failed delivery be handled?

35. How will rule precedence work across global, program, stage, modality, physician, and patient settings?

36. How will versioned configuration be tested, approved, published, rolled back, and tied to the exact patient event that used it?

37. How will alerts be delivered reliably, acknowledged, escalated, and monitored when an integration is unavailable?

38. What observability, exception queues, dashboards, audit exports, and support tools will the pilot team have?

39. What data-export format will support future HCOS migration without losing versions, audit history, signatures, or external identifiers?

40. What can be delivered safely for the three-to-five-patient pilot, what requires a controlled workaround, and what should be deferred?

# 18 Assigned follow up and source collection

| **Owner**                    | **Action**                                                                                                                                                            | **Needed for**                                                          |
|------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| **Carlos**                   | Meet with Charlene and document the current eCW copy-and-paste, PDF upload, and chart-prep workflow.                                                                  | Final eCW output specification and acceptance test.                     |
| **Carlos**                   | Gather the current intake paperwork, HIPAA and privacy forms, financial forms, consents, acknowledgements, and signature requirements from Shibani and the team.      | Document packet inventory and signature engine configuration.           |
| **Carlos**                   | Review the scheduling data already provided and map it to the modality configuration model.                                                                           | Scheduling and modality administration.                                 |
| **Carlos**                   | Confirm eCW integration capabilities and constraints.                                                                                                                 | Direct scheduling, patient matching, documents, and future integration. |
| **Carlos**                   | Recommend the technical architecture, payment processor, email provider, SMS provider, authentication approach, and MVP delivery plan.                                | Architecture approval and build sequencing.                             |
| **Medical Director**         | Supply the clinical questionnaire and approve clinical survey, scoring, alert, and modality content as it is developed.                                               | Clinical content and publication authority.                             |
| **Clinical team and Karina** | Populate survey templates, treatment follow-up settings, response categories, recipients, response targets, and escalation rules through the configuration structure. | Clinical monitoring operation.                                          |
| **Shibani and team**         | Provide all current patient-facing paperwork and explain when each item is used.                                                                                      | Forms and consents inventory.                                           |
| **Charlene**                 | Demonstrate the current chart-prep process and validate the generated eCW output.                                                                                     | Chart-prep acceptance.                                                  |
| **Karina**                   | Approve payment operations, reconciliation needs, deposit treatment, holds, retries, and financial reports.                                                           | Payment configuration.                                                  |
| **Cassandra**                | Approve patient-facing language, program rules, lifecycle automations, scope decisions, and launch readiness.                                                         | Program governance.                                                     |
| **Healthcare attorney**      | Review the membership contract, financial authorization, cancellation and refund terms, consent language, and applicable payment and communication requirements.      | Production legal approval.                                              |

# 19 Recommended build sequence

| **Sequence** | **Build focus**             | **Demonstration outcome**                                                                                                                 |
|--------------|-----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| **1**        | Foundation                  | AWS environments, authentication, roles, patient identity, audit framework, configuration framework, and integration skeletons.           |
| **2**        | Intake and documents        | Advisor initiation, patient invitation, questionnaire rendering, uploads, signatures, completeness review, eCW text, and PDF.             |
| **3**        | Survey and modality engines | Template builder, modality settings, schedules, patient assignments, submissions, alert rules, queues, acknowledgement, and escalation.   |
| **4**        | Membership registry         | Statuses, history, notes, tasks, automations, total months, pauses, Month 9 review, and dashboards.                                       |
| **5**        | Payment                     | Contract package, card and ACH tokenization, recurring anniversary schedule, receipts, failure queue, retries, holds, and reconciliation. |
| **6**        | Scheduling                  | Plan-of-Care authorization, modality rules, resource availability, eCW booking, cancellation, rescheduling, and exception handling.       |
| **7**        | Notifications and website   | Typeform handoff, approved website changes, configurable email and SMS templates, timing, delivery, and stop rules.                       |
| **8**        | Integrated pilot testing    | Complete mock patients, privacy and permission tests, failure cases, staff training, defect triage, and pilot go or no-go.                |

## Definition of a usable first build

The first internal demonstration does not need final survey wording or every modality rule. It does need to prove that an authorized administrator can create and publish a versioned survey, connect it to a modality, schedule multiple follow-ups, configure an alert and recipient, assign it to a test patient, receive the patient response, and complete the alert through resolution. The same principle applies to forms, notifications, lifecycle rules, and modalities: demonstrate the configurable structure with representative content, then Helixona will continue filling in the approved details.

# 20 Standards and implementation references

These sources provide implementation guardrails. They do not replace review by Helixona’s healthcare attorney, payment processor, compliance advisors, or security professionals.

| **Reference**                              | **Link**                                                                                          | **Use**                                                                                                                           |
|--------------------------------------------|---------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| **HHS HIPAA Security Rule**                | https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html                  | Administrative, physical, and technical safeguards for ePHI.                                                                      |
| **HHS Security Rule guidance**             | https://www.hhs.gov/hipaa/for-professionals/security/guidance/index.html                          | Risk management and practical security guidance.                                                                                  |
| **PCI Security Standards Council PCI DSS** | https://www.pcisecuritystandards.org/standards/pci-dss/                                           | Baseline requirements for protecting payment account data.                                                                        |
| **CFPB Regulation E Section 1005.10**      | https://www.consumerfinance.gov/rules-policy/regulations/1005/10/                                 | Authorization and consumer-copy requirements for recurring electronic fund transfers.                                             |
| **Nacha ACH Developer Guide**              | https://achdevguide.nacha.org/index.php/how-ach-works                                             | ACH entry types and authorization concepts for consumer recurring debits.                                                         |
| **United States Code E Sign Act**          | https://uscode.house.gov/view.xhtml?edition=prelim&req=granuleid%3AUSC-prelim-title15-section7001 | Legal effect of electronic records and signatures, subject to applicable requirements.                                            |
| **California Legislative Information**     | https://leginfo.legislature.ca.gov/                                                               | Current California statutes for counsel to review for membership, renewal, cancellation, privacy, and communication requirements. |

## Approval and next action

Carlos should review this brief, identify any technical assumptions that materially change scope or timing, and return an architecture proposal, build sequence, integration findings, and open-decision list. He may begin foundational architecture and configuration-engine work immediately while the Helixona team supplies the clinical content and current documents.
