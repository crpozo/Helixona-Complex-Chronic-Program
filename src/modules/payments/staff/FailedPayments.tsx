import { useState } from 'react'
import { AlertOctagon, Phone, RotateCw } from 'lucide-react'
import { AuditList, Card, Field, Notice, PageHeader, Pill, QueueTable, Row, Stat, Tabs, ToConfirm, Toast, type Column, type Tone } from '../../../components/ui'
import { payments, type Payment } from '../../../mock/program'

const tone: Record<Payment['status'], Tone> = { Paid: 'ok', Failed: 'bad', 'Retry scheduled': 'warn', 'Hold proposed': 'bad', Refunded: 'info', Scheduled: 'neutral' }

export default function FailedPayments() {
  const [tab, setTab] = useState('queue')
  const [sel, setSel] = useState<Payment | null>(payments[1])
  const [toast, setToast] = useState<string | null>(null)
  const show = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2200) }
  const rows = payments.filter((p) => (tab === 'queue' ? ['Failed', 'Retry scheduled', 'Hold proposed'].includes(p.status) : tab === 'upcoming' ? p.status === 'Scheduled' : true))
  const cols: Column<Payment>[] = [
    { key: 'p', header: 'Patient · payment', render: (r) => <><div className="font-semibold text-sand-900">{r.patientId}</div><div className="text-xs text-sand-500">{r.id} · {r.type} · {r.period}</div></> },
    { key: 'amt', header: 'Amount', render: (r) => <span className="font-medium">${r.amount.toLocaleString()}</span> },
    { key: 'date', header: 'Date', render: (r) => r.date },
    { key: 'st', header: 'Status', render: (r) => <Pill tone={tone[r.status]}>{r.status}</Pill> },
    { key: 'att', header: 'Attempt', render: (r) => r.attempt || '—' },
    { key: 'reason', header: 'Reason', render: (r) => <span className="text-xs text-sand-600">{r.reason ?? '—'}</span> },
    { key: 'next', header: 'Next action', render: (r) => <span className="text-xs">{r.nextAction ?? '—'}</span> },
  ]
  return (
    <>
      <Toast message={toast} />
      <PageHeader eyebrow="Payments · Operations (Karina)" title="Payments" description="Stripe handles card and bank details; this app stores only references, statuses and reconciliation data. A failed payment creates a task here and never discharges a patient or changes care." meta={<ToConfirm>retry cadence, grace period, hold policy, refunds (Karina + attorney)</ToConfirm>} actions={<button className="btn-secondary">Reconciliation report</button>} />
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat label="Failed · open" value={payments.filter((p) => p.status === 'Failed').length} tone="bad" />
        <Stat label="Holds needing approval" value={payments.filter((p) => p.status === 'Hold proposed').length} hint="human decision" tone="bad" />
        <Stat label="Due in 7 days" value="$6,000" hint="3 members" tone="neutral" />
        <Stat label="Collected · Oct" value="$7,500" tone="ok" />
        <Stat label="Refunds · 30 d" value="$2,000" tone="info" />
      </div>
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'queue', label: 'Failed-payment queue', count: payments.filter((p) => ['Failed', 'Retry scheduled', 'Hold proposed'].includes(p.status)).length }, { key: 'upcoming', label: 'Upcoming' }, { key: 'all', label: 'All payments' }]} />
      <div className="grid gap-5 xl:grid-cols-5">
        <div className="xl:col-span-3"><QueueTable rows={rows} columns={cols} rowKey={(r) => r.id} rowTone={(r) => tone[r.status]} onRowClick={setSel} /></div>
        <div className="xl:col-span-2">
          {sel && (
            <Card title={`${sel.id} · ${sel.patientId}`} subtitle={`${sel.type} · ${sel.period} · ${sel.method}`} actions={<Pill tone={tone[sel.status]}>{sel.status}</Pill>}>
              <Row label="Amount">${sel.amount.toLocaleString()}</Row>
              <Row label="Attempts">{sel.attempt}</Row>
              <Row label="Reason category">{sel.reason ?? '—'}</Row>
              <Row label="Patient contact">(949) 555-01•• · m•••••@example.com</Row>
              <Row label="Stripe reference">pi_3Q…{sel.id.slice(-3)}</Row>
              {sel.status === 'Hold proposed' && <div className="mt-3"><Notice tone="warn" icon={<AlertOctagon size={16} />} title="Scheduling hold eligible (day 5)">Two retries failed. A hold on new bookings can be applied <strong>only with your confirmation</strong>. Clinical care and existing appointments are not affected; the patient is never discharged automatically.</Notice></div>}
              {sel.status === 'Failed' && <div className="mt-3"><Notice tone="info">Patient was notified immediately. Automatic retry on day 3 (Oct 10) and day 5 (Oct 12) per configured policy.</Notice></div>}
              {(sel.status === 'Failed' || sel.status === 'Hold proposed') && (
                <div className="mt-4 space-y-2">
                  <Field label="Note" required><input className="input" placeholder="e.g., Spoke with patient; new card coming Friday" /></Field>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => show('Retry requested in Stripe')} className="btn-secondary"><RotateCw size={14} /> Retry now</button>
                    <button onClick={() => show('Call logged · communication history updated')} className="btn-secondary"><Phone size={14} /> Log call</button>
                    <button onClick={() => show('Payment-method update link sent to patient')} className="btn-secondary">Send update link</button>
                    {sel.status === 'Hold proposed' ? <button onClick={() => show('Scheduling hold applied · approved by Karina · patient notified')} className="btn-danger">Confirm scheduling hold</button> : <button className="btn-ghost text-xs" disabled>Hold not yet eligible</button>}
                  </div>
                  <p className="help">Pause, cancellation, refund and write-off are staff-approved workflows with reason, effective date, financial effect, patient notice and audit history.</p>
                </div>
              )}
              <div className="mt-5"><div className="eyebrow mb-2">Communication history</div><AuditList compact entries={sel.comms} /></div>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
