import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Check, FileSignature } from 'lucide-react'
import { nameOf } from '../../mock/names'
import { familyOf } from '../../mock/billing'
import { addedHistory, changeStatus, currentUser, logEvent, notify, statusOf, useStore } from '../../mock/store'
import { AuditList, Breadcrumb, Card, Field, Notice, PageHeader, Pill, Row, Tabs, ToConfirm, toneFor } from '../../components/ui'
import { Actors, Roadmap } from '../../components/Roadmap'
import { planFor, stageLabel } from '../../mock/roadmap'
import { memberNames, members, statusCatalog } from '../../mock/program'
import { patientById } from '../../mock/patients'
import { JourneyStrip } from '../intake/staff/PatientDetail'

export default function MemberDetail() {
  const { id = '' } = useParams()
  const m = members.find((x) => x.id === id) ?? members[0]
  const p = patientById(m.id)
  useStore()
  const [sp, setSp] = useSearchParams()
  const tab = sp.get('tab') ?? 'timeline'
  const setTab = (t: string) => setSp({ tab: t })
  const [next, setNext] = useState<string>('')
  const [start, setStart] = useState('2026-10-09')
  const [end, setEnd] = useState('')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [sendAgreement, setSendAgreement] = useState(true)
  const [agreement, setAgreement] = useState<{ version: string; terms: string; sentAt: string } | null>(null)
  const status = statusOf(m)
  const changesContract = /Active|Paused|Maintenance/.test(next)
  const autoEnd = (iso: string) => { const d = new Date(iso + 'T12:00:00Z'); d.setUTCMonth(d.getUTCMonth() + 9); return d.toISOString().slice(0, 10) }
  const pickStatus = (v: string) => { setNext(v); setEnd(v.startsWith('Active · 9') ? autoEnd(start) : v === 'Paused' ? '2026-11-09' : '') }
  const fmt = (iso: string) => (iso ? new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : 'open-ended')
  const record = () => {
    changeStatus(m.id, next, `${reason.split(' · ')[0]} · ${fmt(start)} → ${fmt(end)}${notes ? ' · ' + notes : ''}`)
    if (changesContract && sendAgreement) { setAgreement({ version: 'v1.3', terms: next, sentAt: 'just now' }); logEvent(m.id, 'Agreement v1.3 sent for electronic signature', `${next} terms`) }
    notify(changesContract && sendAgreement ? `Status recorded · agreement sent to ${nameOf(m.id)} to sign` : 'Status recorded')
    setNext(''); setReason(''); setNotes('')
  }
  const cat = statusCatalog.find((c) => c.status === m.status)
  const fam = familyOf(m.id)
  const fullHistory = [...m.history, m.lastChange, ...addedHistory(m.id).map((h) => ({ ...h, when: h.when.replace(' · ', ' ') }))].filter((h, i, a) => a.findIndex((x) => x.when === h.when && x.action === h.action) === i).sort((a, b) => Date.parse(a.when) - Date.parse(b.when)).reverse()
  return (
    <>
      <Breadcrumb items={[{ label: 'Membership registry', to: '/staff/registry' }, { label: nameOf(m.id) }]} />
      <PageHeader eyebrow={`Membership${p ? ` · eCW ${p.ecwId}` : ''}${fam ? ` · ${fam.name}` : ''}`} title={p ? `${p.firstName} ${p.lastName}` : memberNames[m.id] ?? m.id} meta={<><Pill tone={toneFor(status)}>{status}</Pill><Pill tone="teal" dot={false}>{stageLabel(planFor(m.id).stage)}</Pill><span className="inline-flex items-center gap-2">Actors: <Actors size="sm" actors={planFor(m.id).actors} lead={planFor(m.id).leadActor} /></span><span className="hidden lg:block"><Roadmap current={planFor(m.id).stage} compact /></span><span>{cat?.phase}</span><span>· {m.activeMonths} active months</span></>} actions={<button className="btn-primary" onClick={() => setTab('transition')}>Update status</button>} />
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
            <Card title="Change status" subtitle="Records the new status with its dates and reason. If the terms change, the patient receives the updated agreement to sign electronically.">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><Field label="New status" required><select className="input" value={next} onChange={(e) => pickStatus(e.target.value)}><option value="">Select…</option>{membershipStatuses.filter((x) => x !== status).map((x) => <option key={x}>{x}</option>)}</select></Field></div>
                <Field label="Start date" required><input type="date" className="input" value={start} onChange={(e) => { setStart(e.target.value); if (next.startsWith('Active · 9')) setEnd(autoEnd(e.target.value)) }} /></Field>
                <Field label="End date" required={next.startsWith('Active · 9') || next === 'Paused'} hint={next.startsWith('Active · 9') ? 'Nine months after the start date.' : next === 'Paused' ? 'When the pause ends.' : /month-to-month|Maintenance/.test(next) ? 'Leave empty: continues until changed.' : undefined}><input type="date" className="input" value={end} min={start} onChange={(e) => setEnd(e.target.value)} /></Field>
                <div className="sm:col-span-2"><Field label="Reason code" required><select className="input" value={reason} onChange={(e) => setReason(e.target.value)}><option value="">Select…</option><option>ACT-01 · Agreement signed and first payment received</option><option>CON-01 · Physician and patient agree to continue</option><option>PAU-01 · Travel</option><option>PAU-02 · Clinical need</option><option>MNT-01 · Transition to maintenance</option><option>GRA-01 · Goals reached</option><option>WDR-01 · Patient choice</option><option>DIS-01 · Helixona decision</option></select></Field></div>
                <div className="sm:col-span-2"><Field label="Notes"><textarea rows={2} className="input" value={notes} onChange={(e) => setNotes(e.target.value)} /></Field></div>
              </div>
              {next && <div className="mt-4"><Notice tone={/Discharged|Withdrawn|Graduated/.test(next) ? 'warn' : 'teal'} title={`What “${next}” does`}>{effects(next)}</Notice></div>}
              {next && changesContract && (
                <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-teal-300 bg-teal-50/60 p-3.5">
                  <input type="checkbox" checked={sendAgreement} onChange={(e) => setSendAgreement(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#141414]" />
                  <span><span className="flex items-center gap-1.5 font-semibold text-sand-900"><FileSignature size={15} /> Send the updated agreement to sign</span><span className="mt-0.5 block text-sm text-sand-600">These terms change the membership agreement. {nameOf(m.id)} gets the new version by email and in the app, signs it electronically, and the signed copy is filed here. Reminders go out until it is signed.</span></span>
                </label>
              )}
              <div className="mt-4 flex items-center gap-3"><button disabled={!next || !reason || !start} onClick={record} className="btn-primary">Record status change</button><span className="help">Recorded as {currentUser().name} · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
              <div className="mt-3"><ToConfirm>e-signature provider and the agreement text for each status (attorney)</ToConfirm></div>
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
          <Card title="Membership agreement" subtitle="Signed electronically. A new version is sent whenever the terms change.">
            <Row label="Current">{agreement ? `${agreement.version} · ${agreement.terms}` : 'v1.2 · Active · 9-month program'}</Row>
            <Row label="Status">{agreement ? <Pill tone="warn">Sent · waiting for signature</Pill> : <Pill tone="ok">Signed</Pill>}</Row>
            {agreement && <ol className="mt-3 flex items-center text-xs">{['Sent', 'Opened', 'Signed'].map((st, i) => <li key={st} className="flex flex-1 items-center last:flex-none"><span className={`flex h-6 w-6 items-center justify-center rounded-full ${i === 0 ? 'bg-sand-900 text-white' : 'border border-sand-300 bg-white text-sand-500'}`}>{i === 0 ? <Check size={12} /> : i + 1}</span><span className={`ml-1.5 ${i === 0 ? 'font-semibold text-sand-900' : 'text-sand-500'}`}>{st}</span>{i < 2 && <span className="mx-2 h-px flex-1 bg-sand-300" />}</li>)}</ol>}
            <div className="mt-3 flex gap-2"><button onClick={() => notify('Signed agreement downloaded as PDF')} className="btn-secondary flex-1 px-2 py-2 text-[11px]">Signed copy</button><button onClick={() => { setAgreement({ version: 'v1.3', terms: status, sentAt: 'just now' }); logEvent(m.id, 'Agreement v1.3 sent for electronic signature'); notify(`Agreement sent to ${nameOf(m.id)} to sign`) }} className="btn-secondary flex-1 px-2 py-2 text-[11px]">{agreement ? 'Send reminder' : 'Send new version'}</button></div>
          </Card>
          <Card title="Journey"><JourneyStrip status={status} patientId={m.id} /></Card>
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

const membershipStatuses = ['Active · 9-month program', 'Active · month-to-month program', 'Paused', 'Maintenance', 'Graduated', 'Withdrawn', 'Discharged']
function effects(s: string) {
  const map: Record<string, string> = {
    'Active · 9-month program': 'Recurring $2,000 a month for nine months from the start date · booking and check-ins on · agreement for the nine-month term.',
    'Active · month-to-month program': 'Recurring $2,000 a month with no end date · continues until changed · month-to-month agreement.',
    'Paused': 'Monthly charge paused between the two dates · check-ins paused · sessions already booked are kept, new ones blocked · the term is extended by the length of the pause.',
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
