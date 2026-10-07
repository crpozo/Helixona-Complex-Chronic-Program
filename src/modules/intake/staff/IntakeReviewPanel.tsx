import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, CornerUpLeft, FileText, StickyNote } from 'lucide-react'
import { AuditList, Card, Field, Pill, Row, Toast, VersionTag, toneFor } from '../../../components/ui'
import type { Patient, UploadItem } from '../../../mock/types'

/** Completeness checklist + actions. Shared by the Intake review queue and the patient detail tab. */
export default function IntakeReviewPanel({ patient }: { patient: Patient }) {
  const nav = useNavigate()
  const [uploads, setUploads] = useState<UploadItem[]>(patient.uploads)
  const [returning, setReturning] = useState<UploadItem | null>(null)
  const [reason, setReason] = useState('Document is incomplete or unreadable')
  const [note, setNote] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [followUp, setFollowUp] = useState('')
  const [ready, setReady] = useState(patient.chartPrep === 'Ready for chart prep' || patient.chartPrep === 'Placed in eCW')

  const show = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2200) }
  const requiredUploads = uploads.filter((u) => u.required)
  const sectionsDone = patient.intake ? Object.values(patient.intake.sections).filter((s) => s === 'complete').length : 0
  const sectionsTotal = patient.intake ? Object.keys(patient.intake.sections).length : 0
  const formsSigned = patient.forms.filter((f) => f.status === 'signed').length
  const blockers = [
    ...(patient.intake?.progress !== 100 ? ['Questionnaire not fully submitted'] : []),
    ...requiredUploads.filter((u) => u.status !== 'uploaded').map((u) => `${u.label}: ${u.status === 'returned' ? 'waiting for patient' : 'missing'}`),
    ...(formsSigned < patient.forms.length ? [`${patient.forms.length - formsSigned} form(s) unsigned`] : []),
  ]

  const doReturn = () => {
    if (!returning) return
    setUploads((xs) => xs.map((x) => (x.key === returning.key ? { ...x, status: 'returned', note: note || reason } : x)))
    setReturning(null); setNote('')
    show('Item returned to patient · text + email sent')
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Toast message={toast} />
      <div className="lg:col-span-2 space-y-5">
        <Card title="Completeness checklist" subtitle={`Questionnaire v${patient.intake?.version ?? '—'} · ${patient.intake?.submittedAt ? `submitted ${patient.intake.submittedAt}` : 'not yet submitted'}`}
          actions={<Pill tone={blockers.length ? 'warn' : 'ok'}>{blockers.length ? `${blockers.length} open item${blockers.length > 1 ? 's' : ''}` : 'Complete'}</Pill>}>
          <div className="divide-y divide-sand-100">
            <ChecklistRow ok={patient.intake?.progress === 100} label="Health questionnaire" detail={patient.intake ? `${sectionsDone} of ${sectionsTotal || 7} sections · ${patient.intake.progress}%` : 'Not started'} />
            {uploads.map((u) => (
              <ChecklistRow key={u.key} ok={u.status === 'uploaded'} optional={!u.required} label={u.label}
                detail={u.status === 'uploaded' ? u.files.map((f) => `${f.name} (${f.size}, ${f.uploadedAt})`).join(' · ') : u.status === 'returned' ? `Returned to patient · ${u.note}` : u.required ? 'Missing' : 'Not provided (optional)'}
                tone={toneFor(u.status)}
                action={u.status === 'uploaded' ? <button onClick={() => setReturning(u)} className="btn-ghost px-2 py-1 text-xs"><CornerUpLeft size={13} /> Return to patient</button> : u.status === 'missing' ? <button onClick={() => show('Reminder sent to patient')} className="btn-ghost px-2 py-1 text-xs">Remind</button> : null} />
            ))}
            {patient.forms.map((f) => <ChecklistRow key={f.key} ok={f.status === 'signed'} label={f.title} detail={f.status === 'signed' ? `Signed ${f.signedAt} · ${f.method} · ${f.version}` : `${f.status === 'viewed' ? 'Viewed, not signed' : 'Not signed'} · ${f.version}`} tone={f.status === 'signed' ? 'ok' : 'warn'} />)}
          </div>
        </Card>

        {returning && (
          <Card title={`Return “${returning.label}” to the patient`} subtitle="The patient gets a plain-language text and email with a link straight to this item.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Reason" required><select className="input" value={reason} onChange={(e) => setReason(e.target.value)}><option>Document is incomplete or unreadable</option><option>Wrong document uploaded</option><option>Document has expired</option><option>Pages missing</option></select></Field>
              <Field label="Message to patient (optional)"><input className="input" placeholder="e.g., Please include pages 3–4" value={note} onChange={(e) => setNote(e.target.value)} /></Field>
            </div>
            <div className="mt-3 flex gap-2"><button onClick={doReturn} className="btn-primary">Return item</button><button onClick={() => setReturning(null)} className="btn-ghost">Cancel</button></div>
          </Card>
        )}

        <Card title="Non-clinical follow-up note" subtitle="Operational notes only (scheduling, documents, contact). Never part of the medical record." actions={<StickyNote size={16} className="text-sand-400" />}>
          <textarea rows={3} className="input" placeholder="e.g., Called patient about lab pages; will re-upload tonight." value={followUp} onChange={(e) => setFollowUp(e.target.value)} />
          <div className="mt-2 flex items-center justify-between"><span className="help">Saved as Ana (advisor) · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span><button onClick={() => { if (followUp) { show('Note saved'); setFollowUp('') } }} className="btn-secondary px-3 py-1.5 text-xs">Save note</button></div>
          <div className="mt-4"><AuditList compact entries={[{ actor: 'Ana (advisor)', when: 'Oct 1, 2026 · 9:04 AM', action: 'Texted patient about lab pages; she will re-upload this week.' }]} /></div>
        </Card>
      </div>

      <div className="space-y-5">
        <Card title="Mark ready for chart prep">
          {ready ? (
            <div className="rounded-xl bg-ok-100 p-3 text-sm text-ok-700"><div className="flex items-center gap-2 font-semibold"><CheckCircle2 size={16} /> Ready for chart prep</div><div className="mt-1">Charlene's queue has this patient. The eCW connector job is queued.</div><button onClick={() => nav(`/staff/chart-prep/${patient.id}`)} className="btn-secondary mt-3 w-full">Open chart prep view</button></div>
          ) : (
            <>
              {blockers.length > 0 ? (
                <ul className="space-y-1 text-sm text-warn-700">{blockers.map((b) => <li key={b} className="flex gap-2"><span>•</span>{b}</li>)}</ul>
              ) : <p className="text-sm text-sand-600">All required items are present. Marking ready queues the eCW note and PDF for Charlene.</p>}
              <button disabled={blockers.length > 0} onClick={() => { setReady(true); show('Marked ready for chart prep · eCW job queued') }} className="btn-primary mt-4 w-full"><CheckCircle2 size={16} /> Mark ready for chart prep</button>
              {blockers.length > 0 && <button onClick={() => { setReady(true); show('Marked ready with exceptions noted') }} className="btn-ghost mt-1 w-full text-xs">Mark ready anyway (reason required)</button>}
            </>
          )}
        </Card>
        <Card title="Package summary">
          <Row label="Questionnaire"><VersionTag>v{patient.intake?.version ?? '—'}</VersionTag></Row>
          <Row label="Documents">{uploads.filter((u) => u.status === 'uploaded').reduce((n, u) => n + u.files.length, 0)} files</Row>
          <Row label="Forms">{formsSigned} / {patient.forms.length} signed</Row>
          <Row label="Reviewer">Ana (advisor)</Row>
          <Row label="Chart prep status"><Pill tone={toneFor(ready ? 'Ready for chart prep' : patient.chartPrep)}>{ready && patient.chartPrep !== 'Placed in eCW' ? 'Ready for chart prep' : patient.chartPrep}</Pill></Row>
        </Card>
        <Card title="Patient's view" subtitle="What the patient sees on their phone right now.">
          <div className="flex items-center gap-2 text-sm text-sand-700"><FileText size={15} className="text-sand-400" /> “Add the missing pages of your lab report”</div>
          <p className="help mt-2">Returned items appear as the patient's next step on their program home.</p>
        </Card>
      </div>
    </div>
  )
}

function ChecklistRow({ ok, optional, label, detail, tone, action }: { ok: boolean; optional?: boolean; label: string; detail: string; tone?: Parameters<typeof Pill>[0]['tone']; action?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${ok ? 'bg-ok-100 text-ok-700' : optional ? 'bg-sand-100 text-sand-400' : 'bg-warn-100 text-warn-700'}`}>{ok ? '✓' : optional ? '–' : '!'}</span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-sand-900">{label}{optional && <span className="text-xs font-normal text-sand-400">optional</span>}</div>
        <div className="text-xs text-sand-500 break-words">{detail}</div>
      </div>
      {tone && !ok && !optional && <Pill tone={tone} dot={false}>{detail.startsWith('Returned') ? 'Returned' : /signed/i.test(detail) ? 'Not signed' : 'Missing'}</Pill>}
      {action}
    </div>
  )
}
