import { useNavigate } from 'react-router-dom'
import { PageHeader, Pill, QueueTable, Stat, toneFor, WhoWhenWhy, type Column } from '../../../components/ui'
import { patients } from '../../../mock/patients'
import type { Patient } from '../../../mock/types'

const order = ['Exception', 'Ready for chart prep', 'Submitted', 'Reviewed for completeness', 'Placed in eCW', 'Awaiting intake']

export default function ChartPrepQueue() {
  const nav = useNavigate()
  const rows = [...patients].sort((a, b) => order.indexOf(a.chartPrep) - order.indexOf(b.chartPrep))
  const connector = (p: Patient) => p.chartPrep === 'Placed in eCW' ? ['Verified', 'ok'] : p.chartPrep === 'Exception' ? ['Needs attention', 'bad'] : p.chartPrep === 'Ready for chart prep' ? ['Queued · runs 6:00 AM', 'teal'] : ['—', 'neutral']
  const columns: Column<Patient>[] = [
    { key: 'id', header: 'Patient', render: (r) => <><div className="font-semibold text-sand-900">{r.id}</div><div className="text-xs text-sand-500">eCW {r.ecwId}</div></>, width: '130px' },
    { key: 'status', header: 'Chart prep status', render: (r) => <Pill tone={toneFor(r.chartPrep)}>{r.chartPrep}</Pill> },
    { key: 'q', header: 'Questionnaire', render: (r) => r.intake ? `v${r.intake.version} · ${r.intake.progress}%` : '—' },
    { key: 'docs', header: 'Documents', render: (r) => `${r.uploads.reduce((n, u) => n + u.files.length, 0)} files` },
    { key: 'conn', header: 'eCW connector', render: (r) => { const [l, t] = connector(r); return <Pill tone={t as 'ok'} dot={false}>{l}</Pill> } },
    { key: 'next', header: 'Next step', render: (r) => <span className="text-sand-600">{r.chartPrep === 'Ready for chart prep' ? 'Copy note → paste in eCW, or wait for connector' : r.chartPrep === 'Exception' ? 'Resolve in exception queue' : r.chartPrep === 'Placed in eCW' ? 'Review placement · close' : r.chartPrep === 'Submitted' ? 'Advisor completeness review' : 'Waiting on patient'}</span> },
    { key: 'last', header: 'Last activity', render: (r) => { const h = r.history[r.history.length - 1]; return h ? <WhoWhenWhy actor={h.actor} when={h.when} reason={h.action} /> : '—' } },
  ]
  return (
    <>
      <PageHeader eyebrow="Intake · Chart prep (Charlene)" title="Chart prep" description="Intake packages that need to be placed in eCW. The copy-and-paste path and the automated connector path both end with a verified note and PDF in the chart." />
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Ready for chart prep" value={patients.filter((p) => p.chartPrep === 'Ready for chart prep').length} hint="today" tone="teal" />
        <Stat label="Placed · awaiting my review" value={patients.filter((p) => p.chartPrep === 'Placed in eCW').length} tone="ok" />
        <Stat label="Exceptions" value={patients.filter((p) => p.chartPrep === 'Exception').length} hint="no auto-retry" tone="bad" to="/staff/ecw-exceptions" />
        <Stat label="Connector last run" value="6:02 AM" hint="Oct 7 · healthy" tone="ok" />
      </div>
      <QueueTable rows={rows} columns={columns} rowKey={(r) => r.id} rowTone={(r) => toneFor(r.chartPrep)} onRowClick={(r) => nav(`/staff/chart-prep/${r.id}`)} />
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-sand-500">
        <span className="self-center">Status flow:</span>
        {['Awaiting intake', 'Submitted', 'Reviewed for completeness', 'Ready for chart prep', 'Placed in eCW'].map((s, i, a) => <span key={s} className="flex items-center gap-2"><Pill tone={toneFor(s)} dot={false}>{s}</Pill>{i < a.length - 1 && '→'}</span>)}
        <span className="self-center">or</span><Pill tone="bad" dot={false}>Exception</Pill>
      </div>
    </>
  )
}
