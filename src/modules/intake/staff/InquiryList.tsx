import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Download, Ban, CalendarCheck, CheckCircle2, ClipboardList, FileQuestion, Hourglass, Inbox, MessageCircle, Search, UserCheck, X, type LucideIcon } from 'lucide-react'
import { MultiSelect, PageHeader, Pill, QueueTable, Tabs, toneFor, type Column } from '../../../components/ui'
import type { Inquiry, InquiryStatus } from '../../../mock/types'

/** One color and icon per inquiry status, so the row of counts reads at a glance. The label always stays. */
export const statusLook: Record<InquiryStatus, { color: string; tint: string; Icon: LucideIcon }> = {
  'Lead received': { color: '#3b6ea5', tint: '#e3edf7', Icon: Inbox },
  'Waiting for response': { color: '#b06a12', tint: '#fbecd2', Icon: MessageCircle },
  'Pending information': { color: '#c2571a', tint: '#fbe3d3', Icon: FileQuestion },
  'Interview scheduled': { color: '#6f4b8a', tint: '#ece2f1', Icon: CalendarCheck },
  'Waiting for admission review': { color: '#8a6d1f', tint: '#f3eadb', Icon: ClipboardList },
  'Accepted': { color: '#2f7a4f', tint: '#dcefe3', Icon: CheckCircle2 },
  'Waitlisted': { color: '#1f7a82', tint: '#d8eef0', Icon: Hourglass },
  'Denied': { color: '#b4382e', tint: '#f9dcd9', Icon: Ban },
}
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
  const [statuses, setStatuses] = useState<string[]>([])
  const [picked, setPicked] = useState<string[]>([])
  const [owner, setOwner] = useState('All')
  const [period, setPeriod] = useState('All time')
  const [from, setFrom] = useState('2026-09-15')
  const [to, setTo] = useState(TODAY)
  const all = allInquiries()
  const range = period === 'Custom' ? [from, to] as [string, string] : periods[period]
  const inPeriod = useMemo(() => all.filter((i) => !range || (inquiryDate(i) >= range[0] && inquiryDate(i) <= range[1])), [all, range]) // eslint-disable-line react-hooks/exhaustive-deps
  const byPath = inPeriod.filter((i) => tab === 'all' || (tab === 'cc' ? i.pathway === 'Complex Chronic' : i.pathway !== 'Complex Chronic'))
  const rows = byPath
    .filter((i) => statuses.length === 0 || statuses.includes(i.status))
    .filter((i) => owner === 'All' || (owner === 'Mine' ? i.owner === me.name : i.owner === owner))
    .filter((i) => !q || `${i.name} ${i.reason} ${i.city}`.toLowerCase().includes(q.toLowerCase()))
  const active = (statuses.length ? 1 : 0) + (owner !== 'All' ? 1 : 0) + (q ? 1 : 0)

  /* One file with the summary of every selected inquiry, in the format the advisor uses for the admissions meeting. */
  const downloadSummaries = () => {
    const text = all.filter((i) => picked.includes(i.id)).map((i) => [
      `${i.name}${preferredName(i) ? ` (goes by ${preferredName(i)})` : ''}`, i.reason, '',
      `- Insurance: ${insuranceOf(i)}`, `- Age ${inquiryAge(i)}`, `- Applied ${i.receivedAt.split(' · ')[0]}`, `- ${i.city}, ${i.state}`,
      `- Looking for: ${i.pathway === 'Complex Chronic' ? 'Chronic or Complex Chronic Recovery' : 'Health Optimization'}`, `- Heard from: ${i.source}`,
      `- Status: ${i.status} · priority ${priorityOf(i) || 'not set'} · owner ${i.owner}`,
    ].join('\n')).join('\n\n----------------------------------------\n\n')
    const url = URL.createObjectURL(new Blob([`Helixona · inquiry summaries · ${picked.length} people\n\n${text}\n`], { type: 'text/plain' }))
    const link = document.createElement('a'); link.href = url; link.download = 'inquiry-summaries.txt'; link.click(); URL.revokeObjectURL(url)
    notify(`Summaries for ${picked.length} people downloaded`)
  }

  const columns: Column<Inquiry>[] = [
    { key: 'pick', header: <input type="checkbox" aria-label="Select all shown" checked={rows.length > 0 && rows.every((r) => picked.includes(r.id))} onChange={(e) => setPicked(e.target.checked ? rows.map((r) => r.id) : [])} />, render: (r) => <input type="checkbox" aria-label={`Select ${r.name}`} checked={picked.includes(r.id)} onClick={(e) => e.stopPropagation()} onChange={(e) => setPicked(e.target.checked ? [...picked, r.id] : picked.filter((x) => x !== r.id))} className="h-4 w-4" /> },
    { key: 'who', header: 'Name', render: (r) => <><div className="whitespace-nowrap text-[15px] font-semibold text-sand-900">{r.name}</div>{preferredName(r) && <div className="whitespace-nowrap text-xs text-sand-500">Goes by {preferredName(r)}</div>}</> },
    { key: 'age', header: 'Age', className: 'hidden min-[1400px]:table-cell', render: (r) => <span className="text-sm text-sand-700">{inquiryAge(r)}</span> },
    { key: 'received', header: <span className="block w-[74px] whitespace-normal leading-snug">Inquiry received</span>, className: 'hidden min-[1200px]:table-cell', render: (r) => <span className="whitespace-nowrap text-sm text-sand-700">{r.receivedAt.split(' · ')[0].replace(', 2026', '')}</span> },
    { key: 'city', header: 'City / State', className: 'hidden min-[1400px]:table-cell', render: (r) => <span className="whitespace-nowrap text-sm text-sand-700">{r.city}, {r.state}</span> },
    { key: 'status', header: 'Status', render: (r) => { const look = statusLook[r.status]; return (
      <span className="relative inline-flex items-center" onClick={(e) => e.stopPropagation()}>
        <select aria-label={`Change status of ${r.name}`} title="Change status" value={r.status} onChange={(e) => { const st = e.target.value as InquiryStatus; patchInquiry(r.id, { status: st }); if (st === 'Denied') { notify('Denied · give the reason on the inquiry'); nav(`/staff/inquiries/${r.id}`) } else notify(`${r.name} · ${st}${st === 'Accepted' ? ' · open the inquiry to add to the patient list' : ''}`) }}
          style={{ color: look.color, background: look.tint, borderColor: look.color + '55' }} className="cursor-pointer appearance-none whitespace-nowrap rounded-full border py-1 pl-3 pr-7 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400">
          {inquiryStatuses.map((st) => <option key={st} value={st}>{st}</option>)}
        </select>
        <ChevronDown size={13} className="pointer-events-none absolute right-2.5" style={{ color: look.color }} />
      </span>) } },
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
      <PageHeader eyebrow="Inquiries · not patients yet" title="Inquiries" description="An inquiry becomes a patient when it is accepted."
        actions={<button className="btn-primary" onClick={() => nav('/staff/inquiries/new')}>+ Add inquiry</button>} />

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="flex rounded-full border border-sand-300 bg-white p-0.5" role="group" aria-label="Period">{[...Object.keys(periods), 'Custom'].map((p) => <button key={p} onClick={() => setPeriod(p)} aria-pressed={period === p} className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${period === p ? 'bg-sand-900 text-white' : 'text-sand-600 hover:text-sand-900'}`}>{p}</button>)}</div>
        {period === 'Custom' && <span className="flex items-center gap-1.5 text-xs text-sand-500"><input type="date" className="input w-auto py-1 text-sm" value={from} max={to} onChange={(e) => setFrom(e.target.value)} />to<input type="date" className="input w-auto py-1 text-sm" value={to} min={from} onChange={(e) => setTo(e.target.value)} /></span>}
        <span className="text-xs text-sand-500">{inPeriod.length} inquiries in this period</span>
      </div>
      <div className="card mb-5 grid grid-cols-2 overflow-hidden sm:grid-cols-4 xl:grid-cols-8">
        {inquiryStatuses.map((st) => { const n = byPath.filter((i) => i.status === st).length; const on = statuses.includes(st); const { color } = statusLook[st]; return (
          <button key={st} onClick={() => setStatuses(on ? statuses.filter((x) => x !== st) : [...statuses, st])} aria-pressed={on} title={on ? 'Showing only this status · click to clear' : 'Show only this status'}
            className={`relative border-b border-r border-sand-200 px-4 py-3.5 text-left transition-colors last:border-r-0 xl:border-b-0 ${on ? 'bg-sand-100' : 'hover:bg-sand-50'}`}>
            <div className={`text-[28px] font-semibold leading-none ${n === 0 ? 'text-sand-300' : 'text-sand-900'}`}>{n}</div>
            <div className="mt-2 flex items-start gap-1.5 text-[12.5px] leading-tight text-sand-600"><span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />{st}</div>
            {on && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-sand-900" />}
          </button>) })}
      </div>

      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'all', label: 'All', count: inPeriod.length }, { key: 'cc', label: 'Chronic or Complex Chronic', count: inPeriod.filter((i) => i.pathway === 'Complex Chronic').length }, { key: 'ho', label: 'Health Optimization', count: inPeriod.filter((i) => i.pathway !== 'Complex Chronic').length }]} />
      <div className="card mb-3 flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3">
        <label className="relative min-w-[240px] flex-1"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, city or what they are struggling with" className="input w-full py-2 pl-9" /></label>
        <div className="flex items-center gap-2 whitespace-nowrap text-xs text-sand-500">Filter by status<div className="w-[230px]"><MultiSelect options={inquiryStatuses.map((x) => ({ value: x, label: x }))} value={statuses} onChange={setStatuses} placeholder="All statuses" allLabel="All statuses" /></div></div>
        {sel('Filter by owner', owner, setOwner, ['All', 'Mine', 'Unassigned', ...new Set(all.map((i) => i.owner).filter((o) => o !== 'Unassigned'))])}
        {active > 0 && <button onClick={() => { setQ(''); setStatuses([]); setOwner('All') }} className="btn-ghost whitespace-nowrap px-2 py-1 text-xs"><X size={13} /> Clear {active}</button>}
      </div>
      {picked.length > 0 && <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-sand-900 px-4 py-2.5 text-sm text-white"><span><strong>{picked.length}</strong> selected for the admissions meeting</span><span className="flex gap-2"><button className="rounded-lg bg-teal-400 px-3 py-1.5 text-xs font-semibold text-sand-900" onClick={downloadSummaries}><Download size={13} className="mr-1 inline" /> Download summaries</button><button className="rounded-lg px-3 py-1.5 text-xs text-white/80 hover:text-white" onClick={() => setPicked([])}>Clear</button></span></div>}
      <QueueTable rows={rows} columns={columns} rowKey={(r) => r.id} rowTone={(r) => (r.owner === 'Unassigned' ? 'bad' : toneFor(r.status))} onRowClick={(r) => nav(`/staff/inquiries/${r.id}`)} empty="No inquiries match." />
      <p className="help mt-3">{rows.length} shown · an inquiry with no owner shows “Take it”; the red stripe marks inquiries nobody owns yet.</p>
    </>
  )
}
