import { useNavigate } from 'react-router-dom'
import { PageHeader, Pill, QueueTable, Stat, toneFor, WhoWhenWhy, type Column } from '../../../components/ui'
import { patients } from '../../../mock/patients'
import type { Patient } from '../../../mock/types'

export default function IntakeReviewQueue() {
  const nav = useNavigate()
  const rows = patients.filter((p) => p.intake)
  const open = (p: Patient) => [
    ...(p.intake!.progress < 100 ? ['questionnaire'] : []),
    ...p.uploads.filter((u) => u.required && u.status !== 'uploaded').map((u) => u.status === 'returned' ? 'returned item' : 'missing document'),
    ...(p.forms.some((f) => f.status !== 'signed') ? ['unsigned forms'] : []),
  ]
  const columns: Column<Patient>[] = [
    { key: 'id', header: 'Patient', render: (r) => <div className="font-semibold text-sand-900">{r.id}</div>, width: '110px' },
    { key: 'q', header: 'Questionnaire', render: (r) => <div className="w-32"><div className="flex justify-between text-xs"><span>v{r.intake!.version}</span><span className="font-semibold">{r.intake!.progress}%</span></div><div className="mt-1 h-1.5 rounded-full bg-sand-200"><div className="h-1.5 rounded-full bg-teal-600" style={{ width: `${r.intake!.progress}%` }} /></div></div> },
    { key: 'docs', header: 'Documents', render: (r) => { const req = r.uploads.filter((u) => u.required); const ok = req.filter((u) => u.status === 'uploaded').length; return <span className={ok === req.length ? 'text-ok-700 font-medium' : ''}>{ok} / {req.length} required</span> } },
    { key: 'forms', header: 'Forms', render: (r) => { const ok = r.forms.filter((f) => f.status === 'signed').length; return <span className={ok === r.forms.length ? 'text-ok-700 font-medium' : ''}>{ok} / {r.forms.length} signed</span> } },
    { key: 'open', header: 'Open items', render: (r) => { const o = open(r); return o.length ? <div className="flex flex-wrap gap-1">{[...new Set(o)].map((x) => <Pill key={x} tone={x === 'returned item' ? 'warn' : 'bad'} dot={false}>{x}</Pill>)}</div> : <Pill tone="ok" dot={false}>None</Pill> } },
    { key: 'status', header: 'Chart prep status', render: (r) => <Pill tone={toneFor(r.chartPrep)}>{r.chartPrep}</Pill> },
    { key: 'last', header: 'Last activity', render: (r) => { const h = r.history[r.history.length - 1]; return <WhoWhenWhy actor={h.actor} when={h.when} reason={h.action} /> } },
  ]
  return (
    <>
      <PageHeader eyebrow="Intake · Patient advisor" title="Intake review" description="Submitted and in-progress intake packages. Review completeness, return items to the patient, and mark packages ready for chart prep." />
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Awaiting review" value={rows.filter((p) => p.chartPrep === 'Submitted').length} hint="submitted" tone="teal" />
        <Stat label="Waiting on patient" value={rows.filter((p) => p.uploads.some((u) => u.status === 'returned') || p.intake!.progress < 100).length} hint="returned / in progress" tone="warn" />
        <Stat label="Ready for chart prep" value={rows.filter((p) => p.chartPrep === 'Ready for chart prep').length} tone="ok" to="/staff/chart-prep" />
        <Stat label="Median time to review" value="1.2 d" hint="target ≤ 1 d" tone="ok" />
      </div>
      <QueueTable rows={rows} columns={columns} rowKey={(r) => r.id} rowTone={(r) => toneFor(r.chartPrep)} onRowClick={(r) => nav(`/staff/patients/${r.id}?tab=intake`)} />
    </>
  )
}
