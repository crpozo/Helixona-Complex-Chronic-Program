import type { AuditEntry, RegistryStatus } from './types'

/* ---------------- Modalities (requirements §9) ---------------- */
export interface Modality {
  id: string; name: string; category: string; active: boolean; location: string; ecwResource: string
  authRequired: boolean; stages: string[]; bookingMode: 'Book now' | 'Request' | 'Staff only'
  duration: number; buffer: number; resources: string[]; minSpacingDays: number; maxPerWeek: number; leadTimeHours: number; cancelWindowHours: number
  prep: string; surveyTemplate: string; surveyOffsets: number[]; alertRuleSet: string; documents: string[]; owner: string; version: number
}
export const modalities: Modality[] = [
  { id: 'MOD-01', name: 'Red light therapy', category: 'Photobiomodulation', active: true, location: 'Suite B · Room 3', ecwResource: 'RLT-ROOM3 (to confirm)', authRequired: true, stages: ['Active care', 'Maintenance'], bookingMode: 'Book now', duration: 30, buffer: 10, resources: ['Red light bed 1'], minSpacingDays: 2, maxPerWeek: 3, leadTimeHours: 12, cancelWindowHours: 24, prep: 'Arrive with clean skin, no lotions. Bring eye protection if you have your own.', surveyTemplate: 'Post-treatment check-in v2', surveyOffsets: [1, 3, 7], alertRuleSet: 'Program default', documents: ['Red light consent v1.2'], owner: 'Nursing', version: 3 },
  { id: 'MOD-02', name: 'Oxygen & hydrogen nano bath', category: 'Hydrotherapy', active: true, location: 'Suite A · Nano bath rooms 1–2', ecwResource: 'NANO-1, NANO-2 (to confirm)', authRequired: true, stages: ['Active care'], bookingMode: 'Book now', duration: 45, buffer: 15, resources: ['Nano bath room 1', 'Nano bath room 2'], minSpacingDays: 3, maxPerWeek: 2, leadTimeHours: 24, cancelWindowHours: 24, prep: 'Hydrate well. Avoid heavy meals 2 hours before. Bring a swimsuit.', surveyTemplate: 'Post-treatment check-in v2', surveyOffsets: [1, 3], alertRuleSet: 'Program default', documents: ['Hydrotherapy consent v2.0'], owner: 'Nursing', version: 2 },
  { id: 'MOD-03', name: 'Salt room', category: 'Halotherapy', active: true, location: 'Suite B · Salt room', ecwResource: 'SALT (to confirm)', authRequired: false, stages: ['Active care', 'Maintenance'], bookingMode: 'Book now', duration: 45, buffer: 15, resources: ['Salt room (4 seats)'], minSpacingDays: 1, maxPerWeek: 4, leadTimeHours: 4, cancelWindowHours: 12, prep: 'Wear comfortable clothing.', surveyTemplate: 'None', surveyOffsets: [], alertRuleSet: 'Program default', documents: [], owner: 'Front desk', version: 1 },
  { id: 'MOD-04', name: 'BEMER', category: 'PEMF', active: true, location: 'Suite B · Room 2', ecwResource: 'BEMER (to confirm)', authRequired: true, stages: ['Active care'], bookingMode: 'Book now', duration: 20, buffer: 10, resources: ['BEMER mat 1', 'BEMER mat 2'], minSpacingDays: 1, maxPerWeek: 5, leadTimeHours: 4, cancelWindowHours: 12, prep: 'None.', surveyTemplate: 'Post-treatment check-in v2', surveyOffsets: [1], alertRuleSet: 'Program default', documents: ['PEMF acknowledgement v1.0'], owner: 'Nursing', version: 2 },
  { id: 'MOD-05', name: 'Erchonia laser', category: 'Low-level laser', active: true, location: 'Suite A · Treatment 1', ecwResource: 'LASER (to confirm)', authRequired: true, stages: ['Active care'], bookingMode: 'Request', duration: 30, buffer: 10, resources: ['Erchonia unit', 'Laser tech'], minSpacingDays: 5, maxPerWeek: 1, leadTimeHours: 48, cancelWindowHours: 48, prep: 'Remove jewelry near treatment area.', surveyTemplate: 'Laser follow-up v1', surveyOffsets: [1, 3, 7], alertRuleSet: 'Laser rules', documents: ['Laser consent v1.1'], owner: 'Nursing', version: 4 },
  { id: 'MOD-06', name: 'Hydrogen inhalation', category: 'Inhalation', active: true, location: 'Suite B · Lounge', ecwResource: 'H2 (to confirm)', authRequired: true, stages: ['Active care', 'Maintenance'], bookingMode: 'Book now', duration: 60, buffer: 0, resources: ['H2 station 1', 'H2 station 2', 'H2 station 3'], minSpacingDays: 1, maxPerWeek: 5, leadTimeHours: 4, cancelWindowHours: 12, prep: 'None.', surveyTemplate: 'None', surveyOffsets: [], alertRuleSet: 'Program default', documents: [], owner: 'Front desk', version: 1 },
  { id: 'MOD-07', name: 'NanoVi', category: 'Bio-identical signaling', active: true, location: 'Suite B · Lounge', ecwResource: 'NANOVI (to confirm)', authRequired: true, stages: ['Active care'], bookingMode: 'Book now', duration: 30, buffer: 0, resources: ['NanoVi unit'], minSpacingDays: 1, maxPerWeek: 3, leadTimeHours: 4, cancelWindowHours: 12, prep: 'None.', surveyTemplate: 'Post-treatment check-in v2', surveyOffsets: [1], alertRuleSet: 'Program default', documents: [], owner: 'Nursing', version: 1 },
  { id: 'MOD-08', name: 'RIFE', category: 'Frequency', active: true, location: 'Suite A · Treatment 2', ecwResource: 'RIFE (to confirm)', authRequired: true, stages: ['Active care'], bookingMode: 'Request', duration: 45, buffer: 15, resources: ['RIFE unit'], minSpacingDays: 3, maxPerWeek: 2, leadTimeHours: 24, cancelWindowHours: 24, prep: 'Hydrate well before and after.', surveyTemplate: 'Post-treatment check-in v2', surveyOffsets: [1, 3], alertRuleSet: 'Program default', documents: ['Frequency therapy consent v1.0'], owner: 'Nursing', version: 2 },
  { id: 'MOD-09', name: 'BioCharger', category: 'Energy', active: false, location: 'Suite B · Room 2', ecwResource: '—', authRequired: true, stages: ['Active care'], bookingMode: 'Staff only', duration: 20, buffer: 10, resources: ['BioCharger unit'], minSpacingDays: 1, maxPerWeek: 3, leadTimeHours: 4, cancelWindowHours: 12, prep: 'None.', surveyTemplate: 'None', surveyOffsets: [], alertRuleSet: 'Program default', documents: [], owner: 'Nursing', version: 1 },
]

/* ---------------- Survey templates (§8) ---------------- */
export type ContentState = 'Draft' | 'In review' | 'Approved' | 'Published' | 'Retired'
export interface SurveyTemplate { id: string; name: string; type: string; version: number; state: ContentState; questions: number; assignedTo: string[]; updatedBy: string; updatedAt: string; publishedBy?: string }
export const surveyTemplates: SurveyTemplate[] = [
  { id: 'SRV-01', name: 'Post-treatment check-in', type: 'Post-treatment', version: 2, state: 'Published', questions: 6, assignedTo: ['Red light', 'Nano bath', 'BEMER', 'NanoVi', 'RIFE'], updatedBy: 'Dr. D.', updatedAt: 'Sep 20, 2026', publishedBy: 'Dr. D.' },
  { id: 'SRV-02', name: 'Weekly core check-in', type: 'Weekly core', version: 1, state: 'Published', questions: 9, assignedTo: ['Program · Active care'], updatedBy: 'Dr. D.', updatedAt: 'Sep 15, 2026', publishedBy: 'Dr. D.' },
  { id: 'SRV-03', name: 'Crash / flare report', type: 'Patient-initiated', version: 1, state: 'Published', questions: 7, assignedTo: ['Program · all stages'], updatedBy: 'Dr. D.', updatedAt: 'Sep 15, 2026', publishedBy: 'Dr. D.' },
  { id: 'SRV-04', name: 'Laser follow-up', type: 'Post-treatment', version: 1, state: 'Approved', questions: 5, assignedTo: ['Erchonia laser'], updatedBy: 'Nursing', updatedAt: 'Oct 2, 2026' },
  { id: 'SRV-05', name: 'Baseline symptoms', type: 'Baseline', version: 1, state: 'In review', questions: 14, assignedTo: ['Program · Month 0'], updatedBy: 'Cassandra', updatedAt: 'Oct 5, 2026' },
  { id: 'SRV-06', name: 'Daily pulse (optional)', type: 'Daily pulse', version: 1, state: 'Draft', questions: 3, assignedTo: [], updatedBy: 'Nursing', updatedAt: 'Oct 6, 2026' },
  { id: 'SRV-00', name: 'Post-treatment check-in', type: 'Post-treatment', version: 1, state: 'Retired', questions: 5, assignedTo: [], updatedBy: 'Dr. D.', updatedAt: 'Sep 20, 2026', publishedBy: 'Dr. D.' },
]
export const questionBank = [
  { id: 'Q-ENERGY', text: 'Energy level today (0–10)', type: '0–10 scale', score: 'Raw' },
  { id: 'Q-PAIN', text: 'Pain level today (0–10)', type: '0–10 scale', score: 'Raw' },
  { id: 'Q-SLEEP', text: 'Sleep quality last night (0–10)', type: '0–10 scale', score: 'Raw' },
  { id: 'Q-REACTION', text: 'Did you have any reaction after your session?', type: 'Yes / No', score: 'Branch' },
  { id: 'Q-REACTION-TXT', text: 'Describe the reaction', type: 'Long text', score: '—' },
  { id: 'Q-WORSE', text: 'Are your symptoms worse than before the session?', type: 'Single choice', score: 'Weighted' },
  { id: 'Q-CONTACT', text: 'Would you like someone from the care team to contact you?', type: 'Yes / No', score: 'Flag' },
]

/* ---------------- Alert rules (§8) ---------------- */
export type AlertLevel = 'Informational' | 'Routine review' | 'Nurse follow-up' | 'Urgent clinical review' | 'Emergency instruction'
export interface AlertRule { id: string; name: string; layer: 'Global' | 'Program' | 'Stage' | 'Modality' | 'Physician' | 'Patient override'; scope: string; trigger: string; level: AlertLevel; recipients: string; responseTarget: string; escalation: string; afterHours: string; version: number; state: ContentState }
export const alertRules: AlertRule[] = [
  { id: 'AR-01', name: 'Contact requested', layer: 'Global', scope: 'All programs', trigger: 'Q-CONTACT = Yes', level: 'Nurse follow-up', recipients: 'Nursing (assigned) · backup: charge nurse', responseTarget: '4 business hours', escalation: 'After 4 h → physician on call', afterHours: 'Queue for next business morning + auto-reply with emergency language', version: 2, state: 'Published' },
  { id: 'AR-02', name: 'Severe crash', layer: 'Program', scope: 'Complex Chronic', trigger: 'Crash severity ≥ 8 OR symptoms include "chest pain", "fainting"', level: 'Urgent clinical review', recipients: 'Treating physician · backup: Medical Director', responseTarget: '1 hour', escalation: 'After 1 h → Medical Director + Cassandra', afterHours: 'Page physician on call', version: 3, state: 'Published' },
  { id: 'AR-03', name: 'Pain increase after session', layer: 'Modality', scope: 'Erchonia laser', trigger: 'Pain +3 vs. baseline within 72 h', level: 'Nurse follow-up', recipients: 'Nursing (assigned)', responseTarget: '1 business day', escalation: 'After 1 day → treating physician', afterHours: 'Next business morning', version: 1, state: 'Published' },
  { id: 'AR-04', name: 'Three low-energy days', layer: 'Stage', scope: 'Active care', trigger: 'Energy ≤ 3 on 3 consecutive surveys', level: 'Routine review', recipients: 'Nursing (assigned)', responseTarget: '2 business days', escalation: 'None', afterHours: 'Next business morning', version: 1, state: 'Published' },
  { id: 'AR-05', name: 'Dr. D. — direct routing', layer: 'Physician', scope: 'Dr. D.\'s patients', trigger: 'Any Urgent clinical review', level: 'Urgent clinical review', recipients: 'Dr. D. directly (SMS) · backup: NP', responseTarget: '30 min', escalation: 'After 30 min → Medical Director', afterHours: 'Dr. D. mobile', version: 1, state: 'Published' },
  { id: 'AR-06', name: 'P-0041 · lower threshold', layer: 'Patient override', scope: 'P-0041', trigger: 'Crash severity ≥ 6', level: 'Urgent clinical review', recipients: 'Inherits from physician layer', responseTarget: 'Inherits', escalation: 'Inherits', afterHours: 'Inherits', version: 1, state: 'Published' },
  { id: 'AR-07', name: 'Missed weekly survey ×2', layer: 'Program', scope: 'Complex Chronic', trigger: 'Weekly core not submitted 2 weeks in a row', level: 'Informational', recipients: 'Advisor (Ana)', responseTarget: '3 business days', escalation: 'None', afterHours: '—', version: 1, state: 'In review' },
]

/* ---------------- Alerts queue (§8 ALT-05) ---------------- */
export type AlertStatus = 'Unassigned' | 'Assigned' | 'Acknowledged' | 'Overdue' | 'Escalated' | 'Resolved' | 'Reopened'
export interface Alert { id: string; patientId: string; level: AlertLevel; status: AlertStatus; source: string; summary: string; rule: string; createdAt: string; dueBy: string; assignee: string; physician: string; history: AuditEntry[] }
export const alerts: Alert[] = [
  { id: 'AL-3312', patientId: 'P-0041', level: 'Urgent clinical review', status: 'Escalated', source: 'Crash report', summary: 'Severity 7/10 · "crashed hard after nano bath, dizzy, heart racing"', rule: 'AR-06 (patient override) → AR-05 (physician)', createdAt: 'Oct 8, 2026 · 7:42 AM', dueBy: 'Oct 8 · 8:12 AM', assignee: 'Dr. D.', physician: 'Dr. D.', history: [
    { actor: 'Rules engine', when: 'Oct 8, 2026 · 7:42 AM', action: 'Alert created · Urgent clinical review', reason: 'AR-06 patient override (severity ≥ 6) · applied layer: Patient override' },
    { actor: 'System', when: 'Oct 8, 2026 · 7:42 AM', action: 'Notified Dr. D. (SMS) · backup NP (email)', reason: 'AR-05 routing · no patient details in message' },
    { actor: 'System', when: 'Oct 8, 2026 · 8:13 AM', action: 'Escalated to Medical Director', reason: 'Response target 30 min lapsed' },
  ] },
  { id: 'AL-3311', patientId: 'P-0044', level: 'Nurse follow-up', status: 'Acknowledged', source: 'Post-treatment survey +1 d', summary: 'Contact requested · mild rash after red light', rule: 'AR-01', createdAt: 'Oct 8, 2026 · 6:55 AM', dueBy: 'Oct 8 · 12:55 PM', assignee: 'Nursing · Jen', physician: 'Dr. D.', history: [
    { actor: 'Rules engine', when: 'Oct 8, 2026 · 6:55 AM', action: 'Alert created · Nurse follow-up', reason: 'AR-01 · applied layer: Global' },
    { actor: 'Jen (nursing)', when: 'Oct 8, 2026 · 8:02 AM', action: 'Acknowledged' },
  ] },
  { id: 'AL-3309', patientId: 'P-0039', level: 'Routine review', status: 'Overdue', source: 'Weekly core check-in', summary: 'Energy ≤ 3 on 3 consecutive check-ins', rule: 'AR-04', createdAt: 'Oct 5, 2026 · 9:10 AM', dueBy: 'Oct 7 · 9:10 AM', assignee: 'Nursing · Jen', physician: 'Dr. D.', history: [{ actor: 'Rules engine', when: 'Oct 5, 2026 · 9:10 AM', action: 'Alert created · Routine review', reason: 'AR-04 · applied layer: Stage' }] },
  { id: 'AL-3308', patientId: 'P-0043', level: 'Informational', status: 'Unassigned', source: 'Missed survey', summary: 'Weekly core not submitted 2 weeks in a row', rule: 'AR-07', createdAt: 'Oct 7, 2026 · 6:00 AM', dueBy: 'Oct 10 · 6:00 AM', assignee: '—', physician: 'Dr. D.', history: [{ actor: 'Rules engine', when: 'Oct 7, 2026 · 6:00 AM', action: 'Alert created · Informational', reason: 'AR-07 · applied layer: Program' }] },
  { id: 'AL-3301', patientId: 'P-0041', level: 'Nurse follow-up', status: 'Resolved', source: 'Post-treatment survey +3 d', summary: 'Pain +3 after laser', rule: 'AR-03', createdAt: 'Oct 2, 2026 · 8:20 AM', dueBy: 'Oct 3 · 8:20 AM', assignee: 'Nursing · Jen', physician: 'Dr. D.', history: [
    { actor: 'Rules engine', when: 'Oct 2, 2026 · 8:20 AM', action: 'Alert created · Nurse follow-up', reason: 'AR-03 · applied layer: Modality' },
    { actor: 'Jen (nursing)', when: 'Oct 2, 2026 · 10:05 AM', action: 'Acknowledged · called patient' },
    { actor: 'Jen (nursing)', when: 'Oct 2, 2026 · 10:40 AM', action: 'Resolved', reason: 'RES-02 · Expected response, patient reassured · note copied to eCW' },
  ] },
  { id: 'AL-3297', patientId: 'P-0044', level: 'Routine review', status: 'Reopened', source: 'Weekly core check-in', summary: 'Sleep quality dropped from 7 → 3', rule: 'AR-04', createdAt: 'Sep 30, 2026 · 9:00 AM', dueBy: 'Oct 9 · 9:00 AM', assignee: 'Nursing · Marco', physician: 'Dr. D.', history: [
    { actor: 'Marco (nursing)', when: 'Oct 1, 2026 · 2:00 PM', action: 'Resolved', reason: 'RES-01 · Advised sleep hygiene' },
    { actor: 'Dr. D.', when: 'Oct 7, 2026 · 4:30 PM', action: 'Reopened', reason: 'Pattern persists · review at next visit' },
  ] },
]
export const levelTone: Record<AlertLevel, 'neutral' | 'info' | 'warn' | 'bad' | 'plum'> = { Informational: 'neutral', 'Routine review': 'info', 'Nurse follow-up': 'warn', 'Urgent clinical review': 'bad', 'Emergency instruction': 'plum' }

/* ---------------- Longitudinal scores ---------------- */
export const scoreSeries: Record<string, { date: string; energy: number; pain: number; sleep: number; event?: string }[]> = {
  'P-0041': [
    { date: 'Sep 8', energy: 3, pain: 7, sleep: 4, event: 'Baseline' }, { date: 'Sep 15', energy: 4, pain: 6, sleep: 5 }, { date: 'Sep 22', energy: 4, pain: 6, sleep: 5, event: 'Laser #1' },
    { date: 'Sep 29', energy: 5, pain: 5, sleep: 6 }, { date: 'Oct 2', energy: 4, pain: 8, sleep: 5, event: 'Alert AL-3301' }, { date: 'Oct 5', energy: 5, pain: 5, sleep: 6 }, { date: 'Oct 8', energy: 2, pain: 6, sleep: 3, event: 'Crash AL-3312' },
  ],
  'P-0044': [
    { date: 'Sep 15', energy: 4, pain: 5, sleep: 7, event: 'Baseline' }, { date: 'Sep 22', energy: 5, pain: 4, sleep: 6 }, { date: 'Sep 29', energy: 5, pain: 4, sleep: 3, event: 'AL-3297' }, { date: 'Oct 6', energy: 6, pain: 3, sleep: 4 }, { date: 'Oct 8', energy: 6, pain: 3, sleep: 5, event: 'Red light #2' },
  ],
}

/* ---------------- Registry (§12) ---------------- */
export interface Member { id: string; status: RegistryStatus; month0Start?: string; month0End?: string; membershipStart?: string; nineMonthEnd?: string; pauses: { from: string; to: string; reason: string }[]; month9Review?: string; activeMonths: number; monthlyAmount: number; lastChange: AuditEntry; history: AuditEntry[] }
export const members: Member[] = [
  { id: 'P-0031', status: 'Active member', month0Start: 'May 5, 2026', month0End: 'Jun 2, 2026', membershipStart: 'Jun 10, 2026', nineMonthEnd: 'Mar 10, 2027', pauses: [], activeMonths: 4, monthlyAmount: 2000, lastChange: { actor: 'System', when: 'Oct 10, 2026', action: 'Anniversary payment · $2,000 · paid' }, history: [
    { actor: 'Karina', when: 'Jun 10, 2026', action: 'Status → Active member', reason: 'Agreement signed · ACH authorized' }, { actor: 'Karina', when: 'Jun 3, 2026', action: 'Status → Program offered', reason: 'Plan of Care reviewed with patient' }, { actor: 'Dr. D.', when: 'Jun 2, 2026', action: 'Status → Plan of Care completed' },
  ] },
  { id: 'P-0028', status: 'Temporarily paused', month0Start: 'Apr 1, 2026', month0End: 'Apr 29, 2026', membershipStart: 'May 6, 2026', nineMonthEnd: 'Feb 6, 2027 (+ pause)', pauses: [{ from: 'Sep 15, 2026', to: 'Oct 15, 2026', reason: 'PAU-01 · Travel' }], activeMonths: 4, monthlyAmount: 2000, lastChange: { actor: 'Karina', when: 'Sep 12, 2026', action: 'Status → Temporarily paused', reason: 'PAU-01 · Travel · payments and surveys paused' }, history: [{ actor: 'Karina', when: 'Sep 12, 2026', action: 'Status → Temporarily paused', reason: 'PAU-01 · Travel' }] },
  { id: 'P-0019', status: 'Month 9 review', month0Start: 'Dec 2, 2025', month0End: 'Dec 30, 2025', membershipStart: 'Jan 8, 2026', nineMonthEnd: 'Oct 8, 2026', pauses: [], month9Review: 'Oct 9, 2026 · Dr. D.', activeMonths: 9, monthlyAmount: 2000, lastChange: { actor: 'System', when: 'Sep 24, 2026', action: 'Status → Month 9 review', reason: 'Physician review task created · 14 days before term end' }, history: [{ actor: 'System', when: 'Sep 24, 2026', action: 'Status → Month 9 review' }] },
  { id: 'P-0041', status: 'Month 0 in progress', month0Start: 'Sep 16, 2026', pauses: [], activeMonths: 0, monthlyAmount: 0, lastChange: { actor: 'Karina', when: 'Sep 16, 2026', action: 'Status → Month 0 in progress', reason: 'Assessment visit completed · testing ordered' }, history: [] },
  { id: 'P-0044', status: 'Month 0 scheduled', month0Start: 'Oct 14, 2026', pauses: [], activeMonths: 0, monthlyAmount: 0, lastChange: { actor: 'Karina', when: 'Oct 2, 2026', action: 'Status → Month 0 scheduled', reason: 'Month 0 fee paid · assessment Oct 14' }, history: [] },
  { id: 'P-0043', status: 'Accepted for Month 0', pauses: [], activeMonths: 0, monthlyAmount: 0, lastChange: { actor: 'Ana (advisor)', when: 'Sep 26, 2026', action: 'Status → Accepted for Month 0', reason: 'ADM-01' }, history: [] },
  { id: 'P-0039', status: 'Month 0 in progress', month0Start: 'Sep 23, 2026', pauses: [], activeMonths: 0, monthlyAmount: 0, lastChange: { actor: 'Karina', when: 'Sep 23, 2026', action: 'Status → Month 0 in progress' }, history: [] },
  { id: 'P-0036', status: 'Contract pending', month0Start: 'Jul 7, 2026', month0End: 'Aug 4, 2026', pauses: [], activeMonths: 0, monthlyAmount: 2000, lastChange: { actor: 'System', when: 'Oct 6, 2026', action: 'Reminder 2 of 3 sent', reason: 'Agreement assigned Sep 30 · not yet signed' }, history: [] },
  { id: 'P-0034', status: 'Payment pending', month0Start: 'Jun 16, 2026', month0End: 'Jul 14, 2026', pauses: [], activeMonths: 0, monthlyAmount: 2000, lastChange: { actor: 'Patient', when: 'Oct 7, 2026', action: 'Agreement signed', reason: 'Payment method not yet added' }, history: [] },
  { id: 'P-0022', status: 'Graduated', month0Start: 'Jan 6, 2026', month0End: 'Feb 3, 2026', membershipStart: 'Feb 10, 2026', nineMonthEnd: 'Nov 10, 2026', pauses: [], month9Review: 'Sep 30, 2026', activeMonths: 8, monthlyAmount: 0, lastChange: { actor: 'Dr. D.', when: 'Sep 30, 2026', action: 'Status → Graduated', reason: 'GRA-01 · Goals reached early · recurring plan closed' }, history: [] },
  { id: 'P-0017', status: 'Withdrawn', month0Start: 'Nov 4, 2025', month0End: 'Dec 2, 2025', membershipStart: 'Dec 9, 2025', pauses: [], activeMonths: 3, monthlyAmount: 0, lastChange: { actor: 'Karina', when: 'Mar 12, 2026', action: 'Status → Withdrawn', reason: 'WDR-02 · Relocation · final invoice settled' }, history: [] },
  { id: 'P-0046', status: 'Advisor interview completed', pauses: [], activeMonths: 0, monthlyAmount: 0, lastChange: { actor: 'Ana (advisor)', when: 'Oct 6, 2026', action: 'Status → Advisor interview completed' }, history: [] },
]
export const statusCatalog: { status: RegistryStatus; phase: string; action: string }[] = [
  { status: 'Inquiry received', phase: 'Pre-enrollment', action: 'Create owner and outreach task' }, { status: 'Advisor outreach', phase: 'Pre-enrollment', action: 'Track attempts' }, { status: 'Advisor interview completed', phase: 'Pre-enrollment', action: 'Open insurance and admissions work' },
  { status: 'Insurance benefits review', phase: 'Pre-enrollment', action: 'Record review summary' }, { status: 'Admissions review', phase: 'Pre-enrollment', action: 'Allow recorded decision' }, { status: 'Accepted for Month 0', phase: 'Month 0', action: 'Enable Month 0 payment, intake, scheduling' },
  { status: 'Denied', phase: 'Closed', action: 'Record reason and alternate pathway' }, { status: 'Patient fell off', phase: 'Closed', action: 'Stop reminders · keep history' }, { status: 'Month 0 scheduled', phase: 'Month 0', action: 'Track intake and documents' },
  { status: 'Month 0 in progress', phase: 'Month 0', action: 'Track Plan of Care milestone' }, { status: 'Plan of Care completed', phase: 'Month 0', action: 'Allow program offer decision' }, { status: 'Program offered', phase: 'Decision', action: 'Enable contract and payment package' },
  { status: 'Program not offered', phase: 'Closed', action: 'Record reason and alternate care path' }, { status: 'Patient declined', phase: 'Closed', action: 'Record reason and follow-up permission' }, { status: 'Contract pending', phase: 'Enrollment', action: 'Run configurable reminders' },
  { status: 'Payment pending', phase: 'Enrollment', action: 'Run financial follow-up' }, { status: 'Active member', phase: 'Membership', action: 'Enable scheduling and surveys' }, { status: 'Temporarily paused', phase: 'Membership', action: 'Apply pause effects' },
  { status: 'Month 9 review', phase: 'Membership', action: 'Create physician review task' }, { status: 'Continued active care', phase: 'After Month 9', action: 'Continue recurring payment' }, { status: 'Maintenance', phase: 'After Month 9', action: 'Apply maintenance rules' },
  { status: 'Graduated', phase: 'After Month 9', action: 'Close recurring plan' }, { status: 'Withdrawn', phase: 'Closed', action: 'Approved financial workflow' }, { status: 'Discharged', phase: 'Closed', action: 'Approved documentation workflow' },
]

/* ---------------- Bookings (§10) ---------------- */
export interface Booking { id: string; patientId: string; modality: string; resource: string; date: string; start: string; end: string; status: 'Reserved' | 'Confirmed' | 'Requested' | 'Exception' | 'Completed' | 'Cancelled'; ecw: 'Synced' | 'Waiting for confirmation' | 'Conflict' | 'Mirror failed' | 'Read-only from eCW' | '—'; source: 'Patient' | 'Staff' | 'eCW' }
export const bookings: Booking[] = [
  { id: 'BK-8841', patientId: 'P-0031', modality: 'Oxygen & hydrogen nano bath', resource: 'Nano bath room 1', date: 'Oct 9', start: '9:00', end: '9:45', status: 'Confirmed', ecw: 'Synced', source: 'Patient' },
  { id: 'BK-8842', patientId: 'P-0041', modality: 'Oxygen & hydrogen nano bath', resource: 'Nano bath room 2', date: 'Oct 9', start: '10:00', end: '10:45', status: 'Exception', ecw: 'Conflict', source: 'Patient' },
  { id: 'BK-8845', patientId: 'P-0031', modality: 'Red light therapy', resource: 'Red light bed 1', date: 'Oct 9', start: '11:00', end: '11:30', status: 'Reserved', ecw: 'Waiting for confirmation', source: 'Patient' },
  { id: 'BK-8846', patientId: 'P-0028', modality: 'Salt room', resource: 'Salt room (4 seats)', date: 'Oct 9', start: '13:00', end: '13:45', status: 'Confirmed', ecw: 'Synced', source: 'Staff' },
  { id: 'BK-8847', patientId: 'P-0019', modality: 'Erchonia laser', resource: 'Erchonia unit', date: 'Oct 9', start: '14:00', end: '14:30', status: 'Requested', ecw: '—', source: 'Patient' },
  { id: 'BK-8848', patientId: 'P-0044', modality: 'BEMER', resource: 'BEMER mat 1', date: 'Oct 9', start: '15:00', end: '15:20', status: 'Exception', ecw: 'Mirror failed', source: 'Patient' },
  { id: 'ECW-20991', patientId: 'P-0031', modality: 'NP visit (insurance)', resource: 'NP · Exam 2', date: 'Oct 9', start: '8:00', end: '8:40', status: 'Confirmed', ecw: 'Read-only from eCW', source: 'eCW' },
  { id: 'ECW-21004', patientId: 'P-0019', modality: 'IV therapy (insurance)', resource: 'IV suite', date: 'Oct 9', start: '12:00', end: '13:00', status: 'Confirmed', ecw: 'Read-only from eCW', source: 'eCW' },
]

/* ---------------- Payments (§11) ---------------- */
export interface Payment { id: string; patientId: string; amount: number; type: 'Membership · month' | 'Month 0 assessment'; period: string; date: string; status: 'Paid' | 'Failed' | 'Retry scheduled' | 'Hold proposed' | 'Refunded' | 'Scheduled'; method: string; attempt: number; reason?: string; nextAction?: string; comms: AuditEntry[] }
export const payments: Payment[] = [
  { id: 'PAY-7301', patientId: 'P-0034', amount: 2000, type: 'Membership · month', period: 'Month 1', date: 'Oct 7, 2026', status: 'Failed', method: 'ACH •••• 4411', attempt: 1, reason: 'Insufficient funds (R01)', nextAction: 'Retry Oct 10 (day 3) · patient notified', comms: [{ actor: 'System', when: 'Oct 7, 2026 · 6:05 AM', action: 'Failed-payment notice · email + text', reason: 'Template "Payment failed · v1"' }] },
  { id: 'PAY-7288', patientId: 'P-0028', amount: 2000, type: 'Membership · month', period: 'Month 5', date: 'Oct 6, 2026', status: 'Hold proposed', method: 'Card •••• 2210', attempt: 3, reason: 'Card declined · do not honor', nextAction: 'Karina to confirm scheduling hold (day 5 reached)', comms: [
    { actor: 'System', when: 'Oct 1, 2026', action: 'Failed-payment notice · email + text' }, { actor: 'System', when: 'Oct 4, 2026', action: 'Retry 1 failed · notice sent' }, { actor: 'System', when: 'Oct 6, 2026', action: 'Retry 2 failed · hold eligible · task for Karina' }, { actor: 'Karina', when: 'Oct 6, 2026 · 3:10 PM', action: 'Called patient · voicemail' },
  ] },
  { id: 'PAY-7290', patientId: 'P-0031', amount: 2000, type: 'Membership · month', period: 'Month 4', date: 'Oct 10, 2026', status: 'Scheduled', method: 'ACH •••• 9087', attempt: 0, nextAction: 'Courtesy reminder sent Oct 7', comms: [{ actor: 'System', when: 'Oct 7, 2026', action: 'Upcoming charge reminder · email' }] },
  { id: 'PAY-7276', patientId: 'P-0019', amount: 2000, type: 'Membership · month', period: 'Month 9', date: 'Oct 8, 2026', status: 'Paid', method: 'Card •••• 5520', attempt: 1, comms: [{ actor: 'System', when: 'Oct 8, 2026', action: 'Receipt sent · email' }] },
  { id: 'PAY-7270', patientId: 'P-0044', amount: 1500, type: 'Month 0 assessment', period: 'One-time', date: 'Oct 2, 2026', status: 'Paid', method: 'Card •••• 7733', attempt: 1, comms: [{ actor: 'System', when: 'Oct 2, 2026', action: 'Receipt sent · email' }] },
  { id: 'PAY-7244', patientId: 'P-0022', amount: 2000, type: 'Membership · month', period: 'Month 9 (unused)', date: 'Sep 30, 2026', status: 'Refunded', method: 'ACH •••• 1180', attempt: 1, reason: 'Graduated early · approved by Cassandra', comms: [{ actor: 'Karina', when: 'Oct 1, 2026', action: 'Refund issued · $2,000', reason: 'REF-01 · Graduation · approval Cassandra' }] },
  { id: 'PAY-7201', patientId: 'P-0031', amount: 2000, type: 'Membership · month', period: 'Month 3', date: 'Sep 10, 2026', status: 'Paid', method: 'ACH •••• 9087', attempt: 1, comms: [] },
]

/* ---------------- Message templates (§13) ---------------- */
export interface MessageTemplate { id: string; name: string; event: string; audience: string; channel: string; timing: string; stopRule: string; version: number; state: ContentState; subject: string; body: string; maxSends: number }
export const messageTemplates: MessageTemplate[] = [
  { id: 'MSG-01', name: 'Invitation', event: 'Invitation sent', audience: 'Patient', channel: 'Email + SMS', timing: 'Immediate', stopRule: 'Intake started', version: 2, state: 'Published', subject: 'Your Helixona intake is ready', body: 'Hi {{first_name}}, your Helixona intake is ready. Open your secure link: {{secure_link}}. It expires in {{expiry_days}} days.', maxSends: 1 },
  { id: 'MSG-02', name: 'Intake reminder', event: 'Intake incomplete', audience: 'Patient', channel: 'SMS', timing: 'Day 3, day 7 after invitation · 9:00–18:00', stopRule: 'Intake submitted · invitation expired · max sends', version: 1, state: 'Published', subject: '—', body: 'Helixona: a friendly reminder to finish your intake. {{secure_link}} Reply STOP to opt out.', maxSends: 2 },
  { id: 'MSG-03', name: 'Payment failed', event: 'Payment failed', audience: 'Patient', channel: 'Email + SMS', timing: 'Immediate', stopRule: 'Payment succeeds', version: 1, state: 'Published', subject: 'Action needed on your Helixona membership payment', body: 'Hi {{first_name}}, a payment for your membership did not go through. Update your payment method here: {{payment_link}}. No clinical care is affected.', maxSends: 3 },
  { id: 'MSG-04', name: 'Survey assignment', event: 'Survey assigned', audience: 'Patient', channel: 'SMS', timing: 'Treatment + {{offset_days}} days · 9:00', stopRule: 'Survey submitted · sequence ended', version: 3, state: 'Published', subject: '—', body: 'Helixona: how are you feeling after your session? 2-minute check-in: {{survey_link}}', maxSends: 1 },
  { id: 'MSG-05', name: 'Staff alert', event: 'Alert created', audience: 'Nursing · physician', channel: 'SMS + in-app task', timing: 'Immediate · after-hours per rule', stopRule: 'Alert acknowledged', version: 2, state: 'Published', subject: '—', body: 'Helixona: new {{alert_level}} alert for patient {{patient_id}}. Open the queue: {{queue_link}}', maxSends: 1 },
  { id: 'MSG-06', name: 'Contract ready', event: 'Status → Program offered', audience: 'Patient', channel: 'Email', timing: 'Immediate', stopRule: 'Agreement signed', version: 1, state: 'Published', subject: 'Your Helixona membership agreement', body: 'Hi {{first_name}}, your care plan has been reviewed and the nine-month program is available to you. Review and sign: {{agreement_link}}', maxSends: 1 },
  { id: 'MSG-07', name: 'Month 9 review', event: 'Status → Month 9 review', audience: 'Patient · physician', channel: 'Email + in-app task', timing: '14 days before term end', stopRule: 'Decision recorded', version: 1, state: 'In review', subject: 'Planning your next step with Helixona', body: 'Hi {{first_name}}, you are approaching the end of your nine-month program. Dr. {{physician}} would like to review next steps with you.', maxSends: 1 },
  { id: 'MSG-08', name: 'Warm outreach', event: 'No contact 14 days', audience: 'Patient', channel: 'SMS', timing: 'Day 14 · 10:00', stopRule: 'Any patient activity', version: 1, state: 'Draft', subject: '—', body: 'Hi {{first_name}}, we haven\'t heard from you in a while. Reply here or call us at (949) 555-0100 anytime.', maxSends: 1 },
]
export interface DeliveryLog { id: string; when: string; template: string; audience: string; channel: string; result: 'Delivered' | 'Opened' | 'Failed' | 'Opted out' | 'Queued'; detail: string }
export const deliveryLog: DeliveryLog[] = [
  { id: 'DL-99120', when: 'Oct 8, 2026 · 7:42 AM', template: 'Staff alert v2', audience: 'Dr. D.', channel: 'SMS', result: 'Delivered', detail: 'Alert AL-3312 · no patient details in body' },
  { id: 'DL-99118', when: 'Oct 8, 2026 · 6:55 AM', template: 'Staff alert v2', audience: 'Nursing (Jen)', channel: 'In-app task', result: 'Opened', detail: 'Alert AL-3311' },
  { id: 'DL-99102', when: 'Oct 7, 2026 · 9:00 AM', template: 'Survey assignment v3', audience: 'P-0044', channel: 'SMS', result: 'Delivered', detail: 'Red light +1 d' },
  { id: 'DL-99097', when: 'Oct 7, 2026 · 6:05 AM', template: 'Payment failed v1', audience: 'P-0034', channel: 'Email + SMS', result: 'Delivered', detail: 'PAY-7301' },
  { id: 'DL-99081', when: 'Oct 6, 2026 · 9:00 AM', template: 'Intake reminder v1', audience: 'P-0045', channel: 'SMS', result: 'Failed', detail: 'Carrier error · retried 10:00 · delivered' },
  { id: 'DL-99060', when: 'Oct 4, 2026 · 9:00 AM', template: 'Survey assignment v3', audience: 'P-0041', channel: 'SMS', result: 'Opted out', detail: 'Patient replied STOP · advisor task created' },
  { id: 'DL-99055', when: 'Oct 3, 2026 · 9:00 AM', template: 'Contract ready v1', audience: 'P-0036', channel: 'Email', result: 'Opened', detail: 'Reminder 1 scheduled Oct 6' },
]
