import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Card, Pill, VersionTag } from '../../../components/ui'
import { assignedByPathway, forms, sampleAnswers, type Q } from '../../../mock/questionnaire'
import type { Patient } from '../../../mock/types'
import { demographicsFor, ageOf } from '../../../mock/demographics'

/** Everything the patient answered in their questionnaires, by form and section, exactly as the Medical
 *  Director's spreadsheet lays them out. Read-only here; the same answers make the note for eCW. */
function show(v: unknown): React.ReactNode {
  if (v === undefined || v === null || v === '') return null
  if (Array.isArray(v)) {
    if (v.length === 0) return null
    if (typeof v[0] === 'object' && v[0] !== null) {
      const keys = Object.keys(v[0] as object)
      return <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left">{keys.map((k) => <th key={k} className="whitespace-nowrap border-b border-sand-200 px-2 py-1 text-xs font-medium capitalize text-sand-500">{k}</th>)}</tr></thead><tbody>{(v as Record<string, unknown>[]).map((row, i) => <tr key={i} className="border-b border-sand-100 last:border-0">{keys.map((k) => <td key={k} className="px-2 py-1.5 text-sand-900">{k === 'score' ? `${row[k]} / 10` : String(row[k] ?? '—')}</td>)}</tr>)}</tbody></table></div>
    }
    return <ul className="list-disc space-y-0.5 pl-5">{(v as unknown[]).filter(Boolean).map((x, i) => <li key={i}>{String(x)}</li>)}</ul>
  }
  if (typeof v === 'object') return <ul className="space-y-0.5">{Object.entries(v as object).map(([k, x]) => <li key={k}><span className="text-sand-500">{k}:</span> {String(x)}</li>)}</ul>
  return String(v)
}

export default function HealthStory({ patient }: { patient: Patient }) {
  const assigned = assignedByPathway.chronic.map((a) => forms.find((f) => f.id === a.formId)!).filter(Boolean)
  const [formId, setFormId] = useState(assigned[0]?.id)
  const [q, setQ] = useState('')
  const [onlyAnswered, setOnlyAnswered] = useState(true)
  const d = demographicsFor(patient.id)
  // The sample answers were written for one patient; identity questions follow the record being viewed.
  const answers = useMemo(() => {
    const own: Record<string, unknown> = { 'First Name': patient.firstName, 'Last Name': patient.lastName, 'Date of Birth': patient.dob, Age: ageOf(patient.dob), Email: patient.email, 'Phone (Cell)': patient.phone, City: patient.city.split(',')[0], Sex: d?.sex.toLowerCase(), 'Emergency Contact Name': d?.emergency.name, Relationship: d?.emergency.relation, 'Insurance Carrier': d?.insurance.plan }
    return (qq: Q) => { const k = Object.keys(own).find((t) => qq.text.startsWith(t)); return k && own[k] !== undefined ? own[k] : sampleAnswers[qq.id] }
  }, [patient, d])
  const form = assigned.find((f) => f.id === formId) ?? assigned[0]
  const started = !!patient.intake
  const total = form.sections.reduce((n, s) => n + s.questions.length, 0)
  const answered = form.sections.reduce((n, s) => n + s.questions.filter((x) => show(answers(x)) !== null).length, 0)

  if (!started) return <Card title="Health story"><p className="help">This person has not started the questionnaire yet. Their answers will appear here as they fill it in.</p></Card>
  return (
    <div className="grid gap-5 lg:grid-cols-4">
      <div className="lg:col-span-1">
        <div className="card overflow-hidden">
          <div className="px-4 pt-4 eyebrow">Questionnaires</div>
          <ul className="mt-2">{assigned.map((f) => { const on = f.id === form.id; const n = f.sections.reduce((c, s) => c + s.questions.filter((x) => show(answers(x)) !== null).length, 0); return (
            <li key={f.id}><button onClick={() => setFormId(f.id)} aria-current={on} className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm ${on ? 'bg-teal-50 font-semibold text-sand-900 shadow-[inset_3px_0_0_#141414]' : 'text-sand-700 hover:bg-sand-50'}`}><span>{f.title}</span><span className="text-xs font-normal text-sand-500">{n ? `${n} answers` : 'no answers'}</span></button></li>) })}</ul>
          <div className="border-t border-sand-200 p-4 text-xs text-sand-500">Questions, order and wording are the Medical Director’s, kept as supplied.</div>
        </div>
      </div>
      <div className="space-y-4 lg:col-span-3">
        <div className="card flex flex-wrap items-center gap-3 px-4 py-3">
          <div className="mr-auto"><div className="text-[15px] font-semibold text-sand-900">{form.title}</div><div className="text-xs text-sand-500">{answered} of {total} questions answered · submitted {patient.intake?.submittedAt ?? 'not yet'}</div></div>
          <VersionTag>v{patient.intake?.version ?? 1}</VersionTag>
          <label className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a question or answer" className="input w-64 py-2 pl-9" /></label>
          <label className="flex items-center gap-2 whitespace-nowrap text-sm text-sand-700"><input type="checkbox" checked={onlyAnswered} onChange={(e) => setOnlyAnswered(e.target.checked)} className="h-4 w-4 accent-[#141414]" />Answered only</label>
        </div>
        {form.sections.map((sec) => {
          const qs = sec.questions.filter((x) => { const a = show(answers(x)); if (onlyAnswered && a === null) return false; return !q || `${x.text} ${JSON.stringify(answers(x) ?? '')}`.toLowerCase().includes(q.toLowerCase()) })
          if (!qs.length) return null
          return (
            <Card key={sec.id} title={sec.title} subtitle={`${qs.length} ${qs.length === 1 ? 'question' : 'questions'}`}>
              <dl className="divide-y divide-sand-100">
                {qs.map((x) => { const a = show(answers(x)); return (
                  <div key={x.id} className="grid gap-1 py-2.5 sm:grid-cols-5 sm:gap-4">
                    <dt className="text-sm text-sand-600 sm:col-span-2">{x.text}</dt>
                    <dd className="text-sm font-medium text-sand-900 sm:col-span-3">{a ?? <Pill dot={false}>Not answered</Pill>}</dd>
                  </div>) })}
              </dl>
            </Card>
          )
        })}
        {answered === 0 && <Card><p className="help">No answers in this questionnaire yet.</p></Card>}
      </div>
    </div>
  )
}
