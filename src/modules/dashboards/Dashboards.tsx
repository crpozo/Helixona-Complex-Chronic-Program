import { Link } from 'react-router-dom'
import { Bot, CalendarCheck, ClipboardList, CreditCard, FileSignature, Phone, Siren, Stethoscope, Users } from 'lucide-react'
import { ToConfirm } from '../../components/ui'
import { currentUser, notify } from '../../mock/store'

/** Program dashboard. A dark "daily plan" board: today's goals, three headline widgets, the day's timeline,
 *  and the operational numbers behind the pilot. Every widget opens the queue behind it. */
const gold = '#d4b77a'
const glass = 'rounded-[28px] border border-sand-200 bg-white'

const tiles = [
  { label: 'Chart prep', value: '1 ready', hint: '1 exception', to: '/staff/patients?view=chart', Icon: ClipboardList },
  { label: 'Booking exceptions', value: '2', hint: '1 request', to: '/staff/calendar', Icon: CalendarCheck },
  { label: 'Contract completion', value: '1 / 2', hint: '1 pending', to: '/staff/registry', Icon: FileSignature },
  { label: 'Payment failures', value: '2', hint: '1 hold proposed', to: '/staff/payments', Icon: CreditCard },
  { label: 'Active members', value: '2', hint: 'target 3–5', to: '/staff/registry', Icon: Users },
  { label: 'Month 9 reviews', value: '1', hint: 'due Oct 9', to: '/staff/registry', Icon: Stethoscope },
]
/** Hour-of-day bars: check-ins answered (tall, slate) and alerts created (short, gold). */
const hours: [string, number, number][] = [['8', 9, 1], ['9', 7, 0], ['10', 5, 2], ['11', 6, 1], ['12', 3, 0], ['1', 8, 2], ['2', 6, 3], ['3', 5, 1], ['4', 8, 2], ['5', 6, 0]]
const timeline: { from: number; to: number; row: number; title: string; tag: string; dot: string; to_: string; Icon: typeof Phone }[] = [
  { from: 8, to: 11, row: 0, title: 'Review alerts', tag: 'High priority', dot: '#e06a8c', to_: '/staff/alerts', Icon: Siren },
  { from: 10.5, to: 13.7, row: 1, title: 'Admissions meeting', tag: 'Important', dot: '#4fd1a1', to_: '/staff/inquiries', Icon: Users },
  { from: 11.6, to: 14.8, row: 0, title: 'Interview · Jordan B.', tag: 'Scheduled', dot: gold, to_: '/staff/interviews', Icon: Phone },
  { from: 14.6, to: 18, row: 1, title: 'Payments follow-up', tag: 'Low priority', dot: '#5b8def', to_: '/staff/payments', Icon: CreditCard },
]
const defects = [
  { id: 'DEF-014', sev: 'High', title: 'PDF read-back fails when Patient Docs category is renamed', owner: 'Carlos', status: 'In progress' },
  { id: 'DEF-012', sev: 'Medium', title: 'Survey reminder sent outside business-hour window (DST)', owner: 'Carlos', status: 'Fixed · verify' },
  { id: 'DEF-011', sev: 'Low', title: 'Invitation email preview wraps merge field on iOS Mail', owner: 'Ana', status: 'Open' },
]
const funnel: [string, number][] = [['Inquiries (30 d)', 12], ['Interviews', 6], ['Accepted for A&P', 4], ['A&P scheduled / in progress', 3], ['Program offered', 1], ['Active members', 2]]
const START = 8, END = 18

export default function Dashboards() {
  const me = currentUser()
  const maxH = Math.max(...hours.map((h) => h[1]))
  return (
    <div className="text-sand-900">
      <div className="mx-auto max-w-[1340px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><h1 className="font-display text-[28px] font-semibold leading-tight">Dashboard</h1><p className="mt-1 text-[15px] text-sand-600">Thursday, Oct 9 · {me.name.split(' · ')[0]}</p></div>
          <button onClick={() => notify('Weekly report exported · logged with your name and time')} className="btn-secondary">Export weekly report</button>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-4">
          <Link to="/staff/alerts" className={`${glass} relative flex h-[250px] flex-col justify-between overflow-hidden p-6 transition-transform hover:-translate-y-0.5`} style={{ backgroundImage: 'radial-gradient(260px 200px at 88% 6%, rgba(255,214,140,0.95), rgba(212,150,60,0.35) 35%, transparent 70%), linear-gradient(160deg, #1b2230, #0b0c10 70%)' }}>
            <div className="flex items-start justify-between text-white"><span className="text-xl">Open alerts</span><Siren size={20} className="text-black/70" /></div>
            <div className="text-white"><div className="text-[54px] font-light leading-none">4</div><div className="mt-1 text-sm text-white/60">1 escalated · oldest 2 h 10 m</div></div>
          </Link>
          <Link to="/staff/patients?view=docs" className="relative flex h-[250px] flex-col justify-between overflow-hidden rounded-[28px] p-6 text-white transition-transform hover:-translate-y-0.5" style={{ backgroundImage: 'radial-gradient(220px 260px at 70% 40%, rgba(255,236,170,0.95), transparent 70%), repeating-linear-gradient(90deg, rgba(255,255,255,0.10) 0 2px, transparent 2px 9px), linear-gradient(120deg, #b4630d, #f0a92b 55%, #c9770f)' }}>
            <span className="text-xl">Intake completion</span>
            <div><div className="text-[54px] font-light leading-none">60%</div><div className="mt-1 text-sm text-white/90">3 of 5 complete · median 4.2 days</div></div>
          </Link>
          <div className={`${glass} relative h-[250px] overflow-hidden p-6 lg:col-span-2`} style={{ backgroundImage: 'radial-gradient(520px 160px at 55% -10%, rgba(140,160,190,0.18), transparent 70%)' }}>
            <div className="flex items-start justify-between"><span className="text-[26px]">Check-ins & alerts today</span><span className="rounded-full bg-sand-100 px-4 py-1.5 text-sm text-sand-500">Response rate: <span className="font-semibold text-sand-900">89%</span></span></div>
            <div className="absolute inset-x-6 bottom-0 flex h-[150px] items-end gap-2" role="img" aria-label="Check-ins answered and alerts created by hour">
              <div className="pointer-events-none absolute inset-x-0 top-[52px] border-t border-dashed border-sand-200" />
              <span className="absolute left-0 top-[36px] z-10 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black">Peak: 8 am</span>
              {hours.map(([h, c, a]) => <div key={h} className="relative flex flex-1 items-end justify-center gap-1">
                <div className="w-1/2 max-w-[46px] rounded-t-[14px] bg-gradient-to-b from-[#7d8aa3] to-[#c9d1de]" style={{ height: `${(c / maxH) * 130}px` }} title={`${c} check-ins at ${h}`} />
                {a > 0 && <div className="w-1/2 max-w-[46px] rounded-t-[14px] bg-gradient-to-b from-[#f5c15a] to-[#6e4a12]" style={{ height: `${a * 22}px` }} title={`${a} alerts at ${h}`} />}
              </div>)}
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{tiles.map(({ label, value, hint, to, Icon }) => (
          <Link key={label} to={to} className="rounded-2xl border border-sand-200 bg-white p-4 transition-colors hover:bg-white">
            <div className="flex items-center justify-between text-sand-500"><span className="text-xs">{label}</span><Icon size={15} /></div>
            <div className="mt-2 text-2xl font-light">{value}</div><div className="text-xs text-sand-400">{hint}</div>
          </Link>))}</div>

        <div className="mt-6 rounded-[32px] bg-white p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4"><h2 className="text-[26px]">Daily timeline</h2><span className="h-6 w-px bg-sand-100" /><span className="text-sand-700">{timeline.length} tasks for today</span></div>
            <Link to="/staff/tasks" className="border-b border-sand-900 pb-0.5 text-sm font-medium">Add a task</Link>
          </div>
          <div className="mt-6 overflow-x-auto">
            <div className="relative min-w-[1040px] pr-12">
              <div className="flex justify-between text-sm text-sand-400">{Array.from({ length: END - START + 1 }, (_, k) => START + k).map((h) => <span key={h} className="w-0 whitespace-nowrap">{h % 12 || 12} {h < 12 ? 'AM' : 'PM'}</span>)}</div>
              <div className="relative mt-3 h-[170px]">
                {Array.from({ length: END - START + 1 }, (_, k) => <span key={k} className="absolute inset-y-0 w-px bg-white" style={{ left: `${(k / (END - START)) * 100}%` }} />)}
                {timeline.map((t) => <Link key={t.title} to={t.to_} className="absolute flex h-[58px] items-center justify-between gap-3 rounded-full border border-sand-200 bg-white shadow-sm pl-5 pr-2 transition-colors hover:bg-sand-50" style={{ left: `${((t.from - START) / (END - START)) * 100}%`, width: `${((t.to - t.from) / (END - START)) * 100}%`, top: t.row * 84 + 10 }}>
                  <span className="flex min-w-0 items-center gap-3"><t.Icon size={17} className="shrink-0 text-sand-500" /><span className="truncate text-[15px]">{t.title}</span></span>
                  <span className="flex shrink-0 items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm text-sand-700"><span className="h-2 w-2 rounded-full" style={{ background: t.dot }} />{t.tag}</span>
                </Link>)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-3">
          <div className={`${glass} p-6`}>
            <h3 className="text-lg">Enrollment funnel · last 30 days</h3>
            <ul className="mt-4 space-y-3">{funnel.map(([l, v]) => <li key={l} className="text-sm"><div className="flex justify-between"><span className="text-sand-500">{l}</span><span>{v}</span></div><div className="mt-1.5 h-2 rounded-full bg-sand-100"><div className="h-2 rounded-full bg-gradient-to-r from-[#8a6d1f] to-[#f5c15a]" style={{ width: `${(v / 12) * 100}%` }} /></div></li>)}</ul>
          </div>
          <div className={`${glass} p-6`}>
            <div className="flex items-center justify-between"><h3 className="text-lg">AI Agent · 7 days</h3><Bot size={18} className="text-sand-500" /></div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">{([['41', 'verified', '#4fd1a1'], ['2', 'exceptions', '#e06a8c'], ['6:02', 'last run (AM)', '#121212']] as const).map(([n, l, c]) => <div key={l} className="rounded-2xl bg-white p-3"><div className="text-2xl font-light" style={{ color: c }}>{n}</div><div className="text-xs text-sand-500">{l}</div></div>)}</div>
            <p className="mt-4 text-sm text-sand-500">Intake notes 9 · booking copies 27 · schedule reads 7. Every write is read back and verified.</p>
            <Link to="/staff/ecw-exceptions" className="mt-3 inline-block border-b border-sand-200 pb-0.5 text-sm">Open exceptions</Link>
          </div>
          <div className={`${glass} p-6`}>
            <h3 className="text-lg">Audit & security</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-sand-700">{[['Staff sign-ins with second step', '100%'], ['Patient-record access · 7 d', '312'], ['Configuration changes · 7 d', '6'], ['Exports with patient data · 30 d', '2 (logged)'], ['Last backup restore test', 'Sep 28']].map(([l, v]) => <li key={l} className="flex justify-between gap-3"><span>{l}</span><span className="text-white">{v}</span></li>)}</ul>
          </div>
        </div>

        <div className={`${glass} mt-5 overflow-hidden`}>
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"><h3 className="text-lg">Pilot defects</h3></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-sm"><tbody>{defects.map((d) => <tr key={d.id} className="border-t border-sand-200"><td className="whitespace-nowrap px-6 py-3 text-sand-500">{d.id}</td><td className="px-3 py-3"><span className="flex items-center gap-2 whitespace-nowrap"><span className="h-2 w-2 rounded-full" style={{ background: d.sev === 'High' ? '#e06a8c' : d.sev === 'Medium' ? gold : '#5b8def' }} />{d.sev}</span></td><td className="px-3 py-3 text-sand-700">{d.title}</td><td className="px-3 py-3 text-sand-500">{d.owner}</td><td className="whitespace-nowrap px-6 py-3 text-right text-sand-700">{d.status}</td></tr>)}</tbody></table></div>
        </div>
        <div className="mt-4"><ToConfirm>which numbers Cassandra wants on the weekly report, and which widgets each role sees</ToConfirm></div>
      </div>
    </div>
  )
}
