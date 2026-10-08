import { useParams } from 'react-router-dom'
import { Breadcrumb, Card, Notice, PageHeader, Pill, Row, VersionTag } from '../../../components/ui'
import { patientById } from '../../../mock/patients'
import { alerts, levelTone, scoreSeries } from '../../../mock/program'

export default function PatientLongitudinal() {
  const { id = 'P-0041' } = useParams()
  const p = patientById(id)
  const series = scoreSeries[id] ?? scoreSeries['P-0041']
  const pAlerts = alerts.filter((a) => a.patientId === id)
  return (
    <>
      <Breadcrumb items={[{ label: 'Alert queue', to: '/staff/alerts' }, { label: id }]} />
      <PageHeader eyebrow={`${id} · eCW ${p?.ecwId ?? '—'}`} title={p ? `${p.firstName} ${p.lastName}` : id} description="Scores over time from every survey and crash report, with alerts and treatments marked. Same scale (0–10) across surveys so trends are comparable."
        meta={<><VersionTag>Weekly core v1</VersionTag><VersionTag>Post-treatment check-in v2</VersionTag><span>Physician: Dr. D.</span></>} />
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <Card title="Scores over time" subtitle="Energy and sleep: higher is better. Pain: lower is better.">
            <LineChart series={series} />
          </Card>
          <Card title="Survey history" padded={false}>
            <table className="w-full text-sm">
              <thead><tr className="bg-sand-50 text-left"><th className="px-5 py-2 eyebrow">Date</th><th className="px-4 py-2 eyebrow">Energy</th><th className="px-4 py-2 eyebrow">Pain</th><th className="px-4 py-2 eyebrow">Sleep</th><th className="px-4 py-2 eyebrow">Event</th></tr></thead>
              <tbody>{[...series].reverse().map((s) => <tr key={s.date} className="border-t border-sand-100"><td className="px-5 py-2 font-medium">{s.date}</td><td className="px-4 py-2">{s.energy}</td><td className="px-4 py-2">{s.pain}</td><td className="px-4 py-2">{s.sleep}</td><td className="px-4 py-2 text-sand-500">{s.event ?? '—'}</td></tr>)}</tbody>
            </table>
          </Card>
        </div>
        <div className="space-y-5">
          <Card title="Alerts for this patient">
            {pAlerts.length === 0 && <p className="help">No alerts.</p>}
            <div className="space-y-3">{pAlerts.map((a) => <div key={a.id} className="border-b border-sand-100 pb-3 last:border-0"><div className="flex items-center justify-between gap-2"><Pill tone={levelTone[a.level]}>{a.level}</Pill><span className="text-xs text-sand-500">{a.createdAt}</span></div><div className="mt-1 text-sm text-sand-800">{a.summary}</div><div className="text-xs text-sand-500">{a.id} · {a.status} · {a.assignee}</div></div>)}</div>
          </Card>
          <Card title="Care context">
            <Row label="Stage">Month 0 in progress</Row>
            <Row label="Recent sessions">Nano bath Oct 5 · Laser Sep 22</Row>
            <Row label="Patient override">AR-06 · crash threshold ≥ 6</Row>
            <Row label="Surveys sent / answered">9 / 8</Row>
          </Card>
          <Notice tone="plum" title="Charting">Follow-up notes can be copied to eCW from the alert; exact placement to be refined after the pilot (ALT-08).</Notice>
        </div>
      </div>
    </>
  )
}

function LineChart({ series }: { series: { date: string; energy: number; pain: number; sleep: number; event?: string }[] }) {
  const W = 640, H = 220, padL = 28, padR = 40, padT = 12, padB = 32
  const x = (i: number) => padL + (i / (series.length - 1)) * (W - padL - padR)
  const y = (v: number) => padT + (1 - v / 10) * (H - padT - padB)
  const path = (k: 'energy' | 'pain' | 'sleep') => series.map((s, i) => `${i ? 'L' : 'M'}${x(i)},${y(s[k])}`).join(' ')
  const lines: { k: 'energy' | 'pain' | 'sleep'; color: string; label: string }[] = [{ k: 'energy', color: 'var(--color-teal-500)', label: 'Energy' }, { k: 'pain', color: 'var(--color-bad-600)', label: 'Pain' }, { k: 'sleep', color: 'var(--color-info-600)', label: 'Sleep' }]
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Scores over time">
        {[0, 5, 10].map((v) => <g key={v}><line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="var(--color-sand-200)" /><text x={padL - 6} y={y(v) + 4} textAnchor="end" fontSize="11" fill="var(--color-sand-500)">{v}</text></g>)}
        {series.map((s, i) => s.event && <g key={i}><line x1={x(i)} x2={x(i)} y1={padT} y2={H - padB} stroke="var(--color-sand-300)" strokeDasharray="3 3" /><text x={x(i)} y={H - padB + 26} textAnchor="middle" fontSize="10" fill="var(--color-sand-500)">{s.event}</text></g>)}
        {lines.map((l) => <path key={l.k} d={path(l.k)} fill="none" stroke={l.color} strokeWidth="2.2" strokeLinejoin="round" />)}
        {lines.map((l) => series.map((s, i) => <circle key={l.k + i} cx={x(i)} cy={y(s[l.k])} r="3.5" fill="white" stroke={l.color} strokeWidth="2" />))}
        {series.map((s, i) => <text key={s.date} x={x(i)} y={H - padB + 14} textAnchor="middle" fontSize="11" fill="var(--color-sand-600)">{s.date}</text>)}
      </svg>
      <div className="mt-2 flex gap-4 text-xs text-sand-600">{lines.map((l) => <span key={l.k} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: l.color }} />{l.label}</span>)}</div>
    </div>
  )
}
