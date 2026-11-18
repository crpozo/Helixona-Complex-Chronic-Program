import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, Pill, QueueTable, Stat, Tabs, toneFor, WhoWhenWhy, type Column } from '../../components/ui'
import { members, statusCatalog, type Member } from '../../mock/program'
import { nameOf } from '../../mock/names'
import { planOf } from '../../mock/billing'
import { Avatar } from '../../components/Avatar'
import { notify, statusOf, useStore } from '../../mock/store'

export default function Registry() {
  const nav = useNavigate()
  useStore()
  const [tab, setTab] = useState('all')
  const [picking, setPicking] = useState(false)
  const [q, setQ] = useState('')
  const phase = (s: string) => statusCatalog.find((c) => c.status === s)?.phase ?? '—'
  const rows = members.filter((m) => tab === 'all' ? true : tab === 'members' ? ['Active member', 'Temporarily paused', 'Month 9 review', 'Continued active care', 'Maintenance'].includes(m.status) : tab === 'month0' ? phase(m.status) === 'A&P' || phase(m.status) === 'Decision' || phase(m.status) === 'Enrollment' : phase(m.status) === 'Closed' || phase(m.status) === 'After Month 9')
  const columns: Column<Member>[] = [
    { key: 'id', header: 'Patient', render: (r) => <div className="flex items-center gap-2.5"><Avatar name={nameOf(r.id)} size={30} /><div><div className="font-semibold text-sand-900">{nameOf(r.id)}</div><div className="text-xs text-sand-500">{planOf(r.id)}</div></div></div>, width: '220px' },
    { key: 'status', header: 'Status', render: (r) => <><Pill tone={toneFor(statusOf(r))}>{statusOf(r)}</Pill><div className="mt-1 text-xs text-sand-500">{phase(r.status)}</div></> },
    { key: 'm0', header: 'A&P', render: (r) => <span className="text-xs">{r.month0Start ? `${r.month0Start}${r.month0End ? ` → ${r.month0End}` : ''}` : '—'}</span> },
    { key: 'start', header: 'Membership', render: (r) => <span className="text-xs">{r.membershipStart ? `${r.membershipStart} → ${r.nineMonthEnd}` : '—'}</span> },
    { key: 'pause', header: 'Pauses', render: (r) => r.pauses.length ? <Pill tone="warn" dot={false}>{r.pauses.length} · {r.pauses[0].reason.split(' · ')[1]}</Pill> : <span className="text-sand-400">—</span> },
    { key: 'months', header: 'Active months', render: (r) => <span className="font-medium">{r.activeMonths}</span> },
    { key: 'amt', header: 'Monthly', render: (r) => (r.monthlyAmount ? `$${r.monthlyAmount.toLocaleString()}` : '—') },
    { key: 'last', header: 'Last change · who · when · why', render: (r) => <WhoWhenWhy actor={r.lastChange.actor} when={r.lastChange.when} reason={`${r.lastChange.action}${r.lastChange.reason ? ' · ' + r.lastChange.reason : ''}`} /> },
  ]
  return (
    <>
      <PageHeader eyebrow="Registry · Operations (Karina)" title="Membership registry" description="Operational control center for every patient in the program: current status, dates, pauses, Month 9 review and total active months. Transition rules live in configuration, not code; irreversible transitions always need a person." actions={<><button className="btn-secondary" onClick={() => notify('Registry exported · logged with your name and time')}>Export (logged)</button><button className="btn-primary" onClick={() => setPicking(true)}>Update status</button></>} />
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat label="Active members" value={members.filter((m) => m.status === 'Active member').length} hint="pilot target 3–5" tone="ok" />
        <Stat label="In A&P" value={members.filter((m) => /A&P/i.test(m.status)).length} tone="teal" />
        <Stat label="Contract / payment pending" value={members.filter((m) => /pending/i.test(m.status)).length} tone="warn" />
        <Stat label="Month 9 reviews due" value={members.filter((m) => m.status === 'Month 9 review').length} hint="Oct 9" tone="warn" />
        <Stat label="Paused" value={members.filter((m) => m.status === 'Temporarily paused').length} tone="neutral" />
      </div>
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'all', label: 'All', count: members.length }, { key: 'members', label: 'Members' }, { key: 'month0', label: 'A&P & enrollment' }, { key: 'closed', label: 'Graduated & closed' }]} />
      <QueueTable rows={rows} columns={columns} rowKey={(r) => r.id} rowTone={(r) => toneFor(r.status)} onRowClick={(r) => nav(`/staff/registry/${r.id}`)} />
      {picking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label="Choose a member" onClick={() => setPicking(false)}>
          <div className="card w-full max-w-md p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-2xl font-semibold text-sand-900">Whose status?</h2>
            <input autoFocus className="input mt-3" placeholder="Search by name…" value={q} onChange={(e) => setQ(e.target.value)} />
            <ul className="mt-2 max-h-72 overflow-auto divide-y divide-sand-100">{members.filter((m) => nameOf(m.id).toLowerCase().includes(q.toLowerCase())).map((m) => <li key={m.id}><button onClick={() => nav(`/staff/registry/${m.id}?tab=transition`)} className="flex w-full items-center gap-2.5 px-1 py-2 text-left hover:bg-sand-100"><Avatar name={nameOf(m.id)} size={28} /><span className="flex-1 font-medium text-sand-900">{nameOf(m.id)}</span><Pill tone={toneFor(statusOf(m))} dot={false}>{statusOf(m)}</Pill></button></li>)}</ul>
            <div className="mt-3 text-right"><button onClick={() => setPicking(false)} className="btn-ghost">Cancel</button></div>
          </div>
        </div>
      )}
    </>
  )
}
