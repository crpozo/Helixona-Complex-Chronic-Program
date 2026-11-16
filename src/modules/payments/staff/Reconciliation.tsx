import { useState } from 'react'
import { Download } from 'lucide-react'
import { Breadcrumb, Card, Notice, PageHeader, Pill, Row, Stat } from '../../../components/ui'
import { payouts } from '../../../mock/billing'
import { notify } from '../../../mock/store'

/** Reconciliation: what Stripe paid out against what reached the bank, by payout, for a chosen month. */
export default function Reconciliation() {
  const months = Object.keys(payouts)
  const [month, setMonth] = useState(months[0])
  const [only, setOnly] = useState(false)
  const all = payouts[month]
  const rows = all.filter((p) => !only || p.bank !== 'Matched')
  const t = (k: 'gross' | 'fees' | 'refunds' | 'net') => all.reduce((n, p) => n + p[k], 0)
  const open = all.filter((p) => p.bank !== 'Matched')
  const $ = (n: number) => `$${n.toLocaleString()}`
  return (
    <>
      <Breadcrumb items={[{ label: 'Payments', to: '/staff/payments' }, { label: 'Reconciliation report' }]} />
      <PageHeader eyebrow="Membership · Payments" title="Reconciliation report" description="Compares what was charged in the app, what Stripe paid out and what arrived in the bank. Anything that does not match is listed for a person to check."
        actions={<><select className="input w-auto" value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Month">{months.map((m) => <option key={m}>{m}</option>)}</select><button onClick={() => notify(`Reconciliation for ${month} exported · logged`)} className="btn-secondary"><Download size={15} /> Export</button></>} />
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat label="Charged" value={$(t('gross'))} hint={`${all.reduce((n, p) => n + p.charges, 0)} charges`} tone="neutral" />
        <Stat label="Refunds" value={$(t('refunds'))} tone="info" />
        <Stat label="Stripe fees" value={$(t('fees'))} tone="neutral" />
        <Stat label="Paid out" value={$(t('net'))} tone="ok" />
        <Stat label="To check" value={open.length} hint={open.length ? 'does not match bank' : 'all matched'} tone={open.length ? 'bad' : 'ok'} />
      </div>
      {open.length > 0 && <div className="mb-4"><Notice tone="warn" title={`${open.length} payout${open.length > 1 ? 's' : ''} to check`}>{open.map((p) => `${p.date}: ${p.note}`).join(' · ')}</Notice></div>}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Payouts" subtitle="One row per Stripe payout." actions={<label className="flex items-center gap-1.5 text-sm text-sand-700"><input type="checkbox" checked={only} onChange={(e) => setOnly(e.target.checked)} className="h-4 w-4 accent-[#141414]" />Only items to check</label>} padded={false}>
            <table className="w-full text-sm">
              <thead><tr className="bg-sand-50 text-left"><th className="px-5 py-2 eyebrow">Payout date</th><th className="px-3 py-2 eyebrow">Charges</th><th className="px-3 py-2 eyebrow text-right">Charged</th><th className="px-3 py-2 eyebrow text-right">Refunds</th><th className="px-3 py-2 eyebrow text-right">Fees</th><th className="px-3 py-2 eyebrow text-right">Paid out</th><th className="px-5 py-2 eyebrow">Bank</th></tr></thead>
              <tbody>
                {rows.map((p) => <tr key={p.date} className="border-t border-sand-100 align-top"><td className="px-5 py-2.5 font-medium">{p.date}{p.note && <div className="text-xs font-normal text-sand-500">{p.note}</div>}</td><td className="px-3 py-2.5">{p.charges}</td><td className="px-3 py-2.5 text-right">{$(p.gross)}</td><td className="px-3 py-2.5 text-right">{p.refunds ? `−${$(p.refunds)}` : '—'}</td><td className="px-3 py-2.5 text-right">−{$(p.fees)}</td><td className="px-3 py-2.5 text-right font-semibold">{$(p.net)}</td><td className="px-5 py-2.5"><Pill tone={p.bank === 'Matched' ? 'ok' : p.bank === 'Amount differs' ? 'bad' : 'warn'}>{p.bank}</Pill>{p.bank !== 'Matched' && <button onClick={() => notify(`Marked as checked by Karina · ${p.date}`)} className="mt-1 block text-xs text-teal-700 underline">Mark as checked</button>}</td></tr>)}
                {rows.length === 0 && <tr><td colSpan={7} className="px-5 py-6 text-center text-sand-500">Everything matches for {month}.</td></tr>}
                <tr className="border-t-2 border-sand-300 bg-sand-50 font-semibold"><td className="px-5 py-2.5">Total · {month}</td><td className="px-3 py-2.5">{all.reduce((n, p) => n + p.charges, 0)}</td><td className="px-3 py-2.5 text-right">{$(t('gross'))}</td><td className="px-3 py-2.5 text-right">−{$(t('refunds'))}</td><td className="px-3 py-2.5 text-right">−{$(t('fees'))}</td><td className="px-3 py-2.5 text-right">{$(t('net'))}</td><td /></tr>
              </tbody>
            </table>
          </Card>
        </div>
        <Card title="How to read this">
          <Row label="Charged">Payments recorded in the app</Row>
          <Row label="Paid out">What Stripe sent to the bank</Row>
          <Row label="Bank">Compared with the bank statement</Row>
          <p className="help mt-3">Charged − refunds − fees should equal paid out. Bank deposits are matched by amount and date; ACH payouts can take two business days.</p>
          <p className="help mt-2">Exports are logged with who ran them and when.</p>
        </Card>
      </div>
    </>
  )
}
