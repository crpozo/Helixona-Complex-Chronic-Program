import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Cloud, Plus, Trash2 } from 'lucide-react'
import { PhoneFrame, PatientTopBar } from '../../../components/PhoneFrame'
import { Choice, Field, Pill, SampleBadge, VersionTag } from '../../../components/ui'
import { questionnaireMeta, sampleAnswers, sections, type Question } from '../../../mock/questionnaire'

type Answers = Record<string, unknown>
interface Med { name: string; dose: string; frequency: string; reason: string }

export default function Questionnaire() {
  const nav = useNavigate()
  const [view, setView] = useState<'overview' | 'section'>('overview')
  const [sIdx, setSIdx] = useState(0)
  const [answers, setAnswers] = useState<Answers>(() => {
    // Pre-fill the first two sections so the "save & return" state is visible in the demo.
    const pre: Answers = {}
    for (const s of sections.slice(0, 2)) for (const q of s.questions) if (sampleAnswers[q.id] !== undefined) pre[q.id] = sampleAnswers[q.id]
    return pre
  })
  const [saved, setSaved] = useState<'saved' | 'saving'>('saved')
  const [tried, setTried] = useState(false)

  useEffect(() => { setSaved('saving'); const t = setTimeout(() => setSaved('saved'), 600); return () => clearTimeout(t) }, [answers])

  const section = sections[sIdx]
  const visible = (q: Question) => !q.showIf || answers[q.showIf.questionId] === q.showIf.equals
  const answered = (q: Question) => { const v = answers[q.id]; return Array.isArray(v) ? v.length > 0 : v !== undefined && v !== '' }
  const sectionState = (i: number) => {
    const qs = sections[i].questions.filter(visible)
    const n = qs.filter(answered).length
    return n === 0 ? 'not started' : n === qs.length ? 'complete' : 'partial'
  }
  const missing = useMemo(() => section.questions.filter((q) => visible(q) && q.required && !answered(q)), [answers, sIdx]) // eslint-disable-line react-hooks/exhaustive-deps
  const totalQ = sections.flatMap((s) => s.questions.filter(visible)).length
  const doneQ = sections.flatMap((s) => s.questions.filter(visible)).filter(answered).length
  const pct = Math.round((doneQ / totalQ) * 100)

  const set = (id: string, v: unknown) => setAnswers((a) => ({ ...a, [id]: v }))

  const next = () => {
    setTried(true)
    if (missing.length) { document.getElementById(`q-${missing[0].id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return }
    setTried(false)
    if (sIdx < sections.length - 1) { setSIdx(sIdx + 1); window.scrollTo(0, 0) } else setView('overview')
  }

  const SaveState = (
    <span className="inline-flex items-center gap-1 text-xs text-sand-500">
      {saved === 'saved' ? <><Check size={13} className="text-ok-600" /> Saved just now</> : <><Cloud size={13} className="animate-pulse" /> Saving…</>}
    </span>
  )

  if (view === 'overview') {
    return (
      <PhoneFrame>
        <PatientTopBar title="Health questionnaire" back={<Link to="/patient/home" className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></Link>} right={SaveState} />
        <div className="px-5 pb-8">
          <div className="card p-4">
            <div className="flex items-center justify-between"><span className="text-sm font-semibold text-sand-800">{pct}% complete</span><span className="text-xs text-sand-500">{doneQ} of {totalQ} questions</span></div>
            <div className="mt-2 h-2 rounded-full bg-sand-200"><div className="h-2 rounded-full bg-teal-600 transition-all" style={{ width: `${pct}%` }} /></div>
            <p className="mt-3 text-sm text-sand-600">Your answers save automatically. Leave anytime and pick up where you left off.</p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="eyebrow">Sections</span>
            <VersionTag>Questionnaire v{questionnaireMeta.version}</VersionTag>
          </div>
          <ul className="mt-2 space-y-2">
            {sections.map((s, i) => {
              const st = sectionState(i)
              return (
                <li key={s.id}>
                  <button onClick={() => { setSIdx(i); setView('section') }} className="card flex w-full items-center gap-3 p-3.5 text-left hover:border-teal-300">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${st === 'complete' ? 'bg-ok-100 text-ok-700' : st === 'partial' ? 'bg-warn-100 text-warn-700' : 'bg-sand-100 text-sand-600'}`}>{st === 'complete' ? <Check size={16} /> : i + 1}</span>
                    <span className="flex-1 min-w-0"><span className="block font-semibold text-sand-900">{s.title}</span><span className="block text-xs text-sand-500">{s.questions.filter(visible).length} questions · ~{Math.max(2, s.questions.length)} min</span></span>
                    <Pill tone={st === 'complete' ? 'ok' : st === 'partial' ? 'warn' : 'neutral'} dot={false}>{st === 'complete' ? 'Done' : st === 'partial' ? 'In progress' : 'Start'}</Pill>
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="mt-5 rounded-xl border border-dashed border-plum-600/30 bg-plum-100/40 p-3 text-xs text-plum-600">
            <strong>For reviewers:</strong> all questions are placeholders. The Medical Director's questionnaire will be loaded exactly as supplied, with its own wording, order, and branching.
          </div>
          <button onClick={() => nav('/patient/uploads')} disabled={pct < 100} className="btn-primary btn-lg mt-6 w-full">{pct < 100 ? 'Finish all sections to continue' : 'Continue to documents'}</button>
          {pct < 100 && <button onClick={() => { setSIdx(sections.findIndex((_, i) => sectionState(i) !== 'complete')); setView('section') }} className="btn-secondary btn-lg mt-2 w-full">Resume where I left off</button>}
        </div>
      </PhoneFrame>
    )
  }

  return (
    <PhoneFrame>
      <PatientTopBar title={`${sIdx + 1} of ${sections.length} · ${section.title}`} back={<button onClick={() => setView('overview')} className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></button>} right={SaveState} />
      <div className="px-5 pb-8">
        <div className="h-1.5 rounded-full bg-sand-200"><div className="h-1.5 rounded-full bg-teal-600 transition-all" style={{ width: `${((sIdx + 1) / sections.length) * 100}%` }} /></div>
        <h1 className="mt-5 font-display text-2xl font-semibold text-sand-900">{section.title}</h1>
        {section.intro && <p className="mt-1 text-[15px] text-sand-600">{section.intro}</p>}
        <div className="mt-6 space-y-7">
          {section.questions.filter(visible).map((q) => (
            <div key={q.id} id={`q-${q.id}`}>
              <div className="mb-2"><SampleBadge /></div>
              <QuestionInput q={q} value={answers[q.id]} onChange={(v) => set(q.id, v)} error={tried && q.required && !answered(q) ? 'This question is required.' : undefined} />
            </div>
          ))}
        </div>
        {tried && missing.length > 0 && <div className="mt-6 rounded-xl bg-bad-100 px-4 py-3 text-sm font-medium text-bad-700">Please answer {missing.length} required question{missing.length > 1 ? 's' : ''} above to continue.</div>}
        <div className="mt-8 flex gap-2">
          {sIdx > 0 && <button onClick={() => { setSIdx(sIdx - 1); setTried(false) }} className="btn-secondary btn-lg">Back</button>}
          <button onClick={next} className="btn-primary btn-lg flex-1">{sIdx < sections.length - 1 ? 'Save & continue' : 'Save & finish'}</button>
        </div>
        <button onClick={() => setView('overview')} className="btn-ghost mt-2 w-full">Save and come back later</button>
      </div>
    </PhoneFrame>
  )
}

function QuestionInput({ q, value, onChange, error }: { q: Question; value: unknown; onChange: (v: unknown) => void; error?: string }) {
  const label = <span className="text-[16px] font-semibold text-sand-900 leading-snug">{q.text}</span>
  switch (q.type) {
    case 'short': return <Field label={label} required={q.required} hint={q.help} error={error}><input className="input text-[16px] py-3" value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} /></Field>
    case 'long': return <Field label={label} required={q.required} hint={q.help} error={error}><textarea rows={4} className="input text-[16px] py-3" value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} /></Field>
    case 'date': return <Field label={label} required={q.required} error={error}><input type="date" className="input text-[16px] py-3" value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} /></Field>
    case 'number': return <Field label={label} required={q.required} hint={q.help} error={error}><input type="number" inputMode="numeric" min={q.min} max={q.max} className="input text-[16px] py-3 max-w-[140px]" value={(value as number) ?? ''} onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))} /></Field>
    case 'yesno': return (
      <Field label={label} required={q.required} error={error}>
        <div className="grid grid-cols-2 gap-2">{['Yes', 'No'].map((o) => <Choice key={o} size="lg" label={o} selected={value === o} onClick={() => onChange(o)} />)}</div>
      </Field>)
    case 'single': return (
      <Field label={label} required={q.required} error={error}>
        <div className="space-y-2">{q.options!.map((o) => <Choice key={o} size="lg" label={o} selected={value === o} onClick={() => onChange(o)} />)}</div>
      </Field>)
    case 'multi': {
      const arr = (value as string[]) ?? []
      return (
        <Field label={label} required={q.required} hint="Select all that apply" error={error}>
          <div className="space-y-2">{q.options!.map((o) => <Choice key={o} size="lg" multiple label={o} selected={arr.includes(o)} onClick={() => onChange(arr.includes(o) ? arr.filter((x) => x !== o) : [...arr, o])} />)}</div>
        </Field>)
    }
    case 'scale': {
      const min = q.min ?? 0, max = q.max ?? 10
      return (
        <Field label={label} required={q.required} error={error}>
          <div className="grid grid-cols-11 gap-1">
            {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((n) => (
              <button key={n} type="button" onClick={() => onChange(n)} aria-pressed={value === n}
                className={`h-11 rounded-lg border text-[15px] font-semibold ${value === n ? 'border-teal-600 bg-teal-600 text-white' : 'border-sand-300 bg-white text-sand-700'}`}>{n}</button>
            ))}
          </div>
          <div className="mt-1.5 flex justify-between text-xs text-sand-500"><span>{q.minLabel}</span><span>{q.maxLabel}</span></div>
        </Field>)
    }
    case 'medications': {
      const meds = (value as Med[]) ?? []
      const update = (i: number, k: keyof Med, v: string) => onChange(meds.map((m, j) => (j === i ? { ...m, [k]: v } : m)))
      return (
        <Field label={label} required={q.required} error={error}>
          <div className="space-y-3">
            {meds.map((m, i) => (
              <div key={i} className="card p-3 space-y-2">
                <div className="flex items-center justify-between"><span className="eyebrow">Item {i + 1}</span><button type="button" onClick={() => onChange(meds.filter((_, j) => j !== i))} className="btn-ghost px-2 py-1 text-xs text-bad-700"><Trash2 size={14} /> Remove</button></div>
                <input className="input" placeholder="Name (e.g., Levothyroxine)" value={m.name} onChange={(e) => update(i, 'name', e.target.value)} />
                <div className="grid grid-cols-2 gap-2">
                  <input className="input" placeholder="Dose" value={m.dose} onChange={(e) => update(i, 'dose', e.target.value)} />
                  <input className="input" placeholder="How often" value={m.frequency} onChange={(e) => update(i, 'frequency', e.target.value)} />
                </div>
                <input className="input" placeholder="What is it for?" value={m.reason} onChange={(e) => update(i, 'reason', e.target.value)} />
              </div>
            ))}
            <button type="button" onClick={() => onChange([...meds, { name: '', dose: '', frequency: '', reason: '' }])} className="btn-secondary w-full"><Plus size={16} /> Add medication or supplement</button>
            {meds.length === 0 && <button type="button" onClick={() => onChange([{ name: 'None', dose: '', frequency: '', reason: 'I do not take any medications or supplements' }])} className="btn-ghost w-full text-sm">I don't take any</button>}
          </div>
        </Field>)
    }
  }
}
