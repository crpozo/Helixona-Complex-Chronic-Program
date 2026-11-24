import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { PageHeader, Pill, QueueTable, Tabs, toneFor, type Column } from '../../../components/ui'
import { MetricBoard, type Metric } from '../../../components/MetricBoard'
import { Avatar } from '../../../components/Avatar'
import { planFor } from '../../../mock/roadmap'
import { ageOf, demographicsFor } from '../../../mock/demographics'
import { currentUser, inJourneyOrder, isPatientStatus, latestNote, statusOf, useStore } from '../../../mock/store'
import { patients as everyone } from '../../../mock/patients'
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
  { key: 'docs', label: 'Documentation', test: (p: Patient) => !p.intake || p.intake.progress < 100 || p.chartPrep === 'Submitted' || p.uploads.some((u) => u.required && u.status !== 'uploaded') },
  { key: 'chart', label: 'Chart prep', test: (p: Patient) => ['Ready for chart prep', 'Placed in eCW', 'Exception', 'Reviewed for completeness', 'Submitted'].includes(p.chartPrep) },
  { key: 'exceptions', label: 'eCW exceptions', test: (p: Patient) => p.chartPrep === 'Exception' },
] as const

export default function PatientsList() {
  useStore()
  const nav = useNavigate()
  // People still completing their documentation are listed under Inquiries, not here.
  const patients = everyone.filter((p) => isPatientStatus(statusOf(p)))
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
    .filter((p) => !q || `${p.firstName} ${p.lastName} ${p.id} ${p.ecwId} ${p.email} ${p.phone} ${p.city} ${demographicsFor(p.id)?.street ?? ''}`.toLowerCase().includes(q.toLowerCase()))
    .filter((p) => f.status === 'All' || statusOf(p) === f.status)
    .filter((p) => f.chart === 'All' || p.chartPrep === f.chart)
    .filter((p) => f.advisor === 'All' || p.advisor === f.advisor)
    .filter((p) => !f.open || openItems(p).length > 0)
    .sort((a, b) => (view.key === 'chart' || view.key === 'exceptions' ? chartOrder.indexOf(a.chartPrep) - chartOrder.indexOf(b.chartPrep) : 0)),
  [view, q, f, patients.length]) // eslint-disable-line react-hooks/exhaustive-deps
  const activeFilters = (f.status !== 'All' ? 1 : 0) + (f.chart !== 'All' ? 1 : 0) + (f.advisor !== 'All' ? 1 : 0) + (f.open ? 1 : 0) + (q ? 1 : 0)

  const metrics: Metric[] = [
    { key: 'total', label: 'Patients', value: patients.length, hint: 'in care', tone: 'neutral', to: '/staff/patients' },
    { key: 'ready', label: 'Ready for chart prep', value: count((p) => p.chartPrep === 'Ready for chart prep'), hint: 'today', tone: 'teal', to: '/staff/patients?view=chart' },
    { key: 'placed', label: 'Placed · awaiting review', value: count((p) => p.chartPrep === 'Placed in eCW'), tone: 'ok', to: '/staff/patients?view=chart' },
    { key: 'exceptions', label: 'eCW exceptions', value: count((p) => p.chartPrep === 'Exception'), hint: 'needs a person', tone: 'bad', to: '/staff/patients?view=exceptions' },
    { key: 'amp', label: 'In A&P', value: count((_, s) => /\bAMP\b/.test(s)), tone: 'teal' },
    { key: 'docs', label: 'Completing documentation', value: count(views[1].test), hint: 'questionnaire or items', tone: 'warn', to: '/staff/patients?view=docs' },
    { key: 'agentRun', label: 'AI Agent last run', value: '6:02 AM', hint: 'Oct 7 · healthy', tone: 'ok', to: '/staff/ecw-exceptions' },
    { key: 'median', label: 'Median time to review', value: '1.2 d', hint: 'target ≤ 1 d', tone: 'ok' },
  ]
  const defaults = me.role === 'charlene' ? ['ready', 'placed', 'exceptions', 'agentRun'] : ['total', 'ready', 'exceptions', 'docs']

  const columns: Column<Patient>[] = [
    { key: 'who', header: 'Patient', render: (r) => { const n = `${r.firstName} ${r.lastName}`; return <div className="flex items-center gap-3"><span className="hidden min-[1180px]:block"><Avatar name={n} size={38} /></span><div className="min-w-0"><div className="whitespace-nowrap text-[15px] font-semibold text-sand-900">{n}</div><div className="whitespace-nowrap text-xs text-sand-500">{ageOf(r.dob)} yrs · {r.city}</div></div></div> } },
    { key: 'status', header: 'Status', render: (r) => { const s = statusOf(r); return <><Pill tone={toneFor(s)} className="whitespace-nowrap">{s}</Pill><div className="mt-1 whitespace-nowrap text-xs text-sand-500">Roadmap step {planFor(r.id).stage} of 7</div></> } },
    { key: 'intake', header: 'Intake', render: (r) => {
      if (!r.intake) return r.invitation ? <Pill tone={invTone(r.invitation.state)} dot={false} className="whitespace-nowrap capitalize">Invitation {r.invitation.state}</Pill> : <span className="whitespace-nowrap text-sm text-sand-400">Invitation not sent</span>
      const req = r.uploads.filter((u) => u.required); const o = openItems(r)
      return <div className="w-28 min-[1250px]:w-36"><div className="flex items-center gap-2"><div className="h-1.5 flex-1 rounded-full bg-sand-200"><div className="h-1.5 rounded-full bg-teal-600" style={{ width: `${r.intake.progress}%` }} /></div><span className="w-9 text-right text-xs font-semibold text-sand-800">{r.intake.progress}%</span></div><div className="mt-1 flex items-center justify-between gap-2 whitespace-nowrap text-xs text-sand-500"><span>{req.filter((u) => u.status === 'uploaded').length}/{req.length} docs · {r.forms.filter((x) => x.status === 'signed').length}/{r.forms.length} forms</span>{o.length > 0 && <span title={o.join(', ')} className="font-medium text-bad-700">{o.length} open</span>}</div></div> } },
    { key: 'chart', header: 'Chart prep', render: (r) => { const [l, t] = agent(r); return <><Pill tone={toneFor(r.chartPrep)} className="whitespace-nowrap">{r.chartPrep}</Pill>{l && <div className={`mt-1 whitespace-nowrap text-xs ${t === 'bad' ? 'font-medium text-bad-700' : 'text-sand-500'}`}>AI Agent · {l}</div>}</> } },
    { key: 'next', header: 'Next step', className: 'hidden min-[1600px]:table-cell', render: (r) => <div className="w-[170px] text-sm leading-snug text-sand-800">{nextStep(r, statusOf(r))}</div> },
    { key: 'note', header: noteScope === 'mine' ? 'My last note' : 'Latest note', className: 'hidden min-[1400px]:table-cell', render: (r) => { const n = latestNote(r.id, noteScope === 'mine' ? me.name : undefined); return n ? <div className="w-[210px]"><div className="line-clamp-2 text-sm leading-snug text-sand-800">{n.text}</div><div className="mt-0.5 truncate text-xs text-sand-500">{n.author} · {n.when.split(' · ')[0].replace(', 2026', '')} · {n.category}</div></div> : <span className="whitespace-nowrap text-xs text-sand-400">{noteScope === 'mine' ? 'No note from you' : 'No notes'}</span> } },
  ]
  const sel = (label: string, key: 'status' | 'chart' | 'advisor', opts: string[]) => (
    <label className="flex items-center gap-2 whitespace-nowrap text-xs text-sand-500">{label}<select className="input w-auto max-w-[190px] py-2 text-sm" value={f[key]} onChange={(e) => setF({ ...f, [key]: e.target.value })}><option>All</option>{opts.map((o) => <option key={o}>{o}</option>)}</select></label>
  )

  return (
    <>
      <PageHeader eyebrow="Patients" title="Patients" description="People accepted into care."
        actions={<button className="btn-primary" onClick={() => nav('/staff/patients/new')}>+ Create patient & send invitation</button>} />
      <MetricBoard id="patients" metrics={metrics} defaults={defaults} />
      <Tabs value={view.key} onChange={(k) => setSp(k === 'all' ? {} : { view: k })} tabs={views.map((v) => ({ key: v.key, label: v.label, count: count(v.test) }))} />
      <div className="card mb-3 flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3">
        <label className="relative min-w-[240px] flex-1"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, address, phone or eCW number" className="input w-full py-2 pl-9" /></label>
        {sel('Status', 'status', inJourneyOrder(patients.map((p) => statusOf(p))))}
        {sel('Chart prep', 'chart', chartOrder)}
        {sel('Advisor', 'advisor', [...new Set(patients.map((p) => p.advisor))])}
        <label className="flex items-center gap-2 whitespace-nowrap text-sm text-sand-700"><input type="checkbox" checked={f.open} onChange={(e) => setF({ ...f, open: e.target.checked })} className="h-4 w-4 accent-[#141414]" />Open items only</label>
        {activeFilters > 0 && <button onClick={() => { setQ(''); setF({ status: 'All', chart: 'All', advisor: 'All', open: false }) }} className="btn-ghost whitespace-nowrap px-2 py-1 text-xs"><X size={13} /> Clear {activeFilters}</button>}
      </div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm text-sand-600"><strong className="font-semibold text-sand-900">{rows.length}</strong> of {patients.length} patients</span>
        <div className="flex items-center gap-2 text-xs text-sand-500">Notes shown
          <div className="flex rounded-full border border-sand-300 bg-white p-0.5" role="group" aria-label="Which note to show">{(['mine', 'anyone'] as const).map((s) => <button key={s} onClick={() => setScope(s)} aria-pressed={noteScope === s} className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${noteScope === s ? 'bg-sand-900 text-white' : 'text-sand-600'}`}>{s === 'mine' ? 'My last note' : 'Latest from anyone'}</button>)}</div>
        </div>
      </div>
      <QueueTable rows={rows} columns={columns} rowKey={(r) => r.id} rowTone={(r) => toneFor(view.key === 'all' ? statusOf(r) : r.chartPrep)} onRowClick={(r) => nav(`/staff/patients/${r.id}${view.key === 'chart' || view.key === 'exceptions' ? '?tab=chart' : view.key === 'docs' ? '?tab=intake' : ''}`)} empty="No patients match these filters." />
    </>
  )
}
