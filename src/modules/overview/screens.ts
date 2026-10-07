export interface Screen { n: number; title: string; path: string; group: string; surface: 'patient' | 'staff'; purpose: string; phase: 1 | 2 | 3 }

export const screens: Screen[] = [
  { n: 1, title: 'Invitation landing & verification', path: '/patient/invite', group: 'Patient · Intake (phone)', surface: 'patient', purpose: '“You’ve been invited by Helixona” → verify by secure link or texted code → start.', phase: 1 },
  { n: 2, title: 'Intake questionnaire', path: '/patient/intake', group: 'Patient · Intake (phone)', surface: 'patient', purpose: 'Multi-section, progress, save & return, all question types, conditional questions, required validation.', phase: 1 },
  { n: 3, title: 'Document uploads', path: '/patient/uploads', group: 'Patient · Intake (phone)', surface: 'patient', purpose: 'Insurance card, ID, medication list, labs, records… with inventory and returned-item handling.', phase: 1 },
  { n: 4, title: 'Forms & consents', path: '/patient/forms', group: 'Patient · Intake (phone)', surface: 'patient', purpose: 'Assigned documents; open, scroll to end, sign typed or drawn, timestamped.', phase: 1 },
  { n: 5, title: 'Submission confirmation', path: '/patient/submitted', group: 'Patient · Intake (phone)', surface: 'patient', purpose: 'Thank-you and “what happens next”.', phase: 1 },
  { n: 0, title: 'My program (home)', path: '/patient/home', group: 'Patient · Intake (phone)', surface: 'patient', purpose: 'Patient home with next step, package status, and monitoring notice.', phase: 1 },
  { n: 6, title: 'Inquiry list', path: '/staff/inquiries', group: 'Staff · Intake (desktop)', surface: 'staff', purpose: 'Typeform inquiries with pathway, source, status, owner, next action.', phase: 1 },
  { n: 7, title: 'Create patient & send invitation', path: '/staff/patients/new', group: 'Staff · Intake (desktop)', surface: 'staff', purpose: 'Advisor creates the record and sends the secure invitation; tracker on the patient record.', phase: 1 },
  { n: 7, title: 'Patients & invitations', path: '/staff/patients', group: 'Staff · Intake (desktop)', surface: 'staff', purpose: 'Invitation status (sent → submitted, expired, reissued) and intake progress per patient.', phase: 1 },
  { n: 8, title: 'Advisor interview (internal)', path: '/staff/patients/P-0043?tab=interview', group: 'Staff · Intake (desktop)', surface: 'staff', purpose: 'Internal qualification notes, separate from the medical record.', phase: 1 },
  { n: 9, title: 'Admissions outcome', path: '/staff/patients/P-0043?tab=admissions', group: 'Staff · Intake (desktop)', surface: 'staff', purpose: 'Accepted for Month 0 / denied / fell off with reason codes, date, staff member.', phase: 1 },
  { n: 10, title: 'Intake review', path: '/staff/intake-review', group: 'Staff · Intake (desktop)', surface: 'staff', purpose: 'Completeness checklist, return item to patient, follow-up note, mark ready for chart prep.', phase: 1 },
  { n: 11, title: 'Chart prep (Charlene)', path: '/staff/chart-prep', group: 'Staff · Intake (desktop)', surface: 'staff', purpose: 'Formatted note with copy-to-clipboard, PDF, document inventory, manual and connector paths.', phase: 1 },
  { n: 12, title: 'eCW connector exceptions', path: '/staff/ecw-exceptions', group: 'Staff · Intake (desktop)', surface: 'staff', purpose: 'Failed connector jobs: step, screenshot, retry or close as done manually.', phase: 1 },
  { n: 18, title: 'Membership registry', path: '/staff/registry', group: 'Staff · Priority 2–3 (placeholders)', surface: 'staff', purpose: 'Lifecycle statuses and history.', phase: 2 },
  { n: 17, title: 'Alert queue', path: '/staff/alerts', group: 'Staff · Priority 2–3 (placeholders)', surface: 'staff', purpose: 'Survey and crash-report alerts.', phase: 2 },
  { n: 13, title: 'Clinical configuration', path: '/staff/clinical-config', group: 'Staff · Priority 2–3 (placeholders)', surface: 'staff', purpose: 'Surveys, modalities, alert rules.', phase: 2 },
  { n: 20, title: 'Resource calendar', path: '/staff/calendar', group: 'Staff · Priority 2–3 (placeholders)', surface: 'staff', purpose: 'Rooms and devices.', phase: 3 },
  { n: 22, title: 'Payments', path: '/staff/payments', group: 'Staff · Priority 2–3 (placeholders)', surface: 'staff', purpose: 'Failed-payment queue.', phase: 3 },
  { n: 24, title: 'Dashboards', path: '/staff/dashboards', group: 'Staff · Priority 2–3 (placeholders)', surface: 'staff', purpose: 'Program KPIs.', phase: 3 },
]
