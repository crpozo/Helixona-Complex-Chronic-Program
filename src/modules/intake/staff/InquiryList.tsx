import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Filter, Search } from 'lucide-react'
import { PageHeader, Pill, QueueTable, Stat, Tabs, toneFor, type Column } from '../../../components/ui'
import { inquiries } from '../../../mock/inquiries'
import type { Inquiry } from '../../../mock/types'

export default function InquiryList() {
  const nav = useNavigate()
  const [tab, setTab] = useState('cc')
  const [q, setQ] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [f, setF] = useState({ status: 'All', owner: 'All', source: 'All' })
  const statuses = ['All', ...new Set(inquiries.map((i) => i.status))]
  const owners = ['All', ...new Set(inquiries.map((i) => i.owner))]
  const sources = ['All', 'Website · Typeform', 'Referral', 'Campaign']
  const active = Object.values(f).filter((v) => v !== 'All').length
  const rows = inquiries.filter((i) => (tab === 'all' ? true : tab === 'cc' ? i.pathway === 'Complex Chronic' : i.pathway !== 'Complex Chronic'))
    .filter((i) => !q || `${i.name} ${i.id} ${i.reason} ${i.city}`.toLowerCase().includes(q.toLowerCase()))
    .filter((i) => f.status === 'All' || i.status === f.status)
    .filter((i) => f.owner === 'All' || i.owner === f.owner)
    .filter((i) => f.source === 'All' || (f.source === 'Referral' ? i.source.startsWith('Referral') : f.source === 'Campaign' ? /Google Ads|Instagram/.test(i.source) : i.source === f.source))

  const columns: Column<Inquiry>[] = [
    { key: 'id', header: 'Inquiry', render: (r) => <><div className="font-medium text-sand-900">{r.id}</div><div className="text-xs text-sand-500">{r.receivedAt}</div></>, width: '150px' },
    { key: 'who', header: 'Name · location', render: (r) => <><div className="font-medium text-sand-900">{r.name}</div><div className="text-xs text-sand-500">{r.city}, {r.state}</div></> },
    { key: 'pathway', header: 'Pathway', render: (r) => <Pill tone={r.pathway === 'Complex Chronic' ? 'teal' : 'neutral'} dot={false}>{r.pathway}</Pill> },
    { key: 'source', header: 'Source', render: (r) => <span className="text-sand-600">{r.source}</span> },
    { key: 'reason', header: 'Reason for seeking care', render: (r) => <span className="text-sand-700">{r.reason}</span> },
    { key: 'status', header: 'Status', render: (r) => <Pill tone={toneFor(r.status)}>{r.status}</Pill> },
    { key: 'owner', header: 'Owner', render: (r) => <span className={r.owner === 'Unassigned' ? 'font-semibold text-bad-700' : ''}>{r.owner}</span> },
    { key: 'next', header: 'Next action', render: (r) => <span className="text-sand-600">{r.nextAction}</span> },
  ]

  return (
    <>
      <PageHeader eyebrow="Intake · Patient advisor" title="Inquiries" description="Website inquiries arrive from the Typeform with pathway, source, and submission details. Only the Complex Chronic pathway enters this program's workflow."
        actions={<><button onClick={() => setShowFilters((v) => !v)} className={`btn-secondary ${active ? 'bg-teal-50' : ''}`}><Filter size={16} /> Filters{active ? ` · ${active}` : ''}</button><button className="btn-primary" onClick={() => nav('/staff/patients/new')}>+ Add inquiry manually</button></>} />
      {showFilters && (
        <div className="card mb-5 flex flex-wrap items-end gap-4 p-4">
          <label className="block"><span className="label">Status</span><select className="input py-2" value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>{statuses.map((x) => <option key={x}>{x}</option>)}</select></label>
          <label className="block"><span className="label">Owner</span><select className="input py-2" value={f.owner} onChange={(e) => setF({ ...f, owner: e.target.value })}>{owners.map((x) => <option key={x}>{x}</option>)}</select></label>
          <label className="block"><span className="label">Source</span><select className="input py-2" value={f.source} onChange={(e) => setF({ ...f, source: e.target.value })}>{sources.map((x) => <option key={x}>{x}</option>)}</select></label>
          <button onClick={() => setF({ status: 'All', owner: 'All', source: 'All' })} className="btn-ghost">Clear</button>
          <span className="help ml-auto">{rows.length} of {inquiries.length} inquiries</span>
        </div>
      )}
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="New this week" value={4} hint="1 unassigned" tone="bad" />
        <Stat label="In outreach" value={1} hint="next call Oct 8" tone="warn" />
        <Stat label="Interviews completed" value={1} hint="awaiting Karina" tone="teal" />
        <Stat label="Accepted for Month 0 (30 d)" value={3} hint="2 intakes open" tone="ok" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onChange={setTab} tabs={[{ key: 'cc', label: 'Complex Chronic', count: inquiries.filter((i) => i.pathway === 'Complex Chronic').length }, { key: 'other', label: 'Other pathways', count: inquiries.filter((i) => i.pathway !== 'Complex Chronic').length }, { key: 'all', label: 'All' }]} />
        <label className="relative mb-4"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, ID, reason…" className="input w-72 pl-9 py-2" /></label>
      </div>
      <QueueTable rows={rows} columns={columns} rowKey={(r) => r.id} rowTone={(r) => (r.owner === 'Unassigned' ? 'bad' : toneFor(r.status))}
        onRowClick={(r) => nav(r.patientId ? `/staff/patients/${r.patientId}` : `/staff/patients/new?inquiry=${r.id}`)} />
      <p className="help mt-3">Click a row: inquiries with a patient record open the record; new inquiries open “Create patient record”. Source and pathway are preserved on the patient record.</p>
    </>
  )
}
