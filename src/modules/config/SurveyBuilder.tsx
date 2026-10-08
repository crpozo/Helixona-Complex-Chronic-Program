import { useState } from 'react'
import { GitBranch, GripVertical, Plus, Send } from 'lucide-react'
import { Card, Field, Notice, PageHeader, Pill, QueueTable, Row, Tabs, Toast, VersionTag, type Column, type Tone } from '../../components/ui'
import { questionBank, surveyTemplates, type ContentState, type SurveyTemplate } from '../../mock/program'

export const stateTone: Record<ContentState, Tone> = { Draft: 'neutral', 'In review': 'warn', Approved: 'info', Published: 'ok', Retired: 'neutral' }
export function StateFlow({ state }: { state: ContentState }) {
  const steps: ContentState[] = ['Draft', 'In review', 'Approved', 'Published', 'Retired']
  const i = steps.indexOf(state)
  return <ol className="flex flex-wrap items-center gap-1 text-xs">{steps.map((s, j) => <li key={s} className="flex items-center gap-1"><span className={`rounded-full px-2 py-0.5 ${j === i ? 'bg-teal-600 text-white font-semibold' : j < i ? 'bg-teal-100 text-teal-800' : 'bg-sand-100 text-sand-400'}`}>{s}</span>{j < steps.length - 1 && <span className="text-sand-300">→</span>}</li>)}</ol>
}

export default function SurveyBuilder() {
  const [sel, setSel] = useState<SurveyTemplate>(surveyTemplates[0])
  const [tab, setTab] = useState('sections')
  const [toast, setToast] = useState<string | null>(null)
  const show = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2200) }
  const columns: Column<SurveyTemplate>[] = [
    { key: 'name', header: 'Template', render: (r) => <><div className="font-semibold text-sand-900">{r.name} <VersionTag>v{r.version}</VersionTag></div><div className="text-xs text-sand-500">{r.id} · {r.type} · {r.questions} questions</div></> },
    { key: 'state', header: 'State', render: (r) => <Pill tone={stateTone[r.state]}>{r.state}</Pill> },
    { key: 'assigned', header: 'Assigned to', render: (r) => r.assignedTo.length ? <div className="flex flex-wrap gap-1">{r.assignedTo.map((a) => <Pill key={a} dot={false}>{a}</Pill>)}</div> : <span className="text-sand-400">—</span> },
    { key: 'upd', header: 'Last change', render: (r) => <span className="text-xs text-sand-500">{r.updatedBy} · {r.updatedAt}</span> },
  ]
  const sections = [
    { title: 'Today', questions: [{ ref: 'Q-ENERGY', required: true }, { ref: 'Q-PAIN', required: true }, { ref: 'Q-SLEEP', required: false }] },
    { title: 'After your session', questions: [{ ref: 'Q-REACTION', required: true }, { ref: 'Q-REACTION-TXT', required: false, showIf: 'Q-REACTION = Yes' }, { ref: 'Q-CONTACT', required: true }] },
  ]
  return (
    <>
      <Toast message={toast} />
      <PageHeader eyebrow="Configuration · Physician / program admin" title="Survey templates" description="Build surveys from the question bank, add scoring and branching, and publish versions. Publishing clinical content requires an authorized clinical publisher (Dr. D.)." actions={<button className="btn-primary"><Plus size={16} /> New template</button>} />
      <div className="grid gap-5 xl:grid-cols-5">
        <div className="xl:col-span-2"><QueueTable rows={surveyTemplates} columns={columns} rowKey={(r) => r.id + r.version} rowTone={(r) => stateTone[r.state]} onRowClick={setSel} /></div>
        <div className="xl:col-span-3">
          <Card title={<span className="flex items-center gap-2">{sel.name} <VersionTag>v{sel.version}</VersionTag> <Pill tone={stateTone[sel.state]}>{sel.state}</Pill></span>} subtitle={`${sel.type} · ${sel.questions} questions · last change ${sel.updatedBy}, ${sel.updatedAt}${sel.publishedBy ? ` · published by ${sel.publishedBy}` : ''}`}
            actions={<div className="flex gap-2">{sel.state === 'Draft' && <button onClick={() => show('Sent for clinical review')} className="btn-secondary px-3 py-1.5 text-xs"><Send size={14} /> Send for review</button>}{sel.state === 'In review' && <button onClick={() => show('Approved by Dr. D.')} className="btn-secondary px-3 py-1.5 text-xs">Approve</button>}{sel.state === 'Approved' && <button onClick={() => show('Published as v' + (sel.version) + ' · previous version retired')} className="btn-primary px-3 py-1.5 text-xs">Publish (Dr. D.)</button>}{sel.state === 'Published' && <button onClick={() => show('Draft v' + (sel.version + 1) + ' created')} className="btn-secondary px-3 py-1.5 text-xs">New draft version</button>}</div>}>
            <div className="mb-4"><StateFlow state={sel.state} /></div>
            <Tabs value={tab} onChange={setTab} tabs={[{ key: 'sections', label: 'Sections & questions' }, { key: 'bank', label: 'Question bank' }, { key: 'scoring', label: 'Scoring & branching' }, { key: 'assign', label: 'Assignment & schedule' }, { key: 'versions', label: 'Versions' }]} />
            {tab === 'sections' && (
              <div className="space-y-4">
                {sections.map((s) => (
                  <div key={s.title} className="rounded-xl border border-sand-200">
                    <div className="flex items-center justify-between bg-sand-50 px-3 py-2"><span className="text-sm font-semibold">{s.title}</span><button className="btn-ghost px-2 py-1 text-xs">Rename</button></div>
                    <ul className="divide-y divide-sand-100">{s.questions.map((q) => { const b = questionBank.find((x) => x.id === q.ref)!; return (
                      <li key={q.ref} className="flex items-center gap-3 px-3 py-2.5 text-sm"><GripVertical size={14} className="text-sand-300" /><span className="flex-1"><span className="text-sand-900">{b.text}</span><span className="block text-xs text-sand-500">{b.type} · {q.required ? 'Required' : 'Optional'}{q.showIf && <span className="ml-2 inline-flex items-center gap-1 text-plum-600"><GitBranch size={11} /> show if {q.showIf}</span>}</span></span><Pill dot={false}>{q.ref}</Pill></li>) })}</ul>
                    <div className="px-3 py-2"><button className="btn-ghost px-2 py-1 text-xs"><Plus size={13} /> Add question from bank</button></div>
                  </div>
                ))}
                <button className="btn-secondary w-full"><Plus size={15} /> Add section</button>
                <Notice tone="plum">Clinical wording comes from the Medical Director and is not edited by the software team. Editing is locked for Published versions; create a new draft version instead.</Notice>
              </div>
            )}
            {tab === 'bank' && (
              <table className="w-full text-sm"><thead><tr className="bg-sand-50 text-left"><th className="px-3 py-2 eyebrow">ID</th><th className="px-3 py-2 eyebrow">Question</th><th className="px-3 py-2 eyebrow">Type</th><th className="px-3 py-2 eyebrow">Scoring</th><th className="px-3 py-2 eyebrow">Used in</th></tr></thead>
                <tbody>{questionBank.map((q) => <tr key={q.id} className="border-t border-sand-100"><td className="px-3 py-2 font-mono text-xs">{q.id}</td><td className="px-3 py-2">{q.text}</td><td className="px-3 py-2 text-sand-600">{q.type}</td><td className="px-3 py-2 text-sand-600">{q.score}</td><td className="px-3 py-2 text-sand-500">{q.id === 'Q-CONTACT' ? '3 templates' : '2 templates'}</td></tr>)}</tbody></table>
            )}
            {tab === 'scoring' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Calculated field"><input className="input" defaultValue="symptom_load = pain + (10 − energy) + (10 − sleep)" /></Field>
                <Field label="Change vs. baseline"><select className="input"><option>Compare each score to Month 0 baseline</option><option>Compare to previous survey</option></select></Field>
                <Field label="Branch rule"><input className="input" defaultValue="If Q-REACTION = Yes → show Q-REACTION-TXT" /></Field>
                <Field label="Flag"><input className="input" defaultValue="If Q-CONTACT = Yes → flag contact_requested (used by AR-01)" /></Field>
                <div className="sm:col-span-2"><Notice tone="info">Scores and flags feed the alert rules. Rules are configured separately so thresholds can change without re-publishing the survey.</Notice></div>
              </div>
            )}
            {tab === 'assign' && (
              <div className="space-y-3 text-sm">
                <Row label="Assigned by">{sel.assignedTo.join(' · ') || '—'}</Row>
                <Row label="Schedule">Treatment-relative · +1, +3, +7 days (set per modality)</Row>
                <Row label="Reminders">1 reminder after 24 h · max 1</Row>
                <Row label="Stop rule">Sequence complete · patient paused · patient opted out</Row>
                <Row label="Patient override">Allowed (physician)</Row>
                <div className="grid gap-3 sm:grid-cols-2 pt-2"><Field label="Also assign to"><select className="input"><option>Program · Complex Chronic</option><option>Stage · Active care</option><option>Modality…</option><option>Physician · Dr. D.</option><option>Patient…</option></select></Field><Field label="Effective from"><input type="date" className="input" /></Field></div>
              </div>
            )}
            {tab === 'versions' && (
              <table className="w-full text-sm"><thead><tr className="bg-sand-50 text-left"><th className="px-3 py-2 eyebrow">Version</th><th className="px-3 py-2 eyebrow">State</th><th className="px-3 py-2 eyebrow">Who · when · why</th></tr></thead><tbody>
                <tr className="border-t border-sand-100"><td className="px-3 py-2">v2</td><td className="px-3 py-2"><Pill tone="ok">Published</Pill></td><td className="px-3 py-2 text-sand-600">Dr. D. · Sep 20, 2026 · Added sleep question after nursing feedback</td></tr>
                <tr className="border-t border-sand-100"><td className="px-3 py-2">v1</td><td className="px-3 py-2"><Pill>Retired</Pill></td><td className="px-3 py-2 text-sand-600">Dr. D. · Sep 15, 2026 · Initial publication · retired Sep 20</td></tr>
              </tbody></table>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}
