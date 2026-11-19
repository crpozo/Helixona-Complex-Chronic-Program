import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, UserCheck, X } from 'lucide-react'
import { PageHeader, Pill, QueueTable, Tabs, toneFor, type Column } from '../../../components/ui'
import type { Inquiry } from '../../../mock/types'
import { allInquiries, currentUser, inquiryDate, inquiryStatuses, notify, patchInquiry, useStore, insuranceOf, priorityOf, inquiryAge, preferredName } from '../../../mock/store'

/** Inquiries: people who asked about Helixona and are not patients. One tile per status (counts follow the
 *  chosen period), ownership, and a page per inquiry with the data the advisor collects. */
const TODAY = '2026-10-09'
const shift = (iso: string, d: number) => { const t = new Date(iso + 'T12:00:00Z'); t.setUTCDate(t.getUTCDate() + d); return t.toISOString().slice(0, 10) }
const periods: Record<string, [string, string] | null> = { 'All time': null, 'This week': [shift(TODAY, -6), TODAY], 'Last 30 days': [shift(TODAY, -29), TODAY], 'This month': ['2026-10-01', '2026-10-31'], 'Last month': ['2026-09-01', '2026-09-30'] }

export default function InquiryList() {
  useStore()
  const nav = useNavigate()
  const me = currentUser()
  const [tab, setTab] = useState('all')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<string>('All')
  const [owner, setOwner] = useState('All')
  const [period, setPeriod] = useState('All time')
  const [from, setFrom] = useState('2026-09-15')
  const [to, setTo] = useState(TODAY)
  const all = allInquiries()
  const range = period === 'Custom' ? [from, to] as [string, string] : periods[period]
  const inPeriod = useMemo(() => all.filter((i) => !range || (inquiryDate(i) >= range[0] && inquiryDate(i) <= range[1])), [all, range]) // eslint-disable-line react-hooks/exhaustive-deps
  const byPath = inPeriod.filter((i) => tab === 'all' || (tab === 'cc' ? i.pathway === 'Complex Chronic' : i.pathway !== 'Complex Chronic'))
  const rows = byPath
    .filter((i) => status === 'All' || i.status === status)
    .filter((i) => owner === 'All' || (owner === 'Mine' ? i.owner === me.name : i.owner === owner))
    .filter((i) => !q || `${i.name} ${i.reason} ${i.city}`.toLowerCase().includes(q.toLowerCase()))
  const active = (status !== 'All' ? 1 : 0) + (owner !== 'All' ? 1 : 0) + (q ? 1 : 0)

  const columns: Column<Inquiry>[] = [
    { key: 'who', header: 'Name', render: (r) => <><div className="whitespace-nowrap text-[15px] font-semibold text-sand-900">{r.name}</div>{preferredName(r) && <div className="whitespace-nowrap text-xs text-sand-500">Goes by {preferredName(r)}</div>}</> },
    { key: 'age', header: 'Age', className: 'hidden min-[1400px]:table-cell', render: (r) => <span className="text-sm text-sand-700">{inquiryAge(r)}</span> },
    { key: 'received', header: <span className="block w-[74px] whitespace-normal leading-snug">Inquiry received</span>, className: 'hidden min-[1200px]:table-cell', render: (r) => <span className="whitespace-nowrap text-sm text-sand-700">{r.receivedAt.split(' · ')[0].replace(', 2026', '')}</span> },
    { key: 'city', header: 'City / State', className: 'hidden min-[1400px]:table-cell', render: (r) => <span className="whitespace-nowrap text-sm text-sand-700">{r.city}, {r.state}</span> },
    { key: 'status', header: 'Status', render: (r) => <Pill tone={toneFor(r.status)} className="whitespace-nowrap">{r.status}</Pill> },
    { key: 'ins', header: 'Insurance', render: (r) => <span className="whitespace-nowrap text-sm text-sand-700">{insuranceOf(r)}</span> },
    { key: 'prio', header: 'Priority', render: (r) => priorityOf(r) ? <Pill tone={priorityOf(r) === 'High' ? 'bad' : priorityOf(r) === 'Mid' ? 'warn' : 'neutral'} dot={false}>{priorityOf(r)}</Pill> : <span className="text-sand-400">—</span> },
    { key: 'pathway', header: 'Looking for', className: 'hidden min-[1600px]:table-cell', render: (r) => <span className="block max-w-[150px] text-sm leading-snug text-sand-700">{r.pathway === 'Complex Chronic' ? 'Chronic or Complex Chronic' : 'Health Optimization'}</span> },
    { key: 'owner', header: 'Owner', render: (r) => r.owner === 'Unassigned'
      ? <button onClick={(e) => { e.stopPropagation(); patchInquiry(r.id, { owner: me.name }); notify(`${r.name} is now yours`) }} className="btn-secondary whitespace-nowrap px-3 py-1.5 text-[11px]"><UserCheck size={13} /> Take it</button>
      : <span className={`whitespace-nowrap text-sm ${r.owner === me.name ? 'font-semibold text-sand-900' : 'text-sand-700'}`}>{r.owner}{r.owner === me.name && <span className="ml-1 text-xs font-normal text-sand-500">· you</span>}</span> },
  ]
  const sel = (label: string, value: string, set: (v: string) => void, opts: string[]) => <label className="flex items-center gap-2 whitespace-nowrap text-xs text-sand-500">{label}<select className="input w-auto max-w-[210px] py-2 text-sm" value={value} onChange={(e) => set(e.target.value)}>{opts.map((o) => <option key={o}>{o}</option>)}</select></label>

  return (
    <>
      <PageHeader eyebrow="Inquiries · not patients yet" title="Inquiries" description="People who asked about Helixona. An inquiry becomes a patient only when it is accepted and added to the patient list."
        actions={<button className="btn-primary" onClick={() => nav('/staff/inquiries/new')}>+ Add inquiry</button>} />

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="flex rounded-full border border-sand-300 bg-white p-0.5" role="group" aria-label="Period">{[...Object.keys(periods), 'Custom'].map((p) => <button key={p} onClick={() => setPeriod(p)} aria-pressed={period === p} className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${period === p ? 'bg-sand-900 text-white' : 'text-sand-600 hover:text-sand-900'}`}>{p}</button>)}</div>
        {period === 'Custom' && <span className="flex items-center gap-1.5 text-xs text-sand-500"><input type="date" className="input w-auto py-1 text-sm" value={from} max={to} onChange={(e) => setFrom(e.target.value)} />to<input type="date" className="input w-auto py-1 text-sm" value={to} min={from} onChange={(e) => setTo(e.target.value)} /></span>}
        <span className="text-xs text-sand-500">{inPeriod.length} inquiries in this period</span>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 xl:grid-cols-8">
        {inquiryStatuses.map((st) => { const n = byPath.filter((i) => i.status === st).length; const on = status === st; return (
          <button key={st} onClick={() => setStatus(on ? 'All' : st)} aria-pressed={on} className={`card p-3 text-left transition-colors ${on ? 'border-sand-900 bg-teal-50 shadow-[0_0_0_1px_#141414]' : 'hover:border-sand-400'}`}>
            <div className="text-2xl font-semibold text-sand-900">{n}</div>
            <div className="mt-0.5 text-[12px] leading-tight text-sand-600">{st}</div>
          </button>) })}
      </div>

      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'all', label: 'All', count: inPeriod.length }, { key: 'cc', label: 'Chronic or Complex Chronic', count: inPeriod.filter((i) => i.pathway === 'Complex Chronic').length }, { key: 'ho', label: 'Health Optimization', count: inPeriod.filter((i) => i.pathway !== 'Complex Chronic').length }]} />
      <div className="card mb-3 flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3">
        <label className="relative min-w-[240px] flex-1"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, city or what they are struggling with" className="input w-full py-2 pl-9" /></label>
        {sel('Status', status, setStatus, ['All', ...inquiryStatuses])}
        {sel('Owner', owner, setOwner, ['All', 'Mine', 'Unassigned', ...new Set(all.map((i) => i.owner).filter((o) => o !== 'Unassigned'))])}
        {active > 0 && <button onClick={() => { setQ(''); setStatus('All'); setOwner('All') }} className="btn-ghost whitespace-nowrap px-2 py-1 text-xs"><X size={13} /> Clear {active}</button>}
      </div>
      <QueueTable rows={rows} columns={columns} rowKey={(r) => r.id} rowTone={(r) => (r.owner === 'Unassigned' ? 'bad' : toneFor(r.status))} onRowClick={(r) => nav(`/staff/inquiries/${r.id}`)} empty="No inquiries match." />
      <p className="help mt-3">{rows.length} shown · an inquiry with no owner shows “Take it”; the red stripe marks inquiries nobody owns yet.</p>
    </>
  )
}
