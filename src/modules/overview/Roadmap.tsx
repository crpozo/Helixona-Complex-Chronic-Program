import { useLocation } from 'react-router-dom'
import { Notice, PageHeader } from '../../components/ui'

const copy: Record<string, { title: string; eyebrow: string; items: string[]; phase: number }> = {
  '/staff/registry': { title: 'Membership registry', eyebrow: 'Registry · Operations (Karina)', phase: 2, items: ['List with current status, status history, reason codes, and total active months', 'Patient detail: Month 0 dates, membership start, pauses, Month 9 review', 'Lifecycle rules configured in admin, not code'] },
  '/staff/alerts': { title: 'Alert queue', eyebrow: 'Surveys & alerts · Nursing / care team', phase: 2, items: ['Unassigned · assigned · acknowledged · overdue · escalated · resolved · reopened', 'Level pills: informational → emergency instruction (labels configurable)', 'Patient longitudinal view with scores over time'] },
  '/staff/clinical-config': { title: 'Clinical configuration', eyebrow: 'Configuration · Physician / Medical Director', phase: 2, items: ['Survey template builder with question bank, scoring, branching, versions', 'Modality configuration (Plan of Care, scheduling, preparation, follow-up offsets)', 'Alert rule editor and precedence view: global → program → stage → modality → physician → patient'] },
  '/staff/calendar': { title: 'Resource calendar', eyebrow: 'Booking · Operations', phase: 3, items: ['One lane per room or device (nano bath rooms, salt room, lasers…)', 'Booking exceptions: eCW slot conflict, mirror failed', 'Insurance visits read-only from eCW'] },
  '/staff/payments': { title: 'Payments', eyebrow: 'Payments · Operations (Karina)', phase: 3, items: ['Failed-payment queue: amount, attempt, reason category, next action, communication history', 'Holds requiring human approval — never automatic discharge', 'Receipts and payment schedule'] },
  '/staff/dashboards': { title: 'Dashboards', eyebrow: 'System · Program admin', phase: 3, items: ['Intake completion, chart prep, alerts, booking exceptions', 'Contract completion, payment failures, active members, Month 9 reviews', 'Pilot defects'] },
}

export default function Roadmap() {
  const { pathname } = useLocation()
  const c = copy[pathname] ?? { title: 'Coming next', eyebrow: 'Roadmap', phase: 2, items: [] }
  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} description={`Priority ${c.phase} screen. Mocked after the Priority 1 intake module is reviewed.`} />
      <Notice tone="plum" title={`Planned for Priority ${c.phase}`}>
        <ul className="mt-1 list-disc pl-5 space-y-0.5">{c.items.map((i) => <li key={i}>{i}</li>)}</ul>
      </Notice>
    </>
  )
}
