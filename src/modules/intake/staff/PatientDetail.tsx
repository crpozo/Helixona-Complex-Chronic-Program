import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { EyeOff, RefreshCw, Send } from 'lucide-react'
import { AuditList, Breadcrumb, Card, Field, Notice, PageHeader, Pill, Row, Tabs, ToConfirm, VersionTag, toneFor } from '../../../components/ui'
import { patientById } from '../../../mock/patients'
import { inquiries } from '../../../mock/inquiries'
import IntakeReviewPanel from './IntakeReviewPanel'

export default function PatientDetail() {
  const { id = '' } = useParams()
  const [sp, setSp] = useSearchParams()
  const nav = useNavigate()
  const p = patientById(id)
  const tab = sp.get('tab') ?? 'overview'
  const setTab = (t: string) => setSp({ tab: t })
  if (!p) return <Notice tone="bad">Patient {id} not found in sample data.</Notice>
  const inquiry = inquiries.find((i) => i.patientId === p.id)

  return (
    <>
      <Breadcrumb items={[{ label: 'Patients', to: '/staff/patients' }, { label: p.id }]} />
      <PageHeader eyebrow={`${p.id} · eCW ${p.ecwId}`} title={`${p.firstName} ${p.lastName}`}
        description={<span>DOB {p.dob} · {p.city} · {p.phone} · {p.email}</span>}
        meta={<><Pill tone={toneFor(p.status)}>{p.status}</Pill><Pill tone={toneFor(p.chartPrep)}>Chart prep: {p.chartPrep}</Pill><span>Advisor: {p.advisor}</span>{inquiry && <span>· From {inquiry.id} ({inquiry.source})</span>}</>}
        actions={<><button className="btn-secondary" onClick={() => nav(`/staff/chart-prep/${p.id}`)}>Chart prep view</button><button className="btn-primary">Update status</button></>} />

      <Tabs value={tab} onChange={setTab} tabs={[
        { key: 'overview', label: 'Overview' }, { key: 'invitation', label: 'Invitation' }, { key: 'interview', label: 'Advisor interview (internal)' },
        { key: 'admissions', label: 'Admissions outcome' }, { key: 'intake', label: 'Intake review' }, { key: 'history', label: 'History' },
      ]} />

      {tab === 'overview' && (
        <div className="grid gap-5 lg:grid-cols-3">
          <Card title="Journey" subtitle="Where this patient is in the program.">
            <JourneyStrip status={p.status} />
          </Card>
          <Card title="Intake package">
            <Row label="Questionnaire">{p.intake ? <><VersionTag>v{p.intake.version}</VersionTag> {p.intake.progress}%</> : 'Not started'}</Row>
            <Row label="Submitted">{p.intake?.submittedAt ?? '—'}</Row>
            <Row label="Documents">{p.uploads.filter((u) => u.status === 'uploaded').length} uploaded · {p.uploads.filter((u) => u.status === 'missing').length} missing · {p.uploads.filter((u) => u.status === 'returned').length} returned</Row>
            <Row label="Forms signed">{p.forms.filter((f) => f.status === 'signed').length} of {p.forms.length}</Row>
            <Row label="Chart prep"><Pill tone={toneFor(p.chartPrep)}>{p.chartPrep}</Pill></Row>
          </Card>
          <Card title="Recent activity" subtitle="Who · when · why">
            <AuditList entries={[...p.history].reverse().slice(0, 4)} compact />
            <button onClick={() => setTab('history')} className="btn-ghost mt-2 px-0 text-sm text-teal-700">Full history →</button>
          </Card>
        </div>
      )}

      {tab === 'invitation' && <InvitationTab p={p} />}
      {tab === 'interview' && <InterviewTab />}
      {tab === 'admissions' && <AdmissionsTab p={p} />}
      {tab === 'intake' && <IntakeReviewPanel patient={p} />}
      {tab === 'history' && <Card title="Full history" subtitle="Every status change, action, and reason code. Exportable for audit."><AuditList entries={p.history} /></Card>}
    </>
  )
}

const journey = ['Inquiry', 'Advisor interview', 'Insurance & admissions', 'Month 0', 'Plan of Care', 'Program offered', 'Contract & payment', 'Active care', 'Month 9 review']
function stageIndex(status: string) {
  if (/inquiry|outreach/i.test(status)) return 0
  if (/interview/i.test(status)) return 1
  if (/insurance|admissions|denied|fell off/i.test(status)) return 2
  if (/month 0/i.test(status)) return 3
  if (/plan of care/i.test(status)) return 4
  if (/offered|declined/i.test(status)) return 5
  if (/contract|payment/i.test(status)) return 6
  if (/active|paused/i.test(status)) return 7
  return 8
}
export function JourneyStrip({ status }: { status: string }) {
  const idx = stageIndex(status)
  return (
    <ol className="space-y-1.5">
      {journey.map((j, i) => (
        <li key={j} className={`flex items-center gap-2 text-sm ${i < idx ? 'text-sand-500' : i === idx ? 'font-semibold text-teal-800' : 'text-sand-400'}`}>
          <span className={`h-2.5 w-2.5 rounded-full ${i < idx ? 'bg-ok-600' : i === idx ? 'bg-teal-600 ring-4 ring-teal-100' : 'bg-sand-300'}`} />{j}
          {j === 'Contract & payment' && <span className="ml-1 text-[11px] font-normal text-sand-500">gated: only when “Program offered”</span>}
        </li>
      ))}
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
          actions={<div className="flex gap-2"><button className="btn-secondary px-3 py-1.5 text-xs"><RefreshCw size={14} /> Reissue</button><button className="btn-secondary px-3 py-1.5 text-xs"><Send size={14} /> Send reminder</button></div>}>
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
            <div className="mt-4 flex gap-2"><button className="btn-primary">Save interview</button><button className="btn-secondary">Mark interview completed</button></div>
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
  const [outcome, setOutcome] = useState<'accepted' | 'denied' | 'fell-off' | null>(p.status === 'Denied' ? 'denied' : p.status === 'Patient fell off' ? 'fell-off' : /month 0|offered|active/i.test(p.status) ? 'accepted' : null)
  const reasons: Record<string, string[]> = {
    accepted: ['ADM-01 · Meets program criteria', 'ADM-02 · Meets criteria with physician review note'],
    denied: ['DEN-01 · Clinical fit — better served by another pathway', 'DEN-02 · Financial — patient cannot proceed', 'DEN-03 · Outside service area', 'DEN-04 · Other (note required)'],
    'fell-off': ['FO-01 · No response after approved reminder sequence', 'FO-02 · Patient asked to stop contact', 'FO-03 · Chose another provider'],
  }
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card title="Admissions outcome" subtitle="Recorded once the interview and insurance review are complete. Every outcome stores the reason code, date, and staff member.">
          <div className="grid gap-2 sm:grid-cols-3">
            {([['accepted', 'Accepted for Month 0', 'ok'], ['denied', 'Denied', 'bad'], ['fell-off', 'Patient fell off', 'warn']] as const).map(([k, l, t]) => (
              <button key={k} onClick={() => setOutcome(k)} className={`rounded-xl border p-3.5 text-left ${outcome === k ? 'border-teal-500 bg-teal-50' : 'border-sand-300 bg-white hover:bg-sand-50'}`}>
                <Pill tone={t}>{l}</Pill>
                <div className="mt-2 text-xs text-sand-500">{k === 'accepted' ? 'Enables Month 0 payment, intake, and scheduling.' : k === 'denied' ? 'Records reason and alternate pathway.' : 'Stops reminders; keeps history.'}</div>
              </button>
            ))}
          </div>
          {outcome && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Reason code" required><select className="input" defaultValue={reasons[outcome][0]}>{reasons[outcome].map((r) => <option key={r}>{r}</option>)}</select></Field>
              <Field label="Effective date" required><input type="date" className="input" defaultValue="2026-09-26" /></Field>
              {outcome === 'denied' && <Field label="Alternate pathway"><select className="input"><option>Insurance-covered NP care</option><option>Self-directed care</option><option>External referral</option><option>None</option></select></Field>}
              <div className="sm:col-span-2"><Field label="Notes"><textarea rows={3} className="input" defaultValue={outcome === 'accepted' ? 'Reviewed with Karina. Patient ready to schedule Month 0 in October.' : ''} /></Field></div>
            </div>
          )}
          <div className="mt-4 flex items-center gap-3">
            <button className="btn-primary" disabled={!outcome}>Record outcome</button>
            <span className="help">Recorded as <strong>Ana (advisor)</strong> · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </Card>
      </div>
      <Card title="Current record">
        <Row label="Outcome"><Pill tone={toneFor(p.status)}>{p.status}</Pill></Row>
        <Row label="Recorded by">Ana (advisor)</Row>
        <Row label="When">Sep 26, 2026 · 1:58 PM</Row>
        <Row label="Reason">ADM-01</Row>
        <p className="help mt-3">After “Accepted for Month 0”, the next steps are <Link className="text-teal-700 underline" to={`/staff/patients/${p.id}?tab=invitation`}>send the invitation</Link> and Month 0 payment (Karina).</p>
      </Card>
    </div>
  )
}
