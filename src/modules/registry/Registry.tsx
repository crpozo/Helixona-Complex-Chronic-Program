import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, Pill, QueueTable, Stat, Tabs, toneFor, WhoWhenWhy, type Column } from '../../components/ui'
import { members, statusCatalog, type Member } from '../../mock/program'

export default function Registry() {
  const nav = useNavigate()
  const [tab, setTab] = useState('all')
  const phase = (s: string) => statusCatalog.find((c) => c.status === s)?.phase ?? '—'
  const rows = members.filter((m) => tab === 'all' ? true : tab === 'members' ? ['Active member', 'Temporarily paused', 'Month 9 review', 'Continued active care', 'Maintenance'].includes(m.status) : tab === 'month0' ? phase(m.status) === 'Month 0' || phase(m.status) === 'Decision' || phase(m.status) === 'Enrollment' : phase(m.status) === 'Closed' || phase(m.status) === 'After Month 9')
  const columns: Column<Member>[] = [
    { key: 'id', header: 'Patient', render: (r) => <div className="font-semibold text-sand-900">{r.id}</div>, width: '100px' },
    { key: 'status', header: 'Status', render: (r) => <><Pill tone={toneFor(r.status)}>{r.status}</Pill><div className="mt-1 text-xs text-sand-500">{phase(r.status)}</div></> },
    { key: 'm0', header: 'Month 0', render: (r) => <span className="text-xs">{r.month0Start ? `${r.month0Start}${r.month0End ? ` → ${r.month0End}` : ''}` : '—'}</span> },
    { key: 'start', header: 'Membership', render: (r) => <span className="text-xs">{r.membershipStart ? `${r.membershipStart} → ${r.nineMonthEnd}` : '—'}</span> },
    { key: 'pause', header: 'Pauses', render: (r) => r.pauses.length ? <Pill tone="warn" dot={false}>{r.pauses.length} · {r.pauses[0].reason.split(' · ')[1]}</Pill> : <span className="text-sand-400">—</span> },
    { key: 'months', header: 'Active months', render: (r) => <span className="font-medium">{r.activeMonths}</span> },
    { key: 'amt', header: 'Monthly', render: (r) => (r.monthlyAmount ? `$${r.monthlyAmount.toLocaleString()}` : '—') },
    { key: 'last', header: 'Last change · who · when · why', render: (r) => <WhoWhenWhy actor={r.lastChange.actor} when={r.lastChange.when} reason={`${r.lastChange.action}${r.lastChange.reason ? ' · ' + r.lastChange.reason : ''}`} /> },
  ]
  return (
    <>
      <PageHeader eyebrow="Registry · Operations (Karina)" title="Membership registry" description="Operational control center for every patient in the program: current status, dates, pauses, Month 9 review and total active months. Transition rules live in configuration, not code; irreversible transitions always need a person." actions={<><button className="btn-secondary">Export (logged)</button><button className="btn-primary">Update status</button></>} />
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat label="Active members" value={members.filter((m) => m.status === 'Active member').length} hint="pilot target 3–5" tone="ok" />
        <Stat label="In Month 0" value={members.filter((m) => /month 0/i.test(m.status)).length} tone="teal" />
        <Stat label="Contract / payment pending" value={members.filter((m) => /pending/i.test(m.status)).length} tone="warn" />
        <Stat label="Month 9 reviews due" value={members.filter((m) => m.status === 'Month 9 review').length} hint="Oct 9" tone="warn" />
        <Stat label="Paused" value={members.filter((m) => m.status === 'Temporarily paused').length} tone="neutral" />
      </div>
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'all', label: 'All', count: members.length }, { key: 'members', label: 'Members' }, { key: 'month0', label: 'Month 0 & enrollment' }, { key: 'closed', label: 'Graduated & closed' }]} />
      <QueueTable rows={rows} columns={columns} rowKey={(r) => r.id} rowTone={(r) => toneFor(r.status)} onRowClick={(r) => nav(`/staff/registry/${r.id}`)} />
    </>
  )
}
