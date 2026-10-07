export type Role = 'patient' | 'advisor' | 'karina' | 'charlene' | 'nursing' | 'physician' | 'admin'

export interface AuditEntry {
  actor: string
  when: string
  action: string
  reason?: string
}

export type InvitationState = 'sent' | 'delivered' | 'opened' | 'started' | 'submitted' | 'expired' | 'reissued'

export type RegistryStatus =
  | 'Inquiry received' | 'Advisor outreach' | 'Advisor interview completed' | 'Insurance benefits review'
  | 'Admissions review' | 'Accepted for Month 0' | 'Denied' | 'Patient fell off' | 'Month 0 scheduled'
  | 'Month 0 in progress' | 'Plan of Care completed' | 'Program offered' | 'Program not offered'
  | 'Patient declined' | 'Contract pending' | 'Payment pending' | 'Active member' | 'Temporarily paused'
  | 'Month 9 review' | 'Continued active care' | 'Maintenance' | 'Graduated' | 'Withdrawn' | 'Discharged'

export type ChartPrepStatus =
  | 'Awaiting intake' | 'Submitted' | 'Reviewed for completeness' | 'Ready for chart prep' | 'Placed in eCW' | 'Exception'

export interface Patient {
  id: string            // internal ID, e.g. P-0043
  ecwId: string         // eCW chart number
  firstName: string
  lastName: string
  dob: string
  phone: string
  email: string
  city: string
  advisor: string
  status: RegistryStatus
  chartPrep: ChartPrepStatus
  invitation?: { state: InvitationState; sentAt: string; expiresAt: string; method: 'Magic link' | 'Code'; history: AuditEntry[] }
  intake?: { version: number; progress: number; sections: Record<string, 'complete' | 'partial' | 'not started'>; submittedAt?: string }
  uploads: UploadItem[]
  forms: FormItem[]
  history: AuditEntry[]
}

export interface UploadItem {
  key: string
  label: string
  required: boolean
  files: { name: string; size: string; uploadedAt: string }[]
  status: 'uploaded' | 'missing' | 'returned' | 'optional'
  note?: string
}

export interface FormItem {
  key: string
  title: string
  version: string
  signer: 'Patient' | 'Patient + staff countersign'
  status: 'signed' | 'pending' | 'viewed'
  signedAt?: string
  method?: 'Typed' | 'Drawn'
}

export interface Inquiry {
  id: string
  receivedAt: string
  pathway: 'Complex Chronic' | 'Insurance-covered NP care' | 'Self-directed care'
  source: string
  name: string
  city: string
  state: string
  reason: string
  status: RegistryStatus
  owner: string
  patientId?: string
  nextAction?: string
}

export interface EcwJob {
  id: string
  type: 'J2 · Intake note + PDF' | 'J3 · Booking mirror' | 'J4 · Schedule read-back'
  patientId: string
  queuedAt: string
  failedStep: string
  detail: string
  severity: 'critical' | 'warning'
  attempts: number
  status: 'open' | 'retrying' | 'closed'
}
