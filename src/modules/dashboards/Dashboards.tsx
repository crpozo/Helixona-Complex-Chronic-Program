import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Card, Pill, ToConfirm } from '../../components/ui'
import { allTasks, currentUser, notify, useStore } from '../../mock/store'

/** Program dashboard. Same plain building blocks as the rest of the staff screens: one strip of numbers,
 *  a list of what needs attention today, and the supporting detail. Every number opens the screen behind it. */
const metrics: { label: string; value: string; hint: string; to: string; flag?: boolean }[] = [
  { label: 'Open alerts', value: '4', hint: '1 escalated', to: '/staff/alerts', flag: true },
  { label: 'Intake complete', value: '3 of 5', hint: 'median 4.2 days', to: '/staff/patients?view=docs' },
  { label: 'Chart prep', value: '1 ready', hint: '1 exception', to: '/staff/patients?view=chart', flag: true },
  { label: 'Booking exceptions', value: '2', hint: '1 request', to: '/staff/calendar' },
  { label: 'Contracts signed', value: '1 of 2', hint: '1 pending', to: '/staff/registry' },
  { label: 'Payment failures', value: '2', hint: '1 hold proposed', to: '/staff/payments', flag: true },
  { label: 'Active members', value: '2', hint: 'target 3–5', to: '/staff/registry' },
  { label: 'Month 9 reviews', value: '1', hint: 'due Oct 9', to: '/staff/registry' },
]
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

      <div className="card mb-5 grid grid-cols-2 overflow-hidden sm:grid-cols-4 xl:grid-cols-8">
        {metrics.map((m) => (
          <Link key={m.label} to={m.to} className="border-b border-r border-sand-200 px-4 py-4 transition-colors last:border-r-0 hover:bg-sand-50 xl:border-b-0">
            <div className="flex items-center gap-1.5 text-[12.5px] text-sand-600">{m.flag && <span className="h-1.5 w-1.5 rounded-full bg-bad-600" />}{m.label}</div>
            <div className="mt-1.5 whitespace-nowrap text-[26px] font-semibold leading-none text-sand-900">{m.value}</div>
            <div className="mt-1.5 text-xs text-sand-500">{m.hint}</div>
          </Link>))}
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
