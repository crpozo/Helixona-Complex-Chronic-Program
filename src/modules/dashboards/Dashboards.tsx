import { Link } from 'react-router-dom'
import { Card, Notice, PageHeader, Pill, Stat, ToConfirm } from '../../components/ui'

const tiles = [
  { label: 'Intake completion', value: '3 / 5', hint: 'median 4.2 d', tone: 'teal', to: '/staff/intake-review' },
  { label: 'Chart prep', value: '1 ready', hint: '1 exception', tone: 'bad', to: '/staff/chart-prep' },
  { label: 'Open alerts', value: 4, hint: '1 escalated', tone: 'bad', to: '/staff/alerts' },
  { label: 'Booking exceptions', value: 2, hint: '1 request', tone: 'warn', to: '/staff/calendar' },
  { label: 'Contract completion', value: '1 / 2', hint: '1 pending', tone: 'warn', to: '/staff/registry' },
  { label: 'Payment failures', value: 2, hint: '1 hold proposed', tone: 'bad', to: '/staff/payments' },
  { label: 'Active members', value: 2, hint: 'target 3–5', tone: 'ok', to: '/staff/registry' },
  { label: 'Month 9 reviews', value: 1, hint: 'due Oct 9', tone: 'warn', to: '/staff/registry' },
] as const

const defects = [
  { id: 'DEF-014', sev: 'High', title: 'PDF read-back fails when Patient Docs category is renamed', owner: 'Carlos', status: 'In progress', workaround: 'Charlene uploads PDF manually · close as done manually' },
  { id: 'DEF-012', sev: 'Medium', title: 'Survey reminder sent outside business-hour window (DST)', owner: 'Carlos', status: 'Fixed · verify', workaround: 'None needed' },
  { id: 'DEF-011', sev: 'Low', title: 'Invitation email preview wraps merge field on iOS Mail', owner: 'Ana', status: 'Open', workaround: 'Cosmetic' },
]

export default function Dashboards() {
  const funnel = [['Inquiries (30 d)', 12], ['Interviews', 6], ['Accepted for Month 0', 4], ['Month 0 scheduled / in progress', 3], ['Program offered', 1], ['Active members', 2]] as const
  const weeks = [['Sep 8', 12, 3], ['Sep 15', 14, 2], ['Sep 22', 16, 4], ['Sep 29', 18, 3], ['Oct 6', 21, 5]] as const
  const max = 22
  return (
    <>
      <PageHeader eyebrow="System · Program admin (Cassandra)" title="Dashboards" description="Operational view of the pilot. Every tile opens the queue behind it. Exports are available to program admins and are logged." meta={<ToConfirm>which numbers Cassandra wants on the weekly report</ToConfirm>} actions={<button className="btn-secondary">Export weekly report (logged)</button>} />
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">{tiles.map((t) => <Stat key={t.label} label={t.label} value={t.value} hint={t.hint} tone={t.tone} to={t.to} />)}</div>
      <div className="grid gap-5 xl:grid-cols-3">
        <Card title="Enrollment funnel · last 30 days" subtitle="From website inquiry to active membership.">
          <ul className="space-y-2">{funnel.map(([l, v]) => <li key={l} className="text-sm"><div className="flex justify-between"><span className="text-sand-700">{l}</span><span className="font-semibold">{v}</span></div><div className="mt-1 h-2 rounded-full bg-sand-100"><div className="h-2 rounded-full bg-teal-500" style={{ width: `${(v / 12) * 100}%` }} /></div></li>)}</ul>
        </Card>
        <Card title="Surveys & alerts by week" subtitle="Surveys answered (gold) and alerts created (dark).">
          <svg viewBox="0 0 320 160" className="w-full" role="img" aria-label="Surveys and alerts by week">
            {weeks.map(([w, s, a], i) => { const x = 20 + i * 60; return (<g key={w}>
              <rect x={x} y={130 - (s / max) * 110} width="20" height={(s / max) * 110} fill="var(--color-teal-400)" />
              <rect x={x + 24} y={130 - (a / max) * 110} width="20" height={(a / max) * 110} fill="var(--color-teal-700)" />
              <text x={x + 22} y="146" textAnchor="middle" fontSize="10" fill="var(--color-sand-600)">{w}</text>
              <text x={x + 10} y={126 - (s / max) * 110} textAnchor="middle" fontSize="10" fill="var(--color-sand-700)">{s}</text>
              <text x={x + 34} y={126 - (a / max) * 110} textAnchor="middle" fontSize="10" fill="var(--color-sand-700)">{a}</text>
            </g>) })}
            <line x1="14" x2="310" y1="130" y2="130" stroke="var(--color-sand-300)" />
          </svg>
          <div className="mt-1 text-xs text-sand-500">Response rate 89% · median time to acknowledge 2.1 h</div>
        </Card>
        <Card title="eCW connector · 7 days" subtitle="Every write is read back and verified.">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-ok-100 p-3"><div className="text-2xl font-semibold text-ok-700">41</div><div className="text-xs text-ok-700">verified</div></div>
            <div className="rounded-xl bg-bad-100 p-3"><div className="text-2xl font-semibold text-bad-700">2</div><div className="text-xs text-bad-700">exceptions</div></div>
            <div className="rounded-xl bg-sand-100 p-3"><div className="text-2xl font-semibold text-sand-700">6:02</div><div className="text-xs text-sand-600">last run (AM)</div></div>
          </div>
          <div className="mt-3 text-xs text-sand-600">J2 intake notes 9 · J3 booking mirrors 27 · J4 schedule reads 7 · <Link to="/staff/ecw-exceptions" className="text-teal-700 underline">open exceptions</Link></div>
        </Card>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card title="Pilot defects" subtitle="Issue log with owner, severity, workaround and resolution status (acceptance criteria §16)." padded={false}>
            <table className="w-full text-sm"><thead><tr className="bg-sand-50 text-left"><th className="px-5 py-2 eyebrow">ID</th><th className="px-3 py-2 eyebrow">Severity</th><th className="px-3 py-2 eyebrow">Issue</th><th className="px-3 py-2 eyebrow">Owner</th><th className="px-3 py-2 eyebrow">Status</th><th className="px-3 py-2 eyebrow">Workaround</th></tr></thead><tbody>
              {defects.map((d) => <tr key={d.id} className="border-t border-sand-100"><td className="px-5 py-2 font-medium">{d.id}</td><td className="px-3 py-2"><Pill tone={d.sev === 'High' ? 'bad' : d.sev === 'Medium' ? 'warn' : 'neutral'}>{d.sev}</Pill></td><td className="px-3 py-2">{d.title}</td><td className="px-3 py-2">{d.owner}</td><td className="px-3 py-2"><Pill tone={/fixed/i.test(d.status) ? 'ok' : /progress/i.test(d.status) ? 'teal' : 'warn'}>{d.status}</Pill></td><td className="px-3 py-2 text-xs text-sand-600">{d.workaround}</td></tr>)}
            </tbody></table>
          </Card>
        </div>
        <Card title="Audit & security" subtitle="Technical admin (Carlos)">
          <ul className="space-y-2 text-sm text-sand-700">
            <li className="flex justify-between"><span>Staff sign-ins with second factor</span><Pill tone="ok">100%</Pill></li>
            <li className="flex justify-between"><span>Patient-record access events · 7 d</span><span className="font-medium">312</span></li>
            <li className="flex justify-between"><span>Configuration changes · 7 d</span><span className="font-medium">6</span></li>
            <li className="flex justify-between"><span>Exports containing patient data · 30 d</span><span className="font-medium">2 (logged)</span></li>
            <li className="flex justify-between"><span>Last backup restore test</span><span className="font-medium">Sep 28</span></li>
          </ul>
          <div className="mt-3"><Notice tone="info">Full audit export and user/role management live in Technical admin (not mocked separately).</Notice></div>
        </Card>
      </div>
    </>
  )
}
