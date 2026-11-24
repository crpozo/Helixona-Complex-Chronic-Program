import { Link } from 'react-router-dom'
import { AlertTriangle, ChevronRight } from 'lucide-react'
import { Card, Pill, ToConfirm } from '../../components/ui'
import { allTasks, currentUser, notify, useStore } from '../../mock/store'

/** Program dashboard. Same plain building blocks as the rest of the staff screens: one strip of numbers,
 *  a list of what needs attention today, and the supporting detail. Every number opens the screen behind it. */
const alertTrend = [2, 3, 2, 5, 3, 4, 4]
const waiting = [
  { n: 2, label: 'Payment failures', note: '1 hold needs approval', to: '/staff/payments', bad: true },
  { n: 2, label: 'Booking exceptions', note: '1 request to review', to: '/staff/calendar', bad: false },
  { n: 2, label: 'AI Agent exceptions', note: '1 written but not verified', to: '/staff/ecw-exceptions', bad: true },
]

/** Seven-day trend line: one 2px line, a dot on today, the value on hover. */
function Spark({ values, label }: { values: number[]; label: string }) {
  const w = 120, h = 44, pad = 5, max = Math.max(...values), min = Math.min(...values)
  const x = (i: number) => pad + (i * (w - pad * 2)) / (values.length - 1)
  const y = (v: number) => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2)
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} role="img" aria-label={`${label}: ${values.join(', ')}`}>
      <polyline points={values.map((v, i) => `${x(i)},${y(v)}`).join(' ')} fill="none" stroke="var(--color-sand-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {values.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={i === values.length - 1 ? 4 : 7} fill={i === values.length - 1 ? 'var(--color-sand-900)' : 'transparent'} stroke={i === values.length - 1 ? '#fff' : 'none'} strokeWidth="2"><title>{`${values.length - 1 - i === 0 ? 'Today' : `${values.length - 1 - i} days ago`}: ${v}`}</title></circle>)}
    </svg>
  )
}

/** "3 of 5" as five segments: one segment per person, filled when done. */
function Meter({ to, label, done, total, note, bad = false }: { to: string; label: string; done: number; total: number; note: string; bad?: boolean }) {
  return (
    <Link to={to} className="mt-3 block hover:opacity-80">
      <div className="flex items-baseline justify-between gap-2"><span className="text-sm font-medium text-sand-900">{label}</span><span className="whitespace-nowrap text-sm text-sand-700"><strong className="text-sand-900">{done}</strong> of {total}</span></div>
      <div className="mt-1.5 flex gap-1" role="img" aria-label={`${done} of ${total}`}>{Array.from({ length: total }, (_, i) => <span key={i} title={i < done ? 'Done' : 'Not yet'} className={`h-2.5 flex-1 rounded-full ${i < done ? 'bg-sand-900' : 'bg-sand-200'}`} />)}</div>
      <div className={`mt-1 flex items-center gap-1 text-xs ${bad ? 'font-medium text-bad-700' : 'text-sand-500'}`}>{bad && <AlertTriangle size={12} />}{note}</div>
    </Link>
  )
}

const attention: { what: string; who: string; due: string; tone: 'bad' | 'warn' | 'neutral'; to: string }[] = [
  { what: 'Escalated alert · crash report, severity 7', who: 'Priya Raman', due: 'Past due · 8:12 AM', tone: 'bad', to: '/staff/alerts' },
  { what: 'Intake note was written but could not be verified in eCW', who: 'Lena Kowalski', due: 'Needs a person', tone: 'bad', to: '/staff/ecw-exceptions' },
  { what: 'Payment hold proposed · needs your approval', who: 'Daniel Brooks', due: 'Day 5 reached', tone: 'warn', to: '/staff/payments' },
  { what: 'Month 9 review due', who: 'Elena Vasquez', due: 'Today', tone: 'warn', to: '/staff/registry' },
  { what: 'Booking request to review · Erchonia laser', who: 'Sophia Marchetti', due: 'Received yesterday', tone: 'neutral', to: '/staff/calendar' },
]
const weeks: [string, number, number][] = [['Sep 8', 12, 3], ['Sep 15', 14, 2], ['Sep 22', 16, 4], ['Sep 29', 18, 3], ['Oct 6', 21, 5]]
const funnel: [string, number][] = [['Inquiries', 12], ['Interviews', 6], ['Accepted for A&P', 4], ['A&P scheduled or in progress', 3], ['Program offered', 1], ['Active members', 2]]
const defects = [
  { id: 'DEF-014', sev: 'High', title: 'PDF read-back fails when the Patient Docs category is renamed', owner: 'Carlos', status: 'In progress' },
  { id: 'DEF-012', sev: 'Medium', title: 'Survey reminder sent outside the business-hour window', owner: 'Carlos', status: 'Fixed · verify' },
  { id: 'DEF-011', sev: 'Low', title: 'Invitation email preview wraps a merge field on iOS Mail', owner: 'Ana', status: 'Open' },
]

export default function Dashboards() {
  useStore()
  const me = currentUser()
  const tasks = allTasks().filter((t) => !t.done).slice(0, 4)
  const max = Math.max(...weeks.map((w) => w[1]))
  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="font-display text-[28px] font-semibold leading-tight text-sand-900">Dashboard</h1><p className="mt-1 text-[15px] text-sand-600">Thursday, Oct 9 · {me.name.split(' · ')[0]}</p></div>
        <button onClick={() => notify('Weekly report exported · logged with your name and time')} className="btn-secondary">Export weekly report</button>
      </div>

      <div className="mb-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Link to="/staff/alerts" className="card flex flex-col p-5 transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between text-sm text-sand-600"><span>Open alerts</span><ChevronRight size={15} className="text-sand-400" /></div>
          <div className="mt-2 flex items-end justify-between gap-3">
            <div className="text-[44px] font-semibold leading-none text-sand-900">4</div>
            <Spark values={alertTrend} label="Open alerts, last 7 days" />
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-bad-700"><AlertTriangle size={14} /> 1 escalated · past due</div>
          <div className="mt-1 text-xs text-sand-500">Last 7 days: {alertTrend[0]} → {alertTrend[alertTrend.length - 1]}</div>
        </Link>

        <div className="card p-5">
          <div className="text-sm text-sand-600">Getting started</div>
          <Meter to="/staff/patients?view=docs" label="Intake complete" done={3} total={5} note="median 4.2 days" />
          <Meter to="/staff/registry" label="Contracts signed" done={1} total={2} note="1 waiting for signature" />
          <Meter to="/staff/patients?view=chart" label="Chart prep placed in eCW" done={1} total={2} note="1 needs a person" bad />
        </div>

        <Link to="/staff/registry" className="card flex flex-col p-5 transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between text-sm text-sand-600"><span>Active members</span><ChevronRight size={15} className="text-sand-400" /></div>
          <div className="mt-2 text-[44px] font-semibold leading-none text-sand-900">2 <span className="text-base font-normal text-sand-500">of 5 places</span></div>
          <div className="mt-4 flex gap-1.5" role="img" aria-label="2 active members; the pilot target is 3 to 5">{[1, 2, 3, 4, 5].map((n) => <span key={n} title={n <= 2 ? `Member ${n}` : n === 3 ? 'Pilot minimum' : 'Open place'} className={`h-3 flex-1 rounded-full ${n <= 2 ? 'bg-sand-900' : 'bg-sand-200'}`} />)}</div>
          <div className="mt-1.5 flex text-[11px] text-sand-500"><span className="w-[40%]" /><span className="flex-1 border-l border-sand-400 pl-1.5">pilot target: 3 to 5</span></div>
          <div className="mt-auto pt-3 text-sm text-sand-700"><span className="font-medium text-sand-900">1 Month 9 review</span> due today</div>
        </Link>

        <div className="card p-5">
          <div className="text-sm text-sand-600">Waiting on someone</div>
          <ul className="mt-2 divide-y divide-sand-100">{waiting.map((w) => (
            <li key={w.label}><Link to={w.to} className="flex items-center gap-3 py-2.5 hover:opacity-80">
              <span className="w-8 text-[26px] font-semibold leading-none text-sand-900">{w.n}</span>
              <span className="min-w-0 flex-1"><span className="block text-sm font-medium text-sand-900">{w.label}</span><span className={`flex items-center gap-1 text-xs ${w.bad ? 'font-medium text-bad-700' : 'text-sand-500'}`}>{w.bad && <AlertTriangle size={12} />}{w.note}</span></span>
              <ChevronRight size={15} className="shrink-0 text-sand-400" />
            </Link></li>))}</ul>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card title="Needs attention today" subtitle={`${attention.length} items · most urgent first`} padded={false}>
            <ul className="divide-y divide-sand-100">{attention.map((a) => (
              <li key={a.what}><Link to={a.to} className="flex items-center gap-4 px-5 py-3.5 hover:bg-sand-50">
                <span className={`h-9 w-1 shrink-0 rounded-full ${a.tone === 'bad' ? 'bg-bad-600' : a.tone === 'warn' ? 'bg-warn-600' : 'bg-sand-300'}`} />
                <span className="min-w-0 flex-1"><span className="block text-[15px] font-medium text-sand-900">{a.what}</span><span className="block text-sm text-sand-500">{a.who}</span></span>
                <span className={`whitespace-nowrap text-sm ${a.tone === 'bad' ? 'font-semibold text-bad-700' : 'text-sand-600'}`}>{a.due}</span>
                <ChevronRight size={16} className="shrink-0 text-sand-400" />
              </Link></li>))}</ul>
          </Card>
        </div>
        <Card title="My tasks" actions={<Link to="/staff/tasks" className="text-sm font-medium text-sand-700 underline">All tasks</Link>}>
          {tasks.length === 0 ? <p className="help">Nothing open.</p> : <ul className="divide-y divide-sand-100">{tasks.map((t) => <li key={t.id} className="py-2.5 first:pt-0 last:pb-0"><Link to={t.link} className="block"><span className="block text-sm font-medium text-sand-900">{t.title}</span><span className="block text-xs text-sand-500">{t.about} · due {new Date(t.due + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></Link></li>)}</ul>}
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Card title="Check-ins and alerts by week" subtitle="Response rate 89% · median time to respond 2.1 hours">
          <div className="flex h-40 items-end gap-4" role="img" aria-label="Check-ins answered and alerts created per week">
            {weeks.map(([w, c, a]) => <div key={w} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex w-full items-end justify-center gap-1.5">
                <div className="flex w-5 flex-col items-center"><span className="text-[11px] text-sand-600">{c}</span><div className="w-full rounded-t-md bg-sand-900" style={{ height: `${(c / max) * 104}px` }} /></div>
                <div className="flex w-5 flex-col items-center"><span className="text-[11px] text-sand-600">{a}</span><div className="w-full rounded-t-md bg-teal-400" style={{ height: `${(a / max) * 104}px` }} /></div>
              </div>
              <span className="text-xs text-sand-500">{w}</span>
            </div>)}
          </div>
          <div className="mt-3 flex gap-4 text-xs text-sand-600"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-sand-900" />Check-ins answered</span><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-teal-400" />Alerts created</span></div>
        </Card>
        <Card title="Enrollment · last 30 days">
          <ul className="space-y-2.5">{funnel.map(([l, v]) => <li key={l} className="text-sm"><div className="flex justify-between"><span className="text-sand-700">{l}</span><span className="font-semibold text-sand-900">{v}</span></div><div className="mt-1 h-1.5 rounded-full bg-sand-100"><div className="h-1.5 rounded-full bg-sand-900" style={{ width: `${(v / 12) * 100}%` }} /></div></li>)}</ul>
        </Card>
        <Card title="AI Agent · last 7 days" actions={<Link to="/staff/ecw-exceptions" className="text-sm font-medium text-sand-700 underline">Exceptions</Link>}>
          <dl className="divide-y divide-sand-100 text-sm">{[['Verified in eCW', '41'], ['Exceptions', '2'], ['Intake notes placed', '9'], ['Bookings copied', '27'], ['Schedule reads', '7'], ['Last run', 'Today · 6:02 AM']].map(([l, v]) => <div key={l} className="flex justify-between py-2 first:pt-0 last:pb-0"><dt className="text-sand-600">{l}</dt><dd className="font-medium text-sand-900">{v}</dd></div>)}</dl>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card title="Pilot defects" padded={false}>
            <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-sm"><tbody>{defects.map((d) => <tr key={d.id} className="border-t border-sand-100 first:border-0"><td className="whitespace-nowrap px-5 py-3 text-sand-500">{d.id}</td><td className="px-3 py-3"><Pill tone={d.sev === 'High' ? 'bad' : d.sev === 'Medium' ? 'warn' : 'neutral'}>{d.sev}</Pill></td><td className="px-3 py-3 text-sand-800">{d.title}</td><td className="px-3 py-3 text-sand-600">{d.owner}</td><td className="whitespace-nowrap px-5 py-3 text-right text-sand-700">{d.status}</td></tr>)}</tbody></table></div>
          </Card>
        </div>
        <Card title="Audit and security">
          <dl className="divide-y divide-sand-100 text-sm">{[['Staff sign-ins with a second step', '100%'], ['Patient-record access · 7 days', '312'], ['Configuration changes · 7 days', '6'], ['Exports with patient data · 30 days', '2, logged'], ['Last backup restore test', 'Sep 28']].map(([l, v]) => <div key={l} className="flex justify-between gap-3 py-2 first:pt-0 last:pb-0"><dt className="text-sand-600">{l}</dt><dd className="font-medium text-sand-900">{v}</dd></div>)}</dl>
        </Card>
      </div>
      <div className="mt-4"><ToConfirm>which numbers Cassandra wants on the weekly report</ToConfirm></div>
    </>
  )
}
