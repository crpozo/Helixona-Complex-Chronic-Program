import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { PageHeader, Pill, QueueTable, Tabs, toneFor, WhoWhenWhy, type Column } from '../../../components/ui'
import { MetricBoard, type Metric } from '../../../components/MetricBoard'
import { Avatar } from '../../../components/Avatar'
import { patients } from '../../../mock/patients'
import { planFor } from '../../../mock/roadmap'
import { currentUser, latestNote, statusOf, useStore } from '../../../mock/store'
import type { Patient } from '../../../mock/types'

/** One screen for everything about patients: invitations, intake review, chart prep and eCW exceptions are
 *  views and filters of the same list. Membership lives in the registry. */
const invTone = (s?: string) => (!s ? 'neutral' : s === 'expired' ? 'bad' : s === 'submitted' ? 'ok' : s === 'sent' || s === 'delivered' ? 'teal' : 'warn')
const chartOrder = ['Exception', 'Ready for chart prep', 'Submitted', 'Reviewed for completeness', 'Placed in eCW', 'Awaiting intake']
const openItems = (p: Patient) => !p.intake ? [] : [...new Set([
  ...(p.intake.progress < 100 ? ['questionnaire'] : []),
  ...p.uploads.filter((u) => u.required && u.status !== 'uploaded').map((u) => (u.status === 'returned' ? 'returned item' : 'missing document')),
  ...(p.forms.some((f) => f.status !== 'signed') ? ['unsigned forms'] : []),
])]
const agent = (p: Patient): [string, 'ok' | 'bad' | 'teal' | 'neutral'] => p.chartPrep === 'Placed in eCW' ? ['Verified in eCW', 'ok'] : p.chartPrep === 'Exception' ? ['Needs attention', 'bad'] : p.chartPrep === 'Ready for chart prep' ? ['Queued · runs 6:00 AM', 'teal'] : ['', 'neutral']
const nextStep = (p: Patient, status: string) => /waitlist/i.test(status) ? 'On the waitlist · contact when a place opens' : /pending information/i.test(status) ? 'Waiting for information · follow up Oct 14' : p.chartPrep === 'Ready for chart prep' ? 'Place note and PDF in eCW' : p.chartPrep === 'Exception' ? 'Resolve the eCW exception' : p.chartPrep === 'Placed in eCW' ? 'Review placement · close' : p.chartPrep === 'Submitted' ? 'Review intake for completeness' : p.invitation ? 'Waiting on patient' : 'Send the invitation'

const views = [
  { key: 'all', label: 'All patients', test: (_p: Patient, _s: string) => true },
  { key: 'intake', label: 'Intake review', test: (p: Patient) => !!p.intake && p.chartPrep !== 'Placed in eCW' },
  { key: 'chart', label: 'Chart prep', test: (p: Patient) => ['Ready for chart prep', 'Placed in eCW', 'Exception', 'Reviewed for completeness', 'Submitted'].includes(p.chartPrep) },
  { key: 'exceptions', label: 'eCW exceptions', test: (p: Patient) => p.chartPrep === 'Exception' },
  { key: 'waiting', label: 'Waitlist & pending', test: (_p: Patient, s: string) => /waitlist|pending information/i.test(s) },
] as const

export default function PatientsList() {
  useStore()
  const nav = useNavigate()
  const [sp, setSp] = useSearchParams()
  const view = views.find((v) => v.key === sp.get('view')) ?? views[0]
  const [q, setQ] = useState('')
  const [f, setF] = useState({ status: 'All', chart: 'All', advisor: 'All', open: false })
  const [noteScope, setNoteScope] = useState<'mine' | 'anyone'>(() => { try { return (localStorage.getItem('hlx-note-scope') as 'mine') || 'anyone' } catch { return 'anyone' } })
  const setScope = (s: 'mine' | 'anyone') => { setNoteScope(s); try { localStorage.setItem('hlx-note-scope', s) } catch { /* ignore */ } }
  const me = currentUser()
  const count = (fn: (p: Patient, s: string) => boolean) => patients.filter((p) => fn(p, statusOf(p))).length

  const rows = useMemo(() => patients
    .filter((p) => view.test(p, statusOf(p)))
    .filter((p) => !q || `${p.firstName} ${p.lastName} ${p.id} ${p.ecwId} ${p.email} ${p.phone}`.toLowerCase().includes(q.toLowerCase()))
    .filter((p) => f.status === 'All' || statusOf(p) === f.status)
    .filter((p) => f.chart === 'All' || p.chartPrep === f.chart)
    .filter((p) => f.advisor === 'All' || p.advisor === f.advisor)
    .filter((p) => !f.open || openItems(p).length > 0)
    .sort((a, b) => (view.key === 'chart' || view.key === 'exceptions' ? chartOrder.indexOf(a.chartPrep) - chartOrder.indexOf(b.chartPrep) : 0)),
  [view, q, f]) // eslint-disable-line react-hooks/exhaustive-deps
  const activeFilters = (f.status !== 'All' ? 1 : 0) + (f.chart !== 'All' ? 1 : 0) + (f.advisor !== 'All' ? 1 : 0) + (f.open ? 1 : 0) + (q ? 1 : 0)

  const metrics: Metric[] = [
    { key: 'total', label: 'Patients', value: patients.length, hint: 'all records', tone: 'neutral', to: '/staff/patients' },
    { key: 'awaiting', label: 'Intake awaiting review', value: count((p) => p.chartPrep === 'Submitted'), hint: 'submitted', tone: 'teal', to: '/staff/patients?view=intake' },
    { key: 'waitingPatient', label: 'Waiting on patient', value: count((p) => !!p.intake && (p.uploads.some((u) => u.status === 'returned') || p.intake.progress < 100)), hint: 'returned / in progress', tone: 'warn', to: '/staff/patients?view=intake' },
    { key: 'ready', label: 'Ready for chart prep', value: count((p) => p.chartPrep === 'Ready for chart prep'), hint: 'today', tone: 'teal', to: '/staff/patients?view=chart' },
    { key: 'placed', label: 'Placed · awaiting review', value: count((p) => p.chartPrep === 'Placed in eCW'), tone: 'ok', to: '/staff/patients?view=chart' },
    { key: 'exceptions', label: 'eCW exceptions', value: count((p) => p.chartPrep === 'Exception'), hint: 'needs a person', tone: 'bad', to: '/staff/patients?view=exceptions' },
    { key: 'waitlist', label: 'Waitlist', value: count((_, s) => s === 'Waitlist'), tone: 'warn', to: '/staff/patients?view=waiting' },
    { key: 'pending', label: 'Pending information', value: count((_, s) => s === 'Pending information'), tone: 'warn', to: '/staff/patients?view=waiting' },
    { key: 'accepted', label: 'Accepted for Month 0', value: count((_, s) => s === 'Accepted for Month 0'), hint: '30 days', tone: 'ok' },
    { key: 'notSent', label: 'Invitation not sent', value: count((p) => !p.invitation), tone: 'neutral' },
    { key: 'agentRun', label: 'AI Agent last run', value: '6:02 AM', hint: 'Oct 7 · healthy', tone: 'ok', to: '/staff/ecw-exceptions' },
    { key: 'median', label: 'Median time to review', value: '1.2 d', hint: 'target ≤ 1 d', tone: 'ok' },
  ]
  const defaults = me.role === 'charlene' ? ['ready', 'placed', 'exceptions', 'agentRun'] : me.role === 'advisor' ? ['awaiting', 'waitingPatient', 'waitlist', 'pending'] : ['total', 'awaiting', 'ready', 'exceptions']

  const columns: Column<Patient>[] = [
    { key: 'who', header: 'Patient', width: '230px', render: (r) => { const n = `${r.firstName} ${r.lastName}`; return <div className="flex items-center gap-2.5"><Avatar name={n} size={34} /><div><div className="font-semibold text-sand-900">{n}</div><div className="text-xs text-sand-500">eCW {r.ecwId} · {r.advisor}</div></div></div> } },
    { key: 'status', header: 'Status', render: (r) => { const s = statusOf(r); return <><Pill tone={toneFor(s)}>{s}</Pill><div className="mt-1 text-xs text-sand-500">Step {planFor(r.id).stage} of 7</div></> } },
    { key: 'inv', header: 'Invitation', render: (r) => r.invitation ? <><Pill tone={invTone(r.invitation.state)} dot={false} className="capitalize">{r.invitation.state}</Pill><div className="mt-1 text-xs text-sand-500">expires {r.invitation.expiresAt}</div></> : <span className="text-sand-400">Not sent</span> },
    { key: 'intake', header: 'Intake', render: (r) => { if (!r.intake) return <span className="text-sand-400">—</span>; const req = r.uploads.filter((u) => u.required); const o = openItems(r); return <div className="w-40"><div className="flex justify-between text-xs"><span>Questionnaire</span><span className="font-semibold">{r.intake.progress}%</span></div><div className="mt-1 h-1.5 rounded-full bg-sand-200"><div className="h-1.5 rounded-full bg-teal-600" style={{ width: `${r.intake.progress}%` }} /></div><div className="mt-1 text-xs text-sand-500">{req.filter((u) => u.status === 'uploaded').length}/{req.length} documents · {r.forms.filter((x) => x.status === 'signed').length}/{r.forms.length} forms</div>{o.length > 0 && <div className="mt-1 flex flex-wrap gap-1">{o.map((x) => <Pill key={x} tone={x === 'returned item' ? 'warn' : 'bad'} dot={false}>{x}</Pill>)}</div>}</div> } },
    { key: 'chart', header: 'Chart prep', render: (r) => { const [l, t] = agent(r); return <><Pill tone={toneFor(r.chartPrep)}>{r.chartPrep}</Pill>{l && <div className={`mt-1 text-xs ${t === 'bad' ? 'font-medium text-bad-700' : 'text-sand-500'}`}>AI Agent · {l}</div>}</> } },
    { key: 'next', header: 'Next step', render: (r) => <span className="text-sand-700">{nextStep(r, statusOf(r))}</span> },
    { key: 'note', header: noteScope === 'mine' ? 'My last note' : 'Latest note', render: (r) => { const n = latestNote(r.id, noteScope === 'mine' ? me.name : undefined); return n ? <div className="max-w-[220px]"><div className="line-clamp-2 text-sand-800">{n.text}</div><div className="mt-0.5 text-xs text-sand-500">{n.category} · {n.author} · {n.when.split(' · ')[0]}</div></div> : <span className="text-xs text-sand-400">{noteScope === 'mine' ? 'No note from you' : 'No notes'}</span> } },
    { key: 'last', header: 'Last activity', render: (r) => { const h = r.history[r.history.length - 1]; return h ? <WhoWhenWhy actor={h.actor} when={h.when} reason={h.action} /> : '—' } },
  ]
  const sel = (label: string, key: 'status' | 'chart' | 'advisor', opts: string[]) => (
    <label className="flex items-center gap-1.5 text-xs text-sand-500">{label}<select className="input w-auto py-1.5 pr-8 text-sm" value={f[key]} onChange={(e) => setF({ ...f, [key]: e.target.value })}><option>All</option>{opts.map((o) => <option key={o}>{o}</option>)}</select></label>
  )

  return (
    <>
      <PageHeader eyebrow="Patients" title="Patients" description="Everything about a patient starts here: invitation, intake review, chart prep and eCW status. Choose a view, filter, and open a patient for the full record."
        actions={<button className="btn-primary" onClick={() => nav('/staff/patients/new')}>+ Create patient & send invitation</button>} />
      <MetricBoard id="patients" metrics={metrics} defaults={defaults} />
      <Tabs value={view.key} onChange={(k) => setSp(k === 'all' ? {} : { view: k })} tabs={views.map((v) => ({ key: v.key, label: v.label, count: count(v.test) }))} />
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <label className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, ID, eCW number, phone…" className="input w-72 py-2 pl-9" /></label>
        {sel('Status', 'status', [...new Set(patients.map((p) => statusOf(p)))])}
        {sel('Chart prep', 'chart', chartOrder)}
        {sel('Advisor', 'advisor', [...new Set(patients.map((p) => p.advisor))])}
        <label className="flex items-center gap-1.5 text-sm text-sand-700"><input type="checkbox" checked={f.open} onChange={(e) => setF({ ...f, open: e.target.checked })} className="h-4 w-4 accent-[#141414]" />Open items only</label>
        {activeFilters > 0 && <button onClick={() => { setQ(''); setF({ status: 'All', chart: 'All', advisor: 'All', open: false }) }} className="btn-ghost px-2 py-1 text-xs"><X size={13} /> Clear {activeFilters}</button>}
        <div className="ml-auto flex items-center gap-2 text-xs text-sand-500">Notes column
          <div className="flex rounded-full border border-sand-300 bg-white p-0.5" role="group" aria-label="Which note to show">{(['mine', 'anyone'] as const).map((s) => <button key={s} onClick={() => setScope(s)} aria-pressed={noteScope === s} className={`rounded-full px-3 py-1 text-xs font-medium ${noteScope === s ? 'bg-sand-900 text-white' : 'text-sand-600'}`}>{s === 'mine' ? 'My last note' : 'Latest from anyone'}</button>)}</div>
        </div>
      </div>
      <QueueTable rows={rows} columns={columns} rowKey={(r) => r.id} rowTone={(r) => toneFor(view.key === 'all' ? statusOf(r) : r.chartPrep)} onRowClick={(r) => nav(`/staff/patients/${r.id}${view.key === 'chart' || view.key === 'exceptions' ? '?tab=chart' : view.key === 'intake' ? '?tab=intake' : ''}`)} empty="No patients match these filters." />
      <p className="mt-3 text-xs text-sand-500">{rows.length} of {patients.length} patients · memberships and payments are in the Registry and Payments screens.</p>
    </>
  )
}
