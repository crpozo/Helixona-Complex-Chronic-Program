import type { Patient, UploadItem, FormItem } from './types'
import { consents } from './consentContent'

const standardForms = (signedCount: number): FormItem[] =>
  consents.map((c, i) => ({
    key: c.key,
    title: c.title,
    version: c.version,
    signer: 'Patient',
    status: i < signedCount ? 'signed' : i === signedCount ? 'viewed' : 'pending',
    signedAt: i < signedCount ? `Sep ${28 + Math.min(i, 2)}, 2026 · ${9 + (i % 3)}:${String((12 + i * 7) % 60).padStart(2, "0")} AM` : undefined,
    method: i < signedCount ? (i % 2 === 0 ? 'Drawn' : 'Typed') : undefined,
  }))

const uploads = (overrides: Partial<Record<string, Partial<UploadItem>>> = {}): UploadItem[] => {
  const base: UploadItem[] = [
    { key: 'ins-front', label: 'Insurance card — front', required: true, status: 'uploaded', files: [{ name: 'insurance-front.jpg', size: '1.2 MB', uploadedAt: 'Sep 28, 2026' }] },
    { key: 'ins-back', label: 'Insurance card — back', required: true, status: 'uploaded', files: [{ name: 'insurance-back.jpg', size: '1.1 MB', uploadedAt: 'Sep 28, 2026' }] },
    { key: 'photo-id', label: 'Photo ID', required: true, status: 'uploaded', files: [{ name: 'drivers-license.jpg', size: '0.9 MB', uploadedAt: 'Sep 28, 2026' }] },
    { key: 'meds', label: 'Medication & supplement list', required: true, status: 'uploaded', files: [{ name: 'medications-sept-2026.pdf', size: '140 KB', uploadedAt: 'Sep 29, 2026' }] },
    { key: 'labs', label: 'Recent lab reports', required: true, status: 'uploaded', files: [{ name: 'quest-labs-aug-2026.pdf', size: '2.3 MB', uploadedAt: 'Sep 29, 2026' }, { name: 'thyroid-panel-jun-2026.pdf', size: '480 KB', uploadedAt: 'Sep 29, 2026' }] },
    { key: 'imaging', label: 'Imaging reports', required: false, status: 'optional', files: [] },
    { key: 'records', label: 'Medical records from other providers', required: false, status: 'uploaded', files: [{ name: 'rheumatology-summary.pdf', size: '610 KB', uploadedAt: 'Sep 30, 2026' }] },
    { key: 'plans', label: 'Prior diagnoses & treatment plans', required: false, status: 'optional', files: [] },
    { key: 'referral', label: 'Referral documents', required: false, status: 'optional', files: [] },
    { key: 'directive', label: 'Advance directive / representative (optional)', required: false, status: 'optional', files: [] },
  ]
  return base.map((u) => ({ ...u, ...(overrides[u.key] ?? {}) }))
}

export const patients: Patient[] = [
  {
    id: 'P-0043', ecwId: 'ECW-118204', firstName: 'Marisol', lastName: 'Andrade', dob: '03/14/1971', phone: '(949) 555-0142', email: 'm.andrade@example.com', city: 'Irvine, CA', advisor: 'Ana',
    status: 'Accepted for Month 0', chartPrep: 'Submitted',
    invitation: { state: 'submitted', sentAt: 'Sep 26, 2026 · 2:10 PM', expiresAt: 'Oct 10, 2026', method: 'Magic link', history: [
      { actor: 'System', when: 'Sep 26, 2026 · 2:10 PM', action: 'Invitation sent', reason: 'Email + SMS' },
      { actor: 'System', when: 'Sep 26, 2026 · 2:11 PM', action: 'Delivered' },
      { actor: 'Patient', when: 'Sep 27, 2026 · 8:42 AM', action: 'Opened' },
      { actor: 'Patient', when: 'Sep 27, 2026 · 8:45 AM', action: 'Started questionnaire' },
      { actor: 'Patient', when: 'Sep 30, 2026 · 7:18 PM', action: 'Submitted intake' },
    ] },
    intake: { version: 1, progress: 100, submittedAt: 'Sep 30, 2026 · 7:18 PM', sections: { 'New Patient Packet': 'complete', 'SF-36 · Quality of Life': 'complete', 'Metabolic Assessment': 'complete', 'Mold History': 'complete', 'Lyme Disease': 'complete', 'Brain Region Localization': 'complete' } },
    uploads: uploads({ labs: { status: 'returned', note: 'Lab PDF is missing pages 3–4 (lipid panel). Please re-upload the full report.' } }),
    forms: standardForms(9),
    history: [
      { actor: 'Ana (advisor)', when: 'Sep 22, 2026 · 10:05 AM', action: 'Status → Advisor interview completed', reason: 'Qualified · Complex Chronic pathway' },
      { actor: 'Karina', when: 'Sep 24, 2026 · 3:30 PM', action: 'Status → Insurance benefits review', reason: 'PPO verified · out-of-network benefits apply to NP visits' },
      { actor: 'Ana (advisor)', when: 'Sep 26, 2026 · 1:58 PM', action: 'Status → Accepted for Month 0', reason: 'ADM-01 · Meets program criteria' },
      { actor: 'Patient', when: 'Sep 30, 2026 · 7:18 PM', action: 'Intake submitted (Questionnaire v1)' },
      { actor: 'Ana (advisor)', when: 'Oct 1, 2026 · 9:02 AM', action: 'Returned item to patient', reason: 'Lab report incomplete' },
    ],
  },
  {
    id: 'P-0044', ecwId: 'ECW-118391', firstName: 'Devon', lastName: 'Okafor', dob: '11/02/1965', phone: '(714) 555-0199', email: 'devon.okafor@example.com', city: 'Tustin, CA', advisor: 'Ana',
    status: 'Month 0 scheduled', chartPrep: 'Ready for chart prep',
    invitation: { state: 'submitted', sentAt: 'Sep 19, 2026 · 11:20 AM', expiresAt: 'Oct 3, 2026', method: 'Code', history: [
      { actor: 'System', when: 'Sep 19, 2026 · 11:20 AM', action: 'Invitation sent', reason: 'Email + SMS' },
      { actor: 'Patient', when: 'Sep 19, 2026 · 6:02 PM', action: 'Opened' },
      { actor: 'Patient', when: 'Sep 25, 2026 · 9:40 PM', action: 'Submitted intake' },
    ] },
    intake: { version: 1, progress: 100, submittedAt: 'Sep 25, 2026 · 9:40 PM', sections: { 'New Patient Packet': 'complete', 'SF-36 · Quality of Life': 'complete', 'Metabolic Assessment': 'complete', 'Mold History': 'complete', 'Lyme Disease': 'complete', 'Brain Region Localization': 'complete' } },
    uploads: uploads(),
    forms: standardForms(10),
    history: [
      { actor: 'Ana (advisor)', when: 'Sep 18, 2026 · 2:12 PM', action: 'Status → Accepted for Month 0', reason: 'ADM-01 · Meets program criteria' },
      { actor: 'Patient', when: 'Sep 25, 2026 · 9:40 PM', action: 'Intake submitted (Questionnaire v1)' },
      { actor: 'Ana (advisor)', when: 'Sep 29, 2026 · 8:50 AM', action: 'Status → Reviewed for completeness', reason: 'All required items present' },
      { actor: 'Ana (advisor)', when: 'Sep 29, 2026 · 8:52 AM', action: 'Marked ready for chart prep' },
      { actor: 'Karina', when: 'Oct 2, 2026 · 4:15 PM', action: 'Status → Month 0 scheduled', reason: 'Assessment Oct 14, 2026 · Month 0 payment received' },
    ],
  },
  {
    id: 'P-0041', ecwId: 'ECW-117902', firstName: 'Priya', lastName: 'Raman', dob: '07/29/1983', phone: '(949) 555-0117', email: 'priya.raman@example.com', city: 'Newport Beach, CA', advisor: 'Ana',
    status: 'Month 0 in progress', chartPrep: 'Placed in eCW',
    invitation: { state: 'submitted', sentAt: 'Sep 8, 2026 · 9:00 AM', expiresAt: 'Sep 22, 2026', method: 'Magic link', history: [] },
    intake: { version: 1, progress: 100, submittedAt: 'Sep 12, 2026 · 3:05 PM', sections: {} },
    uploads: uploads(),
    forms: standardForms(10),
    history: [
      { actor: 'eCW connector', when: 'Sep 16, 2026 · 6:04 AM', action: 'Note + PDF placed in eCW · verified', reason: 'Marker HLX:INT-2041:v2' },
      { actor: 'Charlene', when: 'Sep 16, 2026 · 8:30 AM', action: 'Chart prep reviewed · closed' },
    ],
  },
  {
    id: 'P-0045', ecwId: '—', firstName: 'Thomas', lastName: 'Whitfield', dob: '01/19/1958', phone: '(949) 555-0163', email: 't.whitfield@example.com', city: 'Laguna Hills, CA', advisor: 'Ana',
    status: 'Accepted for Month 0', chartPrep: 'Awaiting intake',
    invitation: { state: 'started', sentAt: 'Oct 1, 2026 · 10:30 AM', expiresAt: 'Oct 15, 2026', method: 'Magic link', history: [
      { actor: 'System', when: 'Oct 1, 2026 · 10:30 AM', action: 'Invitation sent', reason: 'Email only · patient declined SMS' },
      { actor: 'System', when: 'Oct 1, 2026 · 10:31 AM', action: 'Delivered' },
      { actor: 'Patient', when: 'Oct 3, 2026 · 7:15 PM', action: 'Opened' },
      { actor: 'Patient', when: 'Oct 3, 2026 · 7:20 PM', action: 'Started questionnaire' },
    ] },
    intake: { version: 1, progress: 38, sections: { 'New Patient Packet': 'partial', 'SF-36 · Quality of Life': 'not started', 'Metabolic Assessment': 'not started', 'Mold History': 'not started', 'Lyme Disease': 'not started', 'Brain Region Localization': 'not started' } },
    uploads: uploads({ 'ins-front': { status: 'missing', files: [] }, 'ins-back': { status: 'missing', files: [] }, 'photo-id': { status: 'missing', files: [] }, meds: { status: 'missing', files: [] }, labs: { status: 'missing', files: [] }, records: { status: 'optional', files: [] } }),
    forms: standardForms(0),
    history: [
      { actor: 'Ana (advisor)', when: 'Oct 1, 2026 · 10:28 AM', action: 'Status → Accepted for Month 0', reason: 'ADM-01 · Meets program criteria' },
      { actor: 'Ana (advisor)', when: 'Oct 1, 2026 · 10:30 AM', action: 'Patient record created · invitation sent' },
    ],
  },
  {
    id: 'P-0039', ecwId: 'ECW-117455', firstName: 'Lena', lastName: 'Kowalski', dob: '05/06/1979', phone: '(657) 555-0121', email: 'lena.k@example.com', city: 'Costa Mesa, CA', advisor: 'Ana',
    status: 'Month 0 in progress', chartPrep: 'Exception',
    invitation: { state: 'submitted', sentAt: 'Sep 2, 2026 · 1:00 PM', expiresAt: 'Sep 16, 2026', method: 'Code', history: [] },
    intake: { version: 1, progress: 100, submittedAt: 'Sep 9, 2026 · 11:12 AM', sections: {} },
    uploads: uploads(),
    forms: standardForms(10),
    history: [
      { actor: 'eCW connector', when: 'Oct 5, 2026 · 6:02 AM', action: 'Exception · PDF read-back failed', reason: 'Document not found after upload · no automatic retry' },
    ],
  },
  {
    id: 'P-0046', ecwId: '—', firstName: 'Robert', lastName: 'Nguyen', dob: '09/23/1962', phone: '(949) 555-0188', email: 'r.nguyen@example.com', city: 'Irvine, CA', advisor: 'Ana',
    status: 'Advisor interview completed', chartPrep: 'Awaiting intake',
    uploads: uploads({ 'ins-front': { status: 'missing', files: [] }, 'ins-back': { status: 'missing', files: [] }, 'photo-id': { status: 'missing', files: [] }, meds: { status: 'missing', files: [] }, labs: { status: 'missing', files: [] }, records: { status: 'optional', files: [] } }),
    forms: standardForms(0),
    history: [
      { actor: 'Ana (advisor)', when: 'Oct 6, 2026 · 11:40 AM', action: 'Status → Advisor interview completed', reason: 'Qualified · pending insurance review' },
    ],
  },
]

export const patientById = (id: string) => patients.find((p) => p.id === id)
export const currentPatient = patients[0] // Marisol — used for the patient-facing demo
