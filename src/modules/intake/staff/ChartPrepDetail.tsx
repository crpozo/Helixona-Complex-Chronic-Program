import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Bot, Check, ClipboardCopy, Download, FileText, Hand } from 'lucide-react'
import { AuditList, Breadcrumb, Card, Notice, PageHeader, Pill, Row, Tabs, ToConfirm, Toast, VersionTag, toneFor } from '../../../components/ui'
import { patientById } from '../../../mock/patients'
import { sampleAnswers, sections } from '../../../mock/questionnaire'

export default function ChartPrepDetail() {
  const { id = '' } = useParams()
  const p = patientById(id)
  const [path, setPath] = useState<'auto' | 'manual'>('auto')
  const [toast, setToast] = useState<string | null>(null)
  const [status, setStatus] = useState(p?.chartPrep ?? 'Awaiting intake')

  const note = useMemo(() => (p ? buildNote(p.id, p.ecwId, `${p.firstName} ${p.lastName}`, p.dob, p.firstName, p.intake?.version ?? 3, p.intake?.submittedAt ?? '—', p.uploads) : ''), [p])
  if (!p) return <Notice tone="bad">Patient not found.</Notice>

  const copy = async () => {
    try { await navigator.clipboard.writeText(note) } catch { /* mock */ }
    setToast('Note copied to clipboard'); setTimeout(() => setToast(null), 2000)
  }

  const steps = [
    ['Open patient by eCW ID', 'ok'], ['Confirm name + date of birth match', 'ok'], [`Check for existing note marker HLX:INT-${p.id.slice(2)}:v${p.intake?.version ?? 3}`, 'ok'],
    ['Paste note at Charlene\'s location', status === 'Exception' ? 'ok' : status === 'Placed in eCW' ? 'ok' : 'pending'], ['Read back note · verify', status === 'Exception' ? 'ok' : status === 'Placed in eCW' ? 'ok' : 'pending'],
    [`Upload Helixona_Intake_${p.id.slice(2)}_v${p.intake?.version ?? 3}.pdf`, status === 'Exception' ? 'ok' : status === 'Placed in eCW' ? 'ok' : 'pending'], ['Read back PDF · verify', status === 'Exception' ? 'bad' : status === 'Placed in eCW' ? 'ok' : 'pending'],
    ['Mark “Placed in eCW” · create review task', status === 'Placed in eCW' ? 'ok' : 'pending'],
  ] as const

  return (
    <>
      <Toast message={toast} />
      <Breadcrumb items={[{ label: 'Chart prep', to: '/staff/chart-prep' }, { label: p.id }]} />
      <PageHeader eyebrow={`${p.id} · eCW ${p.ecwId} · DOB ${p.dob}`} title={`${p.firstName} ${p.lastName}`}
        meta={<><Pill tone={toneFor(status)}>{status}</Pill><VersionTag>Questionnaire v{p.intake?.version ?? 3} · published by Dr. D. on Sep 15, 2026</VersionTag><span>Submitted {p.intake?.submittedAt ?? '—'}</span></>}
        actions={<><button onClick={copy} className="btn-primary"><ClipboardCopy size={16} /> Copy note to clipboard</button><button onClick={() => { setToast(`Downloading Helixona_Intake_${p.id.slice(2)}_v${p.intake?.version ?? 3}.pdf`); setTimeout(() => setToast(null), 2000) }} className="btn-secondary"><Download size={16} /> Download PDF</button></>} />

      <div className="grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-5">
          <Card title="Formatted note for eCW" subtitle="Plain text, numbered questions and answers, medication list, and document inventory. Paste as-is." actions={<ToConfirm>exact eCW note location with Charlene</ToConfirm>} padded={false}>
            <pre className="max-h-[560px] overflow-auto whitespace-pre-wrap px-5 py-4 font-mono text-[12.5px] leading-relaxed text-sand-800">{note}</pre>
          </Card>
          <Card title="Uploaded document inventory" subtitle="Also included at the end of the note and in the PDF.">
            <div className="divide-y divide-sand-100">
              {p.uploads.filter((u) => u.files.length).map((u) => (
                <div key={u.key} className="flex items-center gap-3 py-2 text-sm"><FileText size={15} className="text-sand-400" /><span className="w-56 shrink-0 text-sand-600">{u.label}</span><span className="flex-1 truncate text-sand-900">{u.files.map((f) => f.name).join(', ')}</span><span className="text-xs text-sand-500">{u.files[0].uploadedAt}</span></div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <Card title="Place in eCW" subtitle="Two ways to get the same result. Both end with a verified note and PDF in the chart.">
            <Tabs value={path} onChange={(k) => setPath(k as 'auto')} tabs={[{ key: 'auto', label: <span className="flex items-center gap-1.5"><Bot size={14} /> eCW connector</span> }, { key: 'manual', label: <span className="flex items-center gap-1.5"><Hand size={14} /> Copy & paste</span> }]} />
            {path === 'auto' ? (
              <>
                <p className="text-sm text-sand-600">The connector signs in to eCW as its own user, places the note and PDF, and reads everything back before marking the chart as done. If any check fails after a write, it stops and creates an exception. It never retries on its own.</p>
                <ol className="mt-4 space-y-2">
                  {steps.map(([label, st], i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${st === 'ok' ? 'bg-ok-100 text-ok-700' : st === 'bad' ? 'bg-bad-100 text-bad-700' : 'bg-sand-100 text-sand-400'}`}>{st === 'ok' ? <Check size={13} /> : st === 'bad' ? '!' : i + 1}</span>
                      <span className={st === 'pending' ? 'text-sand-500' : 'text-sand-900'}>{label}</span>
                      {st === 'bad' && <Pill tone="bad" dot={false}>Failed</Pill>}
                    </li>
                  ))}
                </ol>
                <div className="mt-4 rounded-xl bg-sand-50 p-3 text-xs text-sand-600">
                  <Row label="Job">JOB-{status === 'Exception' ? '5121' : '5130'} · J2 Intake note + PDF</Row>
                  <Row label="Duplicate guard">intake {p.id.replace('P-', 'INT-')} · v{p.intake?.version ?? 3}</Row>
                  <Row label="Scheduled">Nightly 6:00 AM · or run now</Row>
                  <Row label="State">{status === 'Placed in eCW' ? <Pill tone="ok">Verified</Pill> : status === 'Exception' ? <Pill tone="bad">Exception · needs you</Pill> : status === 'Ready for chart prep' ? <Pill tone="teal">Queued · waiting for confirmation</Pill> : <Pill>Not queued</Pill>}</Row>
                </div>
                {status === 'Ready for chart prep' && <button onClick={() => { setStatus('Placed in eCW'); setToast('Connector finished · verified in eCW'); setTimeout(() => setToast(null), 2200) }} className="btn-primary mt-4 w-full"><Bot size={16} /> Run connector now (demo)</button>}
                {status === 'Placed in eCW' && <button className="btn-secondary mt-4 w-full"><Check size={16} /> Reviewed in eCW · close task</button>}
                {status === 'Exception' && <a href="#/staff/ecw-exceptions" className="btn-danger mt-4 w-full">Open exception queue</a>}
              </>
            ) : (
              <>
                <ol className="space-y-3 text-sm text-sand-700">
                  <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-[11px] font-bold text-white">1</span><span><button onClick={copy} className="font-semibold text-teal-700 underline">Copy the note</button>, open the patient in eCW (chart {p.ecwId}), and paste it at the usual location.</span></li>
                  <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-[11px] font-bold text-white">2</span><span>Download the PDF and upload it to Patient Docs under <ToConfirm>PDF category with Charlene</ToConfirm>.</span></li>
                  <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-[11px] font-bold text-white">3</span><span>Confirm below. Your confirmation is recorded with your name and time.</span></li>
                </ol>
                <button onClick={() => { setStatus('Placed in eCW'); setToast('Marked “Placed in eCW” by Charlene'); setTimeout(() => setToast(null), 2200) }} disabled={status === 'Placed in eCW'} className="btn-primary mt-5 w-full"><Check size={16} /> I placed the note and PDF in eCW</button>
                <p className="help mt-2">The connector will skip this patient because the note marker already exists.</p>
              </>
            )}
          </Card>
          <Card title="History" subtitle="Who · when · why"><AuditList compact entries={[...p.history].reverse().slice(0, 5)} /></Card>
        </div>
      </div>
    </>
  )
}

function buildNote(pid: string, ecw: string, name: string, dob: string, firstName: string, version: number, submitted: string, uploads: { label: string; files: { name: string; uploadedAt: string }[] }[]) {
  const answers: Record<string, unknown> = { ...sampleAnswers, a1: firstName, a2: dob, a5: 'Family member — see chart' }
  const lines: string[] = []
  lines.push(`HELIXONA COMPLEX CHRONIC PROGRAM — INTAKE QUESTIONNAIRE`)
  lines.push(`Patient: ${name}   DOB: ${dob}   eCW: ${ecw}   Internal ID: ${pid}`)
  lines.push(`Questionnaire v${version} (published Sep 15, 2026 by Medical Director)   Submitted: ${submitted}`)
  lines.push(`Marker: HLX:INT-${pid.slice(2)}:v${version}   [Do not edit this line]`)
  lines.push(``)
  let n = 1
  for (const s of sections) {
    lines.push(`== ${s.title.toUpperCase()} ==`)
    for (const q of s.questions) {
      const a = answers[q.id]
      if (q.showIf && answers[q.showIf.questionId] !== q.showIf.equals) continue
      if (q.type === 'medications' && Array.isArray(a)) {
        lines.push(`${n++}. ${q.text}:`)
        for (const m of a as { name: string; dose: string; frequency: string; reason: string }[]) lines.push(`   - ${m.name} ${m.dose} — ${m.frequency} (${m.reason})`)
      } else if (Array.isArray(a)) {
        lines.push(`${n++}. ${q.text}`); for (const x of a) lines.push(`   - ${x}`)
      } else {
        lines.push(`${n++}. ${q.text}`); lines.push(`   ${a === undefined ? '(not answered)' : String(a)}${q.type === 'scale' ? ` / ${q.max ?? 10}` : ''}`)
      }
    }
    lines.push(``)
  }
  lines.push(`== UPLOADED DOCUMENTS ==`)
  for (const u of uploads) if (u.files.length) for (const f of u.files) lines.push(`- ${u.label}: ${f.name} (uploaded ${f.uploadedAt})`)
  lines.push(``)
  lines.push(`Generated by the Helixona program application. Full PDF: Helixona_Intake_${pid.slice(2)}_v${version}.pdf`)
  return lines.join('\n')
}
