import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertOctagon, Bookmark, FileText, Phone, RotateCw, Search, Users, X } from 'lucide-react'
import { AuditList, Card, Field, Notice, PageHeader, Pill, QueueTable, Row, Tabs, ToConfirm, toneFor, type Column, type Tone } from '../../../components/ui'
import { MetricBoard } from '../../../components/MetricBoard'
import { Avatar } from '../../../components/Avatar'
import { payments, type Payment } from '../../../mock/program'
import { families, lastPaidOf, membershipOf, planOf } from '../../../mock/billing'
import { nameOf } from '../../../mock/names'
import { currentUser, notify } from '../../../mock/store'

const tone: Record<Payment['status'], Tone> = { Paid: 'ok', Failed: 'bad', 'Retry scheduled': 'warn', 'Hold proposed': 'bad', Refunded: 'info', Scheduled: 'neutral' }
interface Filters { q: string; status: string; plan: string; charge: string; period: string; from: string; to: string }
const blank: Filters = { q: '', status: 'All', plan: 'All', charge: 'All', period: 'All', from: '2026-09-01', to: '2026-10-31' }
const periods: Record<string, [string, string]> = { 'This month': ['2026-10-01', '2026-10-31'], 'Last month': ['2026-09-01', '2026-09-30'], 'Last 90 days': ['2026-07-11', '2026-10-09'] }
const iso = (d: string) => new Date(Date.parse(d)).toISOString().slice(0, 10)

export default function FailedPayments() {
  const nav = useNavigate()
  const me = currentUser()
  const [tab, setTab] = useState('queue')
  const [sel, setSel] = useState<Payment | null>(null)
  const [f, setF] = useState<Filters>(blank)
  const [receipt, setReceipt] = useState<Payment | null>(null)
  const [done, setDone] = useState<Record<string, Payment['status']>>({})
  const viewsKey = `hlx-pay-views:${me.role}`
  const [views, setViews] = useState<{ name: string; tab: string; f: Filters }[]>(() => { try { return JSON.parse(localStorage.getItem(viewsKey) ?? '[]') } catch { return [] } })
  const saveViews = (v: typeof views) => { setViews(v); try { localStorage.setItem(viewsKey, JSON.stringify(v)) } catch { /* ignore */ } }
  const statusOf = (p: Payment) => done[p.id] ?? p.status
  const set = (k: keyof Filters, v: string) => setF({ ...f, [k]: v })

  const rows = useMemo(() => payments
    .filter((p) => (tab === 'queue' ? ['Failed', 'Retry scheduled', 'Hold proposed'].includes(statusOf(p)) : tab === 'upcoming' ? statusOf(p) === 'Scheduled' : true))
    .filter((p) => !f.q || `${nameOf(p.patientId)} ${p.type} ${p.period}`.toLowerCase().includes(f.q.toLowerCase()))
    .filter((p) => f.status === 'All' || statusOf(p) === f.status)
    .filter((p) => f.plan === 'All' || (f.plan === 'Family' ? planOf(p.patientId) !== 'Individual' : planOf(p.patientId) === 'Individual'))
    .filter((p) => f.charge === 'All' || p.type === f.charge)
    .filter((p) => { if (f.period === 'All') return true; const [a, b] = f.period === 'Custom' ? [f.from, f.to] : periods[f.period]; const d = iso(p.date); return d >= a && d <= b }),
  [tab, f, done]) // eslint-disable-line react-hooks/exhaustive-deps
  const active = (Object.keys(blank) as (keyof Filters)[]).filter((k) => !['from', 'to'].includes(k) && f[k] !== blank[k]).length

  const cols: Column<Payment>[] = [
    { key: 'p', header: 'Patient', width: '200px', render: (r) => <div className="flex items-center gap-2.5"><Avatar name={nameOf(r.patientId)} size={30} /><span className="font-semibold text-sand-900">{nameOf(r.patientId)}</span></div> },
    { key: 'plan', header: 'Plan', render: (r) => { const pl = planOf(r.patientId); return pl === 'Individual' ? <span className="text-sand-600">Individual</span> : <span className="inline-flex items-center gap-1 text-sand-800"><Users size={13} className="text-teal-700" />{pl}</span> } },
    { key: 'charge', header: 'Charge', render: (r) => <span className="text-sand-700">{r.type === 'A&P assessment' ? 'A&P assessment' : 'Membership'}</span> },
    { key: 'period', header: 'Period', render: (r) => r.period },
    { key: 'amt', header: 'Amount', render: (r) => <span className="font-medium">${r.amount.toLocaleString()}</span> },
    { key: 'date', header: 'Date', render: (r) => <span className="whitespace-nowrap">{r.date}</span> },
    { key: 'st', header: 'Payment status', render: (r) => <Pill tone={tone[statusOf(r)]}>{statusOf(r)}</Pill> },
    { key: 'mem', header: 'Membership', render: (r) => { const m = membershipOf(r.patientId); return m === '—' ? <span className="text-sand-400">—</span> : <Pill tone={toneFor(m)} dot={false}>{m}</Pill> } },
    { key: 'last', header: 'Last processed', render: (r) => { const l = lastPaidOf(r.patientId); return l ? <span className="text-xs text-sand-600">${l.amount.toLocaleString()} · {l.date.replace(', 2026', '')}</span> : <span className="text-xs text-sand-400">None yet</span> } },
    { key: 'next', header: 'Next action', render: (r) => <span className="text-xs">{r.nextAction ?? '—'}</span> },
  ]
  const sum = (fn: (p: Payment) => boolean) => payments.filter(fn).reduce((n, p) => n + p.amount, 0)
  const sel_ = (label: string, k: keyof Filters, opts: string[]) => <label className="flex items-center gap-1.5 text-xs text-sand-500">{label}<select className="input w-auto py-1.5 pr-8 text-sm" value={f[k]} onChange={(e) => set(k, e.target.value)}>{opts.map((o) => <option key={o}>{o}</option>)}</select></label>

  return (
    <>
      <PageHeader eyebrow="Membership · Payments" title="Payments" description="Every charge with its payment status, the membership behind it and the last payment that went through. Open a row to retry, see the receipt or log a call. Card and bank details stay in Stripe." meta={<ToConfirm>retry cadence, grace period, hold policy, refunds (Karina + attorney)</ToConfirm>} actions={<button onClick={() => nav('/staff/payments/reconciliation')} className="btn-secondary">Reconciliation report</button>} />
      <MetricBoard id="payments" defaults={['failed', 'holds', 'due', 'collected']} metrics={[
        { key: 'failed', label: 'Failed · open', value: payments.filter((p) => statusOf(p) === 'Failed').length, tone: 'bad' },
        { key: 'holds', label: 'Holds needing approval', value: payments.filter((p) => statusOf(p) === 'Hold proposed').length, hint: 'human decision', tone: 'bad' },
        { key: 'due', label: 'Due in 7 days', value: '$6,000', hint: '3 members', tone: 'neutral' },
        { key: 'collected', label: 'Collected · Oct', value: `$${sum((p) => statusOf(p) === 'Paid' && p.date.startsWith('Oct')).toLocaleString()}`, tone: 'ok' },
        { key: 'refunds', label: 'Refunds · 30 d', value: `$${sum((p) => p.status === 'Refunded').toLocaleString()}`, tone: 'info' },
        { key: 'families', label: 'Family plans', value: families.length, hint: `${families.reduce((n, x) => n + x.members.length, 0)} members`, tone: 'teal' },
        { key: 'retry', label: 'Retries scheduled', value: payments.filter((p) => p.nextAction?.startsWith('Retry')).length, tone: 'warn' },
      ]} />
      <Tabs value={tab} onChange={(k) => { setTab(k); setSel(null) }} tabs={[{ key: 'queue', label: 'Needs attention', count: payments.filter((p) => ['Failed', 'Retry scheduled', 'Hold proposed'].includes(statusOf(p))).length }, { key: 'upcoming', label: 'Upcoming' }, { key: 'all', label: 'All payments', count: payments.length }, { key: 'families', label: 'Family plans', count: families.length }]} />

      {tab === 'families' ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {families.map((fam) => (
            <Card key={fam.id} title={<span className="flex items-center gap-2"><Users size={16} className="text-teal-700" />{fam.name}</span>} subtitle={`One monthly charge for ${fam.members.length} members · since ${fam.since}`} actions={<Pill tone={fam.status === 'Active' ? 'ok' : 'bad'}>{fam.status}</Pill>}>
              <Row label="Payer">{nameOf(fam.payer)}</Row>
              <Row label="Monthly charge">${fam.monthly.toLocaleString()}</Row>
              <Row label="Paid with">{fam.method}</Row>
              <div className="mt-3 eyebrow">Members</div>
              <ul className="mt-1 divide-y divide-sand-100">{fam.members.map((m) => <li key={m} className="flex items-center gap-2.5 py-2 text-sm"><Avatar name={nameOf(m)} size={28} /><span className="flex-1 font-medium text-sand-900">{nameOf(m)}</span>{m === fam.payer && <Pill dot={false} tone="teal">Payer</Pill>}<Pill dot={false} tone={toneFor(membershipOf(m))}>{membershipOf(m) === '—' ? 'Active member' : membershipOf(m)}</Pill></li>)}</ul>
              <div className="mt-3 flex gap-2"><button onClick={() => notify(`Add a member to the ${fam.name}: choose a patient and the new monthly amount`)} className="btn-secondary px-3 py-2 text-[11px]">Add member</button><button onClick={() => notify('A new agreement was sent to the payer to sign electronically')} className="btn-secondary px-3 py-2 text-[11px]">Send updated agreement</button></div>
            </Card>
          ))}
          <div className="lg:col-span-2 flex items-center justify-between gap-3"><ToConfirm>family pricing, who may be on one plan, and what happens when one member pauses or leaves</ToConfirm><button onClick={() => notify('New family plan: choose the payer, the members and the monthly amount')} className="btn-primary">+ New family plan</button></div>
        </div>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <label className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" /><input value={f.q} onChange={(e) => set('q', e.target.value)} placeholder="Search patient…" className="input w-56 py-2 pl-9" /></label>
            {sel_('Status', 'status', ['All', 'Paid', 'Failed', 'Retry scheduled', 'Hold proposed', 'Scheduled', 'Refunded'])}
            {sel_('Plan', 'plan', ['All', 'Individual', 'Family'])}
            {sel_('Charge', 'charge', ['All', 'Membership · month', 'A&P assessment'])}
            {sel_('Dates', 'period', ['All', ...Object.keys(periods), 'Custom'])}
            {f.period === 'Custom' && <span className="flex items-center gap-1.5 text-xs text-sand-500"><input type="date" className="input w-auto py-1 text-sm" value={f.from} max={f.to} onChange={(e) => set('from', e.target.value)} />to<input type="date" className="input w-auto py-1 text-sm" value={f.to} min={f.from} onChange={(e) => set('to', e.target.value)} /></span>}
            {active > 0 && <button onClick={() => setF(blank)} className="btn-ghost px-2 py-1 text-xs"><X size={13} /> Clear {active}</button>}
            <div className="ml-auto flex flex-wrap items-center gap-1.5">
              {views.map((v) => <span key={v.name} className="inline-flex items-center rounded-full border border-sand-300 bg-white text-xs"><button onClick={() => { setTab(v.tab); setF(v.f) }} className="py-1 pl-3 pr-1.5 font-medium text-sand-800">{v.name}</button><button aria-label={`Delete view ${v.name}`} onClick={() => saveViews(views.filter((x) => x.name !== v.name))} className="py-1 pl-0.5 pr-2 text-sand-400 hover:text-bad-700"><X size={12} /></button></span>)}
              <button onClick={() => { const name = window.prompt('Name this view', f.status !== 'All' ? f.status : f.period !== 'All' ? f.period : 'My view'); if (name) { saveViews([...views.filter((v) => v.name !== name), { name, tab, f }]); notify(`View “${name}” saved for ${me.name}`) } }} className="btn-secondary px-3 py-1.5 text-[11px]"><Bookmark size={13} /> Save view</button>
            </div>
          </div>
          <div className={`grid gap-5 ${sel ? 'xl:grid-cols-3' : ''}`}>
            <div className={sel ? 'xl:col-span-2' : ''}><QueueTable rows={rows} columns={sel ? cols.filter((c) => !['mem', 'last', 'plan'].includes(c.key)) : cols} rowKey={(r) => r.id} rowTone={(r) => tone[statusOf(r)]} onRowClick={setSel} empty="No payments match these filters." /><p className="mt-2 text-xs text-sand-500">{rows.length} payments · ${rows.reduce((n, p) => n + p.amount, 0).toLocaleString()} total · open a row for details</p></div>
            {sel && (
              <Card title={nameOf(sel.patientId)} subtitle={`${sel.type === 'A&P assessment' ? 'A&P assessment' : 'Membership'} · ${sel.period} · ${sel.method}`} actions={<button aria-label="Close details" onClick={() => setSel(null)} className="btn-ghost px-2 py-1"><X size={15} /></button>}>
                <Row label="Amount">${sel.amount.toLocaleString()}</Row>
                <Row label="Date">{sel.date}</Row>
                <Row label="Payment status"><Pill tone={tone[statusOf(sel)]}>{statusOf(sel)}</Pill></Row>
                <Row label="Plan">{planOf(sel.patientId)}</Row>
                <Row label="Membership">{membershipOf(sel.patientId)}</Row>
                <Row label="Last processed payment">{(() => { const l = lastPaidOf(sel.patientId); return l ? `$${l.amount.toLocaleString()} · ${l.date}` : 'None yet' })()}</Row>
                <Row label="Attempts">{sel.attempt || '—'}</Row>
                {sel.reason && <Row label="Reason">{sel.reason}</Row>}
                {statusOf(sel) === 'Hold proposed' && <div className="mt-3"><Notice tone="warn" icon={<AlertOctagon size={16} />} title="Scheduling hold eligible (day 5)">Two retries failed. A hold on new bookings can be applied <strong>only with your confirmation</strong>. Care and existing appointments are not affected; the patient is never discharged automatically.</Notice></div>}
                {statusOf(sel) === 'Failed' && <div className="mt-3"><Notice tone="info">The patient was notified right away. Automatic retry on day 3 (Oct 10) and day 5 (Oct 12).</Notice></div>}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {['Paid', 'Refunded'].includes(statusOf(sel)) && <><button onClick={() => setReceipt(sel)} className="btn-primary"><FileText size={14} /> See receipt</button><button onClick={() => notify('Receipt sent again to the patient by email')} className="btn-secondary">Send receipt again</button></>}
                  {['Failed', 'Hold proposed', 'Retry scheduled'].includes(statusOf(sel)) && <>
                    <button onClick={() => { setDone({ ...done, [sel.id]: 'Paid' }); notify(`Retry went through · $${sel.amount.toLocaleString()} collected · receipt sent`) }} className="btn-primary"><RotateCw size={14} /> Retry payment now</button>
                    <button onClick={() => notify('Link to update the payment method sent to the patient')} className="btn-secondary">Send update link</button>
                    <button onClick={() => notify('Call logged in the patient’s communication log')} className="btn-secondary"><Phone size={14} /> Log call</button>
                    {statusOf(sel) === 'Hold proposed' ? <button onClick={() => notify('Scheduling hold applied · approved by Karina · patient notified')} className="btn-danger">Confirm scheduling hold</button> : <button className="btn-ghost text-xs" disabled title="A hold can be proposed after two failed retries">Hold not yet eligible</button>}
                  </>}
                  {statusOf(sel) === 'Scheduled' && <><button onClick={() => notify('Reminder sent to the patient')} className="btn-secondary">Send reminder</button><button onClick={() => notify('Charge moved: choose the new date')} className="btn-secondary">Change date</button></>}
                </div>
                <a href={`#/staff/registry/${sel.patientId}`} className="mt-3 block text-sm text-teal-700 underline">Open membership</a>
                <div className="mt-5"><div className="eyebrow mb-2">Payment history</div><ul className="divide-y divide-sand-100">{payments.filter((p) => p.patientId === sel.patientId).map((p) => <li key={p.id} className="flex items-center justify-between gap-2 py-1.5 text-sm"><span>{p.period}<span className="block text-xs text-sand-500">{p.date}</span></span><span className="flex items-center gap-2"><span className="font-medium">${p.amount.toLocaleString()}</span><Pill tone={tone[statusOf(p)]} dot={false}>{statusOf(p)}</Pill></span></li>)}</ul></div>
                {sel.comms.length > 0 && <div className="mt-5"><div className="eyebrow mb-2">Communication history</div><AuditList compact entries={sel.comms} /></div>}
                {['Failed', 'Hold proposed'].includes(statusOf(sel)) && <div className="mt-4"><Field label="Note"><input className="input" placeholder="e.g., Spoke with patient; new card coming Friday" onKeyDown={(e) => { if (e.key === 'Enter' && (e.target as HTMLInputElement).value) { notify('Billing note saved to the patient record'); (e.target as HTMLInputElement).value = '' } }} /></Field><p className="help mt-1">Press Enter to save as a billing note.</p></div>}
              </Card>
            )}
          </div>
        </>
      )}

      {receipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label="Receipt" onClick={() => setReceipt(null)}>
          <div className="card w-full max-w-sm p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center"><div className="eyebrow">Helixona · Receipt</div><div className="mt-2 font-display text-4xl font-semibold text-sand-900">${receipt.amount.toLocaleString()}.00</div><Pill tone={tone[statusOf(receipt)]}>{statusOf(receipt)}</Pill></div>
            <div className="mt-4 text-sm"><Row label="Patient">{nameOf(receipt.patientId)}</Row><Row label="For">{receipt.type === 'A&P assessment' ? 'A&P assessment' : `Membership · ${receipt.period}`}</Row><Row label="Date">{receipt.date}</Row><Row label="Paid with">{receipt.method}</Row></div>
            <div className="mt-5 flex gap-2"><button onClick={() => notify('Receipt downloaded as PDF')} className="btn-secondary flex-1">Download PDF</button><button onClick={() => setReceipt(null)} className="btn-primary flex-1">Close</button></div>
          </div>
        </div>
      )}
    </>
  )
}
