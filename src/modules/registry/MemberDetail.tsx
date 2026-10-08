import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuditList, Breadcrumb, Card, Field, Notice, PageHeader, Pill, Row, Tabs, toneFor } from '../../components/ui'
import { members, statusCatalog } from '../../mock/program'
import { patientById } from '../../mock/patients'
import { JourneyStrip } from '../intake/staff/PatientDetail'

export default function MemberDetail() {
  const { id = '' } = useParams()
  const m = members.find((x) => x.id === id) ?? members[0]
  const p = patientById(m.id)
  const [tab, setTab] = useState('timeline')
  const [next, setNext] = useState<string>('')
  const cat = statusCatalog.find((c) => c.status === m.status)
  const fullHistory = [...m.history, m.lastChange].filter((h, i, a) => a.findIndex((x) => x.when === h.when && x.action === h.action) === i).reverse()
  return (
    <>
      <Breadcrumb items={[{ label: 'Membership registry', to: '/staff/registry' }, { label: m.id }]} />
      <PageHeader eyebrow={`${m.id}${p ? ` · eCW ${p.ecwId}` : ''}`} title={p ? `${p.firstName} ${p.lastName}` : m.id} meta={<><Pill tone={toneFor(m.status)}>{m.status}</Pill><span>{cat?.phase}</span><span>· {m.activeMonths} active months</span></>} actions={<button className="btn-primary">Update status</button>} />
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs value={tab} onChange={setTab} tabs={[{ key: 'timeline', label: 'Status history' }, { key: 'dates', label: 'Dates & months' }, { key: 'transition', label: 'Change status' }, { key: 'rules', label: 'Lifecycle rules' }]} />
          {tab === 'timeline' && <Card title="Status history" subtitle="Every change with actor, timestamp, reason code and supporting task or document."><AuditList entries={fullHistory} /></Card>}
          {tab === 'dates' && (
            <Card title="Key dates">
              <Row label="Month 0">{m.month0Start ?? '—'}{m.month0End ? ` → ${m.month0End}` : ''}</Row>
              <Row label="Membership start">{m.membershipStart ?? '—'}</Row>
              <Row label="Initial nine-month end">{m.nineMonthEnd ?? '—'}</Row>
              <Row label="Pauses">{m.pauses.length ? m.pauses.map((pp) => `${pp.from} → ${pp.to} (${pp.reason})`).join('; ') : 'None'}</Row>
              <Row label="Month 9 review">{m.month9Review ?? 'Not yet scheduled'}</Row>
              <Row label="Total months in active care">{m.activeMonths}</Row>
              <Row label="Monthly amount">{m.monthlyAmount ? `$${m.monthlyAmount.toLocaleString()}` : '—'}</Row>
              <p className="help mt-3">Month 0 is a separate one-time charge and never counts toward the nine-month membership.</p>
            </Card>
          )}
          {tab === 'transition' && (
            <Card title="Change status" subtitle="Only allowed transitions are offered. Required fields, tasks and notifications come from the lifecycle rules.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="New status" required><select className="input" value={next} onChange={(e) => setNext(e.target.value)}><option value="">Select…</option>{allowedFrom(m.status).map((s) => <option key={s}>{s}</option>)}</select></Field>
                <Field label="Effective date" required><input type="date" className="input" /></Field>
                <Field label="Reason code" required><select className="input"><option>Select…</option><option>PAU-01 · Travel</option><option>PAU-02 · Clinical need</option><option>CON-01 · Physician + patient agree to continue</option><option>MNT-01 · Transition to maintenance</option><option>GRA-01 · Goals reached</option><option>WDR-01 · Patient choice</option><option>DIS-01 · Helixona decision</option></select></Field>
                <Field label="Supporting task or document"><input className="input" placeholder="e.g., Month 9 review note" /></Field>
                <div className="sm:col-span-2"><Field label="Notes"><textarea rows={2} className="input" /></Field></div>
              </div>
              {next && <div className="mt-4"><Notice tone={/discharg|withdraw|graduat/i.test(next) ? 'warn' : 'teal'} title={`Effects of “${next}”`}>{effects(next)}</Notice></div>}
              <div className="mt-4 flex items-center gap-3"><button disabled={!next} className="btn-primary">Record status change</button><span className="help">Recorded as Karina · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
            </Card>
          )}
          {tab === 'rules' && (
            <Card title="Lifecycle rules" subtitle="Configured in admin · version 2 · approved by Cassandra on Sep 12, 2026." padded={false}>
              <table className="w-full text-sm"><thead><tr className="bg-sand-50 text-left"><th className="px-5 py-2 eyebrow">Status</th><th className="px-3 py-2 eyebrow">Phase</th><th className="px-3 py-2 eyebrow">System action</th><th className="px-3 py-2 eyebrow">Needs a person</th></tr></thead><tbody>
                {statusCatalog.map((c) => <tr key={c.status} className={`border-t border-sand-100 ${c.status === m.status ? 'bg-teal-50' : ''}`}><td className="px-5 py-2"><Pill tone={toneFor(c.status)}>{c.status}</Pill></td><td className="px-3 py-2 text-sand-600">{c.phase}</td><td className="px-3 py-2 text-sand-700">{c.action}</td><td className="px-3 py-2 text-xs text-sand-600">{/denied|discharged|withdrawn|graduated|offered|paused|continued|maintenance/i.test(c.status) ? 'Yes · never automatic' : 'Automatic allowed'}</td></tr>)}
              </tbody></table>
            </Card>
          )}
        </div>
        <div className="space-y-5">
          <Card title="Journey"><JourneyStrip status={m.status} /></Card>
          <Card title="Links">
            <Row label="Intake / chart prep">{p ? <a className="text-teal-700 underline" href={`#/staff/patients/${m.id}`}>Open record</a> : '—'}</Row>
            <Row label="Payments"><a className="text-teal-700 underline" href="#/staff/payments">Payment history</a></Row>
            <Row label="Surveys & alerts"><a className="text-teal-700 underline" href={`#/staff/alerts/patient/${m.id}`}>Longitudinal view</a></Row>
          </Card>
        </div>
      </div>
    </>
  )
}

function allowedFrom(s: string): string[] {
  if (s === 'Active member') return ['Temporarily paused', 'Month 9 review', 'Withdrawn', 'Discharged']
  if (s === 'Temporarily paused') return ['Active member', 'Withdrawn']
  if (s === 'Month 9 review') return ['Continued active care', 'Maintenance', 'Graduated', 'Withdrawn', 'Discharged']
  if (s === 'Month 0 in progress') return ['Plan of Care completed', 'Patient fell off']
  if (s === 'Plan of Care completed') return ['Program offered', 'Program not offered']
  if (s === 'Program offered') return ['Contract pending', 'Patient declined']
  if (s === 'Contract pending') return ['Payment pending', 'Patient declined']
  if (s === 'Payment pending') return ['Active member']
  if (s === 'Accepted for Month 0') return ['Month 0 scheduled', 'Patient fell off']
  if (s === 'Month 0 scheduled') return ['Month 0 in progress']
  return ['Advisor outreach', 'Insurance benefits review', 'Admissions review']
}
function effects(s: string) {
  const map: Record<string, string> = {
    'Temporarily paused': 'Recurring payment paused · surveys paused · existing bookings kept, new bookings blocked · patient notice “Pause confirmed” · term end extended by pause length.',
    'Month 9 review': 'Physician review task created · patient email “Planning your next step” · recurring payment continues until decision.',
    'Continued active care': 'Recurring $2,000/month continues · month count continues · continuation authorization recorded.',
    'Maintenance': 'Maintenance rules apply · scheduling limited to maintenance modalities · payment plan per maintenance agreement.',
    'Graduated': 'Recurring plan closed · final receipt · record preserved · patient email. Requires physician decision; never automatic.',
    'Withdrawn': 'Approved financial workflow (final invoice / refund per policy) · communication workflow · access retained for records. Never automatic.',
    'Discharged': 'Approved access, payment, communication and documentation workflow · requires program admin approval. Never automatic.',
    'Program offered': 'Enables the membership agreement and payment setup for the patient. Contract is gated on this status.',
    'Contract pending': 'Agreement assigned · configurable reminders start.',
    'Payment pending': 'Financial follow-up starts · scheduling stays locked until payment authorized.',
    'Active member': 'Authorized scheduling and surveys enabled · welcome message.',
  }
  return map[s] ?? 'Standard transition · tasks and notifications per lifecycle rules.'
}
