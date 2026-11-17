import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Camera, Check, CheckCircle2, ChevronDown, EyeOff, FileQuestion, Hourglass, RefreshCw, Send, UserMinus, XCircle } from 'lucide-react'
import { AuditList, Breadcrumb, Card, Field, Notice, Pill, Row, Tabs, ToConfirm, VersionTag, toneFor } from '../../../components/ui'
import { Actors, Roadmap } from '../../../components/Roadmap'
import { planFor, stageDates, stageLabel, stages } from '../../../mock/roadmap'
import { patientById } from '../../../mock/patients'
import { inquiries } from '../../../mock/inquiries'
import IntakeReviewPanel from './IntakeReviewPanel'
import CommunicationLog from './CommunicationLog'
import { ChartPrepPanel } from './ChartPrepDetail'
import { NoteRow, NotesPanel } from '../../../components/NotesPanel'
import { Avatar } from '../../../components/Avatar'
import { ScoresPanel } from '../../surveys/staff/PatientLongitudinal'
import { alerts, bookings, levelTone } from '../../../mock/program'
import { addedHistory, changeStatus, currentUser, latestNote, notesFor, notify, statusOf, useStore } from '../../../mock/store'

const admissionStatuses = ['Advisor outreach', 'Advisor interview completed', 'Insurance benefits review', 'Admissions review', 'Waitlist', 'Pending information', 'Accepted for Month 0', 'Month 0 scheduled', 'Month 0 in progress', 'Plan of Care completed', 'Denied', 'Patient fell off']

export default function PatientDetail() {
  useStore()
  const { id = '' } = useParams()
  const [sp, setSp] = useSearchParams()
  const p = patientById(id)
  const raw = sp.get('tab') ?? 'overview'
  const tab = raw === 'comms' ? 'notes' : raw
  const setTab = (t: string) => setSp({ tab: t })
  const [updating, setUpdating] = useState(false)
  if (!p) return <Notice tone="bad">Patient {id} not found in sample data.</Notice>
  const inquiry = inquiries.find((i) => i.patientId === p.id)
  const name = `${p.firstName} ${p.lastName}`
  const status = statusOf(p)
  const plan = planFor(p.id)
  const history = [...p.history, ...addedHistory(p.id)]
  const note = latestNote(p.id)
  const visits = bookings.filter((b) => b.patientId === p.id)
  const openAlerts = alerts.filter((a) => a.patientId === p.id && a.status !== 'Resolved')

  return (
    <>
      <Breadcrumb items={[{ label: 'Patients', to: '/staff/patients' }, { label: name }]} />
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div className="relative"><Avatar name={name} size={72} /><button onClick={() => notify('Choose a photo to upload · photos stay inside Helixona')} aria-label="Change patient photo" className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-sand-300 bg-white text-sand-600 shadow-sm hover:text-sand-900"><Camera size={14} /></button></div>
          <div className="min-w-0">
            <div className="eyebrow">eCW {p.ecwId} · {p.id}</div>
            <h1 className="font-display text-3xl font-semibold text-sand-900">{name}</h1>
            <p className="mt-0.5 text-sand-600">DOB {p.dob} · {p.city} · {p.phone} · {p.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-sand-600">
              <Pill tone={toneFor(status)}>{status}</Pill><Pill tone={toneFor(p.chartPrep)}>Chart prep: {p.chartPrep}</Pill><Pill tone="teal" dot={false}>{stageLabel(plan.stage)}</Pill>
              <span className="inline-flex items-center gap-2">Actors: <Actors size="sm" actors={plan.actors} lead={plan.leadActor} /></span>
              <span>Advisor: {p.advisor}</span>{inquiry && <span>· From {inquiry.source}</span>}
            </div>
          </div>
        </div>
        <button className="btn-primary" onClick={() => setUpdating(true)}>Update status</button>
      </div>
      {updating && <UpdateStatus current={status} onClose={() => setUpdating(false)} onSave={(st, why) => { changeStatus(p.id, st, why); setUpdating(false); notify(`Status changed to ${st}`) }} />}

      <Tabs value={tab} onChange={setTab} tabs={[
        { key: 'overview', label: 'Overview' }, { key: 'invitation', label: 'Invitation' }, { key: 'interview', label: 'Advisor interview (internal)' },
        { key: 'admissions', label: 'Admissions outcome' }, { key: 'intake', label: 'Intake review' }, { key: 'chart', label: 'Chart prep' },
        { key: 'notes', label: 'Notes / Communication', count: notesFor(p.id).length }, { key: 'scores', label: 'Scores & check-ins' }, { key: 'history', label: 'History' },
      ]} />

      {tab === 'overview' && (
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5">
            <Card title="Journey" subtitle="Finished phases fold into one line; open one to see its steps and dates.">
              <JourneyStrip status={status} patientId={p.id} />
            </Card>
            <Card title="Healing roadmap" actions={<button onClick={() => setTab('scores')} className="text-xs text-teal-700 underline">Scores & check-ins</button>}>
              <div className="text-sm font-semibold text-sand-900">{stageLabel(plan.stage)}</div>
              <div className="mt-2"><Roadmap current={plan.stage} compact /></div>
              <div className="mt-3"><Actors actors={plan.actors} lead={plan.leadActor} /></div>
              <p className="help mt-2">Set by {plan.updatedBy} · {plan.updatedAt}</p>
            </Card>
          </div>
          <div className="space-y-5">
            <Card title="Most recent note" actions={<button onClick={() => setTab('notes')} className="text-xs text-teal-700 underline">All notes</button>}>
              {note ? <ul><NoteRow n={note} /></ul> : <p className="help">No notes yet.</p>}
              <button onClick={() => setTab('notes')} className="btn-secondary mt-2 w-full py-2 text-[11px]">Add a note</button>
            </Card>
            <Card title="Intake package" actions={<button onClick={() => setTab('intake')} className="text-xs text-teal-700 underline">Review</button>}>
              <Row label="Questionnaire">{p.intake ? <><VersionTag>v{p.intake.version}</VersionTag> {p.intake.progress}%</> : 'Not started'}</Row>
              <Row label="Submitted">{p.intake?.submittedAt ?? '—'}</Row>
              <Row label="Documents">{p.uploads.filter((u) => u.status === 'uploaded').length} uploaded · {p.uploads.filter((u) => u.status === 'missing').length} missing · {p.uploads.filter((u) => u.status === 'returned').length} returned</Row>
              <Row label="Consents signed">{p.forms.filter((f) => f.status === 'signed').length} of {p.forms.length}</Row>
            </Card>
            <Card title="Chart prep" actions={<button onClick={() => setTab('chart')} className="text-xs text-teal-700 underline">Open</button>}>
              <Row label="Status"><Pill tone={toneFor(p.chartPrep)}>{p.chartPrep}</Pill></Row>
              <Row label="AI Agent">{p.chartPrep === 'Placed in eCW' ? 'Verified in eCW' : p.chartPrep === 'Exception' ? <span className="font-medium text-bad-700">Needs attention</span> : p.chartPrep === 'Ready for chart prep' ? 'Queued · runs 6:00 AM' : 'Not queued'}</Row>
            </Card>
          </div>
          <div className="space-y-5">
            <Card title="Scheduled visits" subtitle={`${visits.length} on the calendar`}>
              {visits.length === 0 && <p className="help">Nothing scheduled.</p>}
              <ul className="divide-y divide-sand-100">{visits.map((b) => <li key={b.id} className="flex items-center justify-between gap-2 py-2 text-sm"><span><span className="font-medium text-sand-900">{b.modality}</span><span className="block text-xs text-sand-500">{b.date} · {b.start}–{b.end} · {b.resource}</span></span><Pill tone={toneFor(b.status)} dot={false}>{b.status}</Pill></li>)}</ul>
            </Card>
            <Card title="Open alerts" actions={<a href="#/staff/alerts" className="text-xs text-teal-700 underline">Alert queue</a>}>
              {openAlerts.length === 0 ? <p className="help">No open alerts.</p> : openAlerts.map((a) => <div key={a.id} className="py-1.5 text-sm"><Pill tone={levelTone[a.level]}>{a.level}</Pill><div className="mt-1 text-sand-800">{a.summary}</div><div className="text-xs text-sand-500">{a.status} · {a.assignee}</div></div>)}
            </Card>
            <Card title="Recent activity" subtitle="Who · when · why">
              <AuditList entries={[...history].reverse().slice(0, 4)} compact />
              <button onClick={() => setTab('history')} className="btn-ghost mt-2 px-0 text-sm text-teal-700">Full history →</button>
            </Card>
          </div>
        </div>
      )}

      {tab === 'invitation' && <InvitationTab p={p} />}
      {tab === 'interview' && <InterviewTab />}
      {tab === 'admissions' && <AdmissionsTab p={p} />}
      {tab === 'intake' && <IntakeReviewPanel patient={p} />}
      {tab === 'chart' && <ChartPrepPanel id={p.id} />}
      {tab === 'notes' && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Card title="Notes" subtitle="Chart prep, intake, admission, billing and scheduling notes for this patient, newest first."><NotesPanel patientId={p.id} /></Card>
          <CommunicationLog />
        </div>
      )}
      {tab === 'scores' && <ScoresPanel id={p.id} />}
      {tab === 'history' && <Card title="Full history" subtitle="Every status change, action, and reason code. Exportable for audit."><AuditList entries={[...history].reverse()} /></Card>}
    </>
  )
}

function UpdateStatus({ current, onClose, onSave }: { current: string; onClose: () => void; onSave: (status: string, reason: string) => void }) {
  const [st, setSt] = useState('')
  const [why, setWhy] = useState('')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label="Update status">
      <div className="card w-full max-w-md p-5 shadow-xl">
        <h2 className="font-display text-2xl font-semibold text-sand-900">Update status</h2>
        <p className="mt-1 text-sm text-sand-600">Now: <strong>{current}</strong>. Membership changes (pause, graduate, withdraw) are made in the Registry.</p>
        <div className="mt-4 space-y-4">
          <Field label="New status" required><select className="input" value={st} onChange={(e) => setSt(e.target.value)}><option value="">Select…</option>{admissionStatuses.filter((x) => x !== current).map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Reason" required><input className="input" value={why} onChange={(e) => setWhy(e.target.value)} placeholder="Why this change" /></Field>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3"><span className="text-xs text-sand-500">Recorded as {currentUser().name} · now</span><div className="flex gap-2"><button onClick={onClose} className="btn-ghost">Cancel</button><button disabled={!st || !why.trim()} onClick={() => onSave(st, why.trim())} className="btn-primary">Save status</button></div></div>
      </div>
    </div>
  )
}

/* Journey: phases made of steps. A finished phase folds into one line with the date it was completed. */
const phases: { name: string; steps: string[] }[] = [
  { name: 'Admission', steps: ['Inquiry', 'Advisor interview', 'Insurance & admissions'] },
  { name: 'Month 0 assessment', steps: ['Month 0', 'Plan of Care'] },
  { name: 'Enrollment', steps: ['Program offered', 'Contract & payment'] },
  { name: 'Active care', steps: ['Active care'] },
  { name: 'Month 9 review', steps: ['Month 9 review'] },
]
const journeyDates = ['Sep 18, 2026', 'Sep 22, 2026', 'Sep 26, 2026', 'Oct 1, 2026', 'Oct 14, 2026', 'Oct 16, 2026', 'Oct 20, 2026', 'Oct 22, 2026', 'Jul 22, 2027']
function stageIndex(status: string) {
  if (/inquiry|outreach/i.test(status)) return 0
  if (/interview/i.test(status)) return 1
  if (/insurance|admissions|denied|fell off|waitlist|pending information/i.test(status)) return 2
  if (/month 0/i.test(status)) return 3
  if (/plan of care/i.test(status)) return 4
  if (/offered|declined/i.test(status)) return 5
  if (/contract|payment/i.test(status)) return 6
  if (/active|paused/i.test(status)) return 7
  return 8
}
export function JourneyStrip({ status, patientId }: { status: string; patientId?: string }) {
  const idx = stageIndex(status)
  const [open, setOpen] = useState<string[]>([])
  const plan = patientId ? planFor(patientId) : undefined
  let n = 0
  return (
    <ol className="space-y-1">
      {phases.map((ph) => {
        const first = n; n += ph.steps.length; const lastI = n - 1
        const state = lastI < idx ? 'done' : first > idx ? 'next' : 'current'
        const expanded = state === 'current' || open.includes(ph.name)
        const dot = state === 'done' ? 'bg-ok-600' : state === 'current' ? 'bg-teal-600 ring-4 ring-teal-100' : 'bg-sand-300'
        return (
          <li key={ph.name}>
            <button type="button" disabled={state !== 'done'} onClick={() => setOpen(open.includes(ph.name) ? open.filter((x) => x !== ph.name) : [...open, ph.name])} aria-expanded={expanded} className={`flex w-full items-center gap-2 rounded-lg px-1 py-1 text-left text-sm ${state === 'done' ? 'text-sand-600 hover:bg-sand-100' : state === 'current' ? 'font-semibold text-sand-900' : 'text-sand-400'}`}>
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} />
              <span className="flex-1">{ph.name}</span>
              {state === 'done' && <span className="text-xs text-sand-500">Completed {journeyDates[lastI]}</span>}
              {state === 'done' && <ChevronDown size={14} className={`text-sand-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />}
            </button>
            {expanded && (ph.steps.length > 1 || ph.name === 'Active care') && (
              <ol className="ml-[5px] mt-0.5 space-y-1 border-l border-sand-200 pb-1 pl-4">
                {ph.steps.length > 1 && ph.steps.map((st, k) => { const i = first + k; return (
                  <li key={st} className={`flex items-center justify-between gap-2 text-[13px] ${i < idx ? 'text-sand-500' : i === idx ? 'font-semibold text-teal-800' : 'text-sand-400'}`}>
                    <span>{st}{st === 'Contract & payment' && i > idx && <span className="ml-1 text-[11px] font-normal text-sand-500">· only after “Program offered”</span>}</span>
                    <span className="text-xs font-normal text-sand-500">{i < idx ? journeyDates[i] : i === idx ? `since ${journeyDates[i]}` : ''}</span>
                  </li>) })}
                {ph.name === 'Active care' && plan && stages.map((sg) => (
                  <li key={sg.n} className={`flex items-center justify-between gap-2 text-[13px] ${sg.n < plan.stage ? 'text-sand-500' : sg.n === plan.stage ? 'font-semibold text-teal-800' : 'text-sand-400'}`}>
                    <span>Step {sg.n} · {sg.title}</span><span className="text-xs font-normal text-sand-500">{sg.n < plan.stage ? stageDates[sg.n - 1] : sg.n === plan.stage ? `since ${stageDates[sg.n - 1]}` : ''}</span>
                  </li>))}
              </ol>
            )}
          </li>
        )
      })}
    </ol>
  )
}

function InvitationTab({ p }: { p: NonNullable<ReturnType<typeof patientById>> }) {
  const states = ['sent', 'delivered', 'opened', 'started', 'submitted'] as const
  const inv = p.invitation
  const cur = inv ? states.indexOf(inv.state as (typeof states)[number]) : -1
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-5">
        <Card title="Invitation status" subtitle={inv ? `${inv.method} · sent ${inv.sentAt} · expires ${inv.expiresAt}` : 'No invitation sent yet.'}
          actions={<div className="flex gap-2"><button className="btn-secondary px-3 py-1.5 text-xs" onClick={() => notify('A new invitation was sent · the old link no longer works')}><RefreshCw size={14} /> Reissue</button><button className="btn-secondary px-3 py-1.5 text-xs" onClick={() => notify('Reminder sent to the patient')}><Send size={14} /> Send reminder</button></div>}>
          <ol className="flex items-center">
            {states.map((s, i) => (
              <li key={s} className="flex flex-1 items-center">
                <div className="flex flex-col items-center text-center">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${i <= cur ? 'bg-teal-600 text-white' : 'bg-sand-100 text-sand-400'}`}>{i + 1}</span>
                  <span className={`mt-1 text-xs capitalize ${i <= cur ? 'text-teal-800 font-semibold' : 'text-sand-400'}`}>{s}</span>
                </div>
                {i < states.length - 1 && <div className={`mx-1 h-0.5 flex-1 ${i < cur ? 'bg-teal-600' : 'bg-sand-200'}`} />}
              </li>
            ))}
          </ol>
          <div className="mt-4 flex gap-2 text-xs text-sand-500"><Pill tone="bad" dot={false}>Expired</Pill><Pill tone="warn" dot={false}>Reissued</Pill><span className="self-center">are also tracked when they occur.</span></div>
        </Card>
        <Card title="Delivery history"><AuditList entries={inv?.history ?? []} /></Card>
      </div>
      <Card title="Reminders" subtitle="Configured in Message templates (Priority 3).">
        <Row label="Day 3">Text + email · sent</Row>
        <Row label="Day 7">Text · scheduled</Row>
        <Row label="Day 12">Advisor task “call patient”</Row>
        <Row label="Stops when">Intake submitted or invitation expires</Row>
      </Card>
    </div>
  )
}

function InterviewTab() {
  const [v, setV] = useState({ readiness: 'High', support: 'Spouse helps with appointments', budget: 'Understands Month 0 fee and $2,000/mo; asked about ACH', redflags: 'None noted', notes: 'Patient is articulate about goals. Has tried PT and 2 rheumatologists. Prefers texting. Available Tue/Thu mornings.' })
  return (
    <>
      <div className="mb-4"><Notice tone="plum" icon={<EyeOff size={16} />} title="Internal advisor record — never visible to the patient">This interview is stored separately from the medical record and is not included in the eCW note or PDF.</Notice></div>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Qualification interview" subtitle="Ana · Sep 22, 2026 · 10:05 AM · 40 min phone call" actions={<VersionTag>Interview form v1</VersionTag>}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Readiness to commit to a nine-month program"><select className="input" value={v.readiness} onChange={(e) => setV({ ...v, readiness: e.target.value })}><option>High</option><option>Medium</option><option>Low</option><option>Unsure</option></select></Field>
              <Field label="Support at home"><input className="input" value={v.support} onChange={(e) => setV({ ...v, support: e.target.value })} /></Field>
              <Field label="Financial conversation"><input className="input" value={v.budget} onChange={(e) => setV({ ...v, budget: e.target.value })} /></Field>
              <Field label="Concerns or red flags"><input className="input" value={v.redflags} onChange={(e) => setV({ ...v, redflags: e.target.value })} /></Field>
            </div>
            <div className="mt-4"><Field label="Advisor notes"><textarea rows={5} className="input" value={v.notes} onChange={(e) => setV({ ...v, notes: e.target.value })} /></Field></div>
            <div className="mt-3"><ToConfirm>interview question set from the advisor team</ToConfirm></div>
            <div className="mt-4 flex gap-2"><button className="btn-primary" onClick={() => notify('Interview notes saved · internal only')}>Save interview</button><button className="btn-secondary" onClick={() => notify('Interview marked as completed')}>Mark interview completed</button></div>
          </Card>
        </div>
        <Card title="Insurance (collected during interview)">
          <Row label="Carrier">Anthem Blue Cross</Row>
          <Row label="Plan type">PPO</Row>
          <Row label="Member ID">•••• 8821</Row>
          <Row label="Card photos">Front + back uploaded</Row>
          <Row label="Karina's review"><Pill tone="ok">Completed Sep 24</Pill></Row>
          <p className="help mt-3">Benefits summary: out-of-network applies to NP visits; program modalities are cash and included in membership.</p>
        </Card>
      </div>
    </>
  )
}

function AdmissionsTab({ p }: { p: NonNullable<ReturnType<typeof patientById>> }) {
  const [outcome, setOutcome] = useState<'accepted' | 'waitlist' | 'pending' | 'denied' | 'fell-off' | null>(p.status === 'Denied' ? 'denied' : p.status === 'Patient fell off' ? 'fell-off' : p.status === 'Waitlist' ? 'waitlist' : p.status === 'Pending information' ? 'pending' : /month 0|offered|active/i.test(p.status) ? 'accepted' : null)
  const reasons: Record<string, string[]> = {
    accepted: ['ADM-01 · Meets program criteria', 'ADM-02 · Meets criteria with physician review note'],
    waitlist: ['WL-01 · Qualified · waiting for a program opening', 'WL-02 · Qualified · patient asked to start later', 'WL-03 · Waiting for physician availability'],
    pending: ['PI-01 · Waiting for prior medical records', 'PI-02 · Waiting for insurance benefits review', 'PI-03 · Waiting for lab results', 'PI-04 · Patient is deciding'],
    denied: ['DEN-01 · Clinical fit — better served by another pathway', 'DEN-02 · Financial — patient cannot proceed', 'DEN-03 · Outside service area', 'DEN-04 · Other (note required)'],
    'fell-off': ['FO-01 · No response after approved reminder sequence', 'FO-02 · Patient asked to stop contact', 'FO-03 · Chose another provider'],
  }
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card title="Admissions outcome" subtitle="Recorded once the interview and insurance review are complete. Every outcome stores the reason code, date, and staff member.">
          <div role="radiogroup" aria-label="Admissions outcome" className="divide-y divide-sand-200 overflow-hidden rounded-2xl border border-sand-300">
            {([['accepted', 'Accepted for Month 0', 'ok', 'Enables Month 0 payment, intake and scheduling.', CheckCircle2], ['waitlist', 'Waitlist', 'warn', 'Qualified. Contact stays active until a place opens.', Hourglass], ['pending', 'Pending information', 'warn', 'Decision on hold. Sets a follow-up date.', FileQuestion], ['denied', 'Denied', 'bad', 'Records the reason and an alternate pathway.', XCircle], ['fell-off', 'Patient fell off', 'neutral', 'Stops reminders and keeps the history.', UserMinus]] as const).map(([k, l, t, d, Icon]) => { const on = outcome === k; const tint = t === 'ok' ? 'bg-ok-100 text-ok-700' : t === 'bad' ? 'bg-bad-100 text-bad-700' : t === 'warn' ? 'bg-warn-100 text-warn-700' : 'bg-sand-100 text-sand-600'; return (
              <button key={k} type="button" role="radio" aria-checked={on} onClick={() => setOutcome(k)} className={`flex w-full items-center gap-3.5 px-4 py-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-400 ${on ? 'bg-teal-50 shadow-[inset_4px_0_0_#141414]' : 'bg-white hover:bg-sand-50'}`}>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tint}`}><Icon size={18} /></span>
                <span className="min-w-0 flex-1"><span className="block text-[15px] font-semibold text-sand-900">{l}</span><span className="block text-[13px] text-sand-600">{d}</span></span>
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${on ? 'border-sand-900 bg-sand-900 text-white' : 'border-sand-300 bg-white'}`}>{on && <Check size={12} />}</span>
              </button>) })}
          </div>
          {outcome && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Reason code" required><select className="input" defaultValue={reasons[outcome][0]}>{reasons[outcome].map((r) => <option key={r}>{r}</option>)}</select></Field>
              <Field label="Effective date" required><input type="date" className="input" defaultValue="2026-09-26" /></Field>
              {outcome === 'waitlist' && <Field label="Hoped-for start"><input className="input" defaultValue="Next opening · est. January 2027" /></Field>}
              {outcome === 'pending' && <><Field label="What we are waiting for" required><input className="input" defaultValue="Records from prior rheumatologist" /></Field><Field label="Follow up on" required><input type="date" className="input" defaultValue="2026-10-14" /></Field></>}
              {outcome === 'denied' && <Field label="Alternate pathway"><select className="input"><option>Insurance-covered NP care</option><option>Self-directed care</option><option>External referral</option><option>None</option></select></Field>}
              <div className="sm:col-span-2"><Field label="Notes"><textarea rows={3} className="input" defaultValue={outcome === 'accepted' ? 'Reviewed with Karina. Patient ready to schedule Month 0 in October.' : ''} /></Field></div>
            </div>
          )}
          <div className="mt-4 flex items-center gap-3">
            <button className="btn-primary" disabled={!outcome} onClick={() => { const l = ({ accepted: 'Accepted for Month 0', waitlist: 'Waitlist', pending: 'Pending information', denied: 'Denied', 'fell-off': 'Patient fell off' })[outcome!]; changeStatus(p.id, l, 'Admissions outcome'); notify(`Outcome recorded: ${l}`) }}>Record outcome</button>
            <span className="help">Recorded as <strong>{currentUser().name}</strong> · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </Card>
      </div>
      <Card title="Current record">
        <Row label="Outcome"><Pill tone={toneFor(statusOf(p))}>{statusOf(p)}</Pill></Row>
        <Row label="Recorded by">Ana (advisor)</Row>
        <Row label="When">Sep 26, 2026 · 1:58 PM</Row>
        <Row label="Reason">ADM-01</Row>
        <p className="help mt-3">After “Accepted for Month 0”, the next steps are <Link className="text-teal-700 underline" to={`/staff/patients/${p.id}?tab=invitation`}>send the invitation</Link> and Month 0 payment (Karina).</p>
      </Card>
    </div>
  )
}
