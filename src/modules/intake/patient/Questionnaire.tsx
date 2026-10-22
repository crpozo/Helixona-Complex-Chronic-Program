import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Cloud, Plus, Trash2 } from 'lucide-react'
import { PhoneFrame, PatientTopBar } from '../../../components/PhoneFrame'
import { Choice, Field, Pill, VersionTag } from '../../../components/ui'
import { assignedByPathway, forms, getPathway, pathwayLabel, questionnaireMeta, sampleAnswers, setPathway, type Form, type Pathway, type Q, type Sec } from '../../../mock/questionnaire'

type Answers = Record<string, unknown>

const answered = (q: Q, v: unknown) => {
  if (v === undefined || v === '' || v === null) return false
  if (Array.isArray(v)) return v.some((x) => (typeof x === 'object' && x !== null ? Object.values(x as Record<string, unknown>).some(Boolean) : x !== '' && x !== undefined))
  if (q.type === 'matrix') return Object.keys(v as Record<string, unknown>).length === (q.rows?.length ?? 0)
  return true
}
const visible = (sec: Sec, q: Q, a: Answers) => {
  if (!q.showIfPrev) return true
  const i = sec.questions.indexOf(q); const prev = sec.questions[i - 1]
  return !prev || a[prev.id] === q.showIfPrev
}

export default function Questionnaire() {
  const nav = useNavigate()
  const [pathway, setPathwayState] = useState<Pathway>(getPathway())
  const assignment = assignedByPathway[pathway]
  const assigned = useMemo(() => assignment.map((a) => forms.find((f) => f.id === a.formId)!), [assignment])
  const [view, setView] = useState<'forms' | 'sections' | 'section'>('forms')
  const [form, setForm] = useState<Form>(assigned[0])
  const switchPathway = (p: Pathway) => { setPathway(p); setPathwayState(p); setForm(forms.find((f) => f.id === assignedByPathway[p][0].formId)!); setSIdx(0); setView('forms') }
  const [sIdx, setSIdx] = useState(0)
  const [answers, setAnswers] = useState<Answers>(() => ({ ...sampleAnswers }))
  const [saved, setSaved] = useState<'saved' | 'saving'>('saved')
  const [tried, setTried] = useState(false)
  useEffect(() => { setSaved('saving'); const t = setTimeout(() => setSaved('saved'), 600); return () => clearTimeout(t) }, [answers])

  const set = (id: string, v: unknown) => setAnswers((a) => ({ ...a, [id]: v }))
  const secState = (s: Sec) => { const qs = s.questions.filter((q) => visible(s, q, answers)); const n = qs.filter((q) => answered(q, answers[q.id])).length; return n === 0 ? 'not started' : n === qs.length ? 'complete' : 'partial' }
  const formProgress = (f: Form) => { const qs = f.sections.flatMap((s) => s.questions.filter((q) => visible(s, q, answers))); return Math.round((qs.filter((q) => answered(q, answers[q.id])).length / qs.length) * 100) }
  const nowForms = assigned.filter((_, i) => !assignment[i].when)
  const total = nowForms.flatMap((f) => f.sections.flatMap((s) => s.questions)).length
  const done = nowForms.flatMap((f) => f.sections.flatMap((s) => s.questions)).filter((q) => answered(q, answers[q.id])).length
  const pct = Math.round((done / total) * 100)
  const pctNow = pct
  const SaveState = <span className="inline-flex items-center gap-1 text-xs text-sand-500">{saved === 'saved' ? <><Check size={13} className="text-ok-600" /> Saved just now</> : <><Cloud size={13} className="animate-pulse" /> Saving…</>}</span>

  if (view === 'forms') return (
    <PhoneFrame>
      <PatientTopBar title="Health questionnaire" back={<Link to="/patient/home" className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></Link>} right={SaveState} />
      <div className="px-5 pb-8">
        <div className="mb-3 rounded-xl border border-dashed border-plum-600/30 bg-plum-100/40 p-2.5">
          <div className="text-[10.5px] font-semibold uppercase tracking-wide text-plum-600">For review · pathway chosen on the website inquiry</div>
          <div className="mt-1.5 flex gap-1 rounded-lg bg-white p-1 text-xs font-medium">{(['chronic', 'optimization'] as Pathway[]).map((p) => <button key={p} onClick={() => switchPathway(p)} className={`flex-1 rounded-md py-1.5 ${pathway === p ? 'bg-teal-600 text-white' : 'text-sand-600'}`}>{pathwayLabel[p]}</button>)}</div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between"><span className="text-sm font-semibold text-sand-800">{pct}% complete</span><span className="text-xs text-sand-500">{done} of {total} questions</span></div>
          <div className="mt-2 h-2 rounded-full bg-sand-200"><div className="h-2 rounded-full bg-teal-600 transition-all" style={{ width: `${pct}%` }} /></div>
          <p className="mt-3 text-sm text-sand-600">Your answers save automatically. Leave anytime and pick up where you left off.</p>
        </div>
        <div className="mt-4 flex items-center justify-between"><span className="eyebrow">Your forms</span><VersionTag>Questionnaire v{questionnaireMeta.version}</VersionTag></div>
        <ul className="mt-2 space-y-2">
          {assigned.map((f, i) => { const p = formProgress(f); const later = assignment[i].when; return (
            <li key={f.id}><button onClick={() => { setForm(f); setView('sections') }} className={`card flex w-full items-center gap-3 p-3.5 text-left hover:border-teal-300 ${later ? 'opacity-70' : ''}`}>
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${p === 100 ? 'bg-ok-100 text-ok-700' : p > 0 ? 'bg-warn-100 text-warn-700' : 'bg-sand-100 text-sand-600'}`}>{p === 100 ? <Check size={16} /> : i + 1}</span>
              <span className="flex-1 min-w-0"><span className="block font-semibold text-sand-900">{f.short}</span><span className="block text-xs text-sand-500">{later ? later + ' · ' : ''}{f.sections.length} sections · {f.sections.reduce((n, s) => n + s.questions.length, 0)} questions</span></span>
              <Pill tone={p === 100 ? 'ok' : p > 0 ? 'warn' : later ? 'neutral' : 'neutral'} dot={false}>{p === 100 ? 'Done' : p > 0 ? `${p}%` : later ? 'Later' : 'Start'}</Pill>
            </button></li>) })}
        </ul>
        <p className="mt-3 text-[11px] text-sand-500">{pathway === 'chronic' ? 'Complex Chronic patients complete all six forms: New Patient Packet, SF-36, Metabolic, Mold, Lyme and Brain.' : 'Health Optimization (L2/L3) patients complete the L2/L3 New Patient form before the first visit and the Follow-Up form before later visits.'}</p>
        <button onClick={() => nav('/patient/uploads')} disabled={pctNow < 100} className="btn-primary btn-lg mt-6 w-full">{pctNow < 100 ? 'Finish your forms to continue' : 'Continue to documents'}</button>
        {pctNow < 100 && <button onClick={() => { const f = assigned.find((x, i) => !assignment[i].when && formProgress(x) < 100)!; setForm(f); setSIdx(Math.max(0, f.sections.findIndex((s) => secState(s) !== 'complete'))); setView('section') }} className="btn-secondary btn-lg mt-2 w-full">Resume where I left off</button>}
      </div>
    </PhoneFrame>
  )

  if (view === 'sections') return (
    <PhoneFrame>
      <PatientTopBar title={form.short} back={<button onClick={() => setView('forms')} className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></button>} right={SaveState} />
      <div className="px-5 pb-8">
        <h1 className="font-display text-2xl font-semibold text-sand-900">{form.title}</h1>
        <p className="mt-1 text-sm text-sand-500">{formProgress(form)}% complete · {form.sections.length} sections</p>
        <ul className="mt-4 space-y-2">
          {form.sections.map((s, i) => { const st = secState(s); return (
            <li key={s.id}><button onClick={() => { setSIdx(i); setView('section') }} className="card flex w-full items-center gap-3 p-3.5 text-left hover:border-teal-300">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${st === 'complete' ? 'bg-ok-100 text-ok-700' : st === 'partial' ? 'bg-warn-100 text-warn-700' : 'bg-sand-100 text-sand-600'}`}>{st === 'complete' ? <Check size={16} /> : i + 1}</span>
              <span className="flex-1 min-w-0"><span className="block font-semibold text-sand-900 leading-snug">{s.title}</span><span className="block text-xs text-sand-500">{s.questions.reduce((n, q) => n + (q.rows?.length ?? 1), 0)} items</span></span>
              <Pill tone={st === 'complete' ? 'ok' : st === 'partial' ? 'warn' : 'neutral'} dot={false}>{st === 'complete' ? 'Done' : st === 'partial' ? 'In progress' : 'Start'}</Pill>
            </button></li>) })}
        </ul>
      </div>
    </PhoneFrame>
  )

  const section = form.sections[sIdx]
  const missing = section.questions.filter((q) => visible(section, q, answers) && q.required && !answered(q, answers[q.id]))
  const next = () => {
    setTried(true)
    if (missing.length) { document.getElementById(`q-${missing[0].id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return }
    setTried(false)
    if (sIdx < form.sections.length - 1) { setSIdx(sIdx + 1); window.scrollTo(0, 0) } else setView('forms')
  }
  return (
    <PhoneFrame>
      <PatientTopBar title={`${sIdx + 1} of ${form.sections.length} · ${form.short}`} back={<button onClick={() => setView('sections')} className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></button>} right={SaveState} />
      <div className="px-5 pb-8">
        <div className="h-1.5 rounded-full bg-sand-200"><div className="h-1.5 rounded-full bg-teal-600 transition-all" style={{ width: `${((sIdx + 1) / form.sections.length) * 100}%` }} /></div>
        <h1 className="mt-5 font-display text-2xl font-semibold text-sand-900 leading-tight">{section.title}</h1>
        {section.intro && <p className="mt-2 text-[14px] text-sand-600">{section.intro}</p>}
        <div className="mt-6 space-y-7">
          {section.questions.filter((q) => visible(section, q, answers)).map((q) => (
            <div key={q.id} id={`q-${q.id}`}><QuestionInput q={q} value={answers[q.id]} onChange={(v) => set(q.id, v)} error={tried && q.required && !answered(q, answers[q.id]) ? 'This question is required.' : undefined} /></div>
          ))}
        </div>
        {tried && missing.length > 0 && <div className="mt-6 rounded-xl bg-bad-100 px-4 py-3 text-sm font-medium text-bad-700">Please answer {missing.length} required question{missing.length > 1 ? 's' : ''} above to continue.</div>}
        <div className="mt-8 flex gap-2">
          {sIdx > 0 && <button onClick={() => { setSIdx(sIdx - 1); setTried(false) }} className="btn-secondary btn-lg">Back</button>}
          <button onClick={next} className="btn-primary btn-lg flex-1">{sIdx < form.sections.length - 1 ? 'Save & continue' : 'Save & finish form'}</button>
        </div>
        <button onClick={() => setView('forms')} className="btn-ghost mt-2 w-full">Save and come back later</button>
      </div>
    </PhoneFrame>
  )
}

function QuestionInput({ q, value, onChange, error }: { q: Q; value: unknown; onChange: (v: unknown) => void; error?: string }) {
  const label = <span className="text-[16px] font-semibold text-sand-900 leading-snug">{q.text}</span>
  switch (q.type) {
    case 'short': return <Field label={label} required={q.required} hint={q.help} error={error}><input className="input text-[16px] py-3" value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} /></Field>
    case 'long': return <Field label={label} required={q.required} hint={q.help} error={error}><textarea rows={4} className="input text-[16px] py-3" value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} /></Field>
    case 'date': return <Field label={label} required={q.required} hint={q.help} error={error}><input type="date" className="input text-[16px] py-3" value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} /></Field>
    case 'number': return <Field label={label} required={q.required} hint={q.help} error={error}><input type="number" inputMode="numeric" min={q.min} max={q.max} className="input text-[16px] py-3 max-w-[160px]" value={(value as number) ?? ''} onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))} /></Field>
    case 'yesno': return <Field label={label} required={q.required} hint={q.help} error={error}><div className="grid grid-cols-2 gap-2">{['Yes', 'No'].map((o) => <Choice key={o} size="lg" label={o} selected={value === o} onClick={() => onChange(o)} />)}</div></Field>
    case 'confirm': return <Field label={label} hint={q.help}><div className="grid grid-cols-2 gap-2">{['Still correct', 'Needs changes'].map((o) => <Choice key={o} size="lg" label={o} selected={value === o} onClick={() => onChange(o)} />)}</div></Field>
    case 'single': {
      const other = q.other && typeof value === 'string' && !q.options!.includes(value) && value !== ''
      return <Field label={label} required={q.required} hint={q.help} error={error}><div className="space-y-2">{q.options!.map((o) => <Choice key={o} size="lg" label={o} selected={value === o || (o === 'Other' && !!other)} onClick={() => onChange(o)} />)}{q.other && (value === 'Other' || other || /\?\)|Which One|Name\?/.test(String(value ?? ''))) && <input className="input" placeholder="Please specify" onChange={(e) => onChange(e.target.value || 'Other')} />}</div></Field>
    }
    case 'multi': { const arr = (value as string[]) ?? []; return <Field label={label} required={q.required} hint={q.help ?? 'Select all that apply'} error={error}><div className="grid grid-cols-2 gap-2">{q.options!.map((o) => <Choice key={o} multiple label={o} selected={arr.includes(o)} onClick={() => onChange(arr.includes(o) ? arr.filter((x) => x !== o) : [...arr, o])} />)}</div></Field> }
    case 'scale': { const min = q.min ?? 0, max = q.max ?? 10; return <Field label={label} required={q.required} hint={q.help} error={error}><div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${max - min + 1}, minmax(0, 1fr))` }}>{Array.from({ length: max - min + 1 }, (_, i) => min + i).map((n) => <button key={n} type="button" onClick={() => onChange(n)} aria-pressed={value === n} className={`h-11 rounded-lg border text-[15px] font-semibold ${value === n ? 'border-teal-600 bg-teal-600 text-white' : 'border-sand-300 bg-white text-sand-700'}`}>{n}</button>)}</div><div className="mt-1.5 flex justify-between text-xs text-sand-500"><span>{q.minLabel}</span><span>{q.maxLabel}</span></div></Field> }
    case 'list': { const arr = (value as string[]) ?? Array(q.count ?? 5).fill(''); return <Field label={label} required={q.required} hint={q.help} error={error}><div className="space-y-2">{Array.from({ length: q.count ?? 5 }, (_, i) => <div key={i} className="flex items-center gap-2"><span className="w-5 text-sm text-sand-500">{i + 1}.</span><input className="input text-[16px]" value={arr[i] ?? ''} onChange={(e) => { const n = [...arr]; n[i] = e.target.value; onChange(n) }} /></div>)}</div></Field> }
    case 'treatments': { const arr = (value as { treatment: string; score?: number }[]) ?? []; return (
      <Field label={label} required={q.required} hint={q.help} error={error}><div className="space-y-2">
        {arr.map((t, i) => <div key={i} className="card p-3 space-y-2"><div className="flex gap-2"><input className="input" placeholder="Treatment, therapy or intervention" value={t.treatment} onChange={(e) => onChange(arr.map((x, j) => (j === i ? { ...x, treatment: e.target.value } : x)))} /><button type="button" onClick={() => onChange(arr.filter((_, j) => j !== i))} className="btn-ghost px-2 text-bad-700"><Trash2 size={14} /></button></div><div className="flex items-center gap-2 text-xs text-sand-500"><span>How much did it help? 1–10</span><div className="flex flex-1 gap-0.5">{Array.from({ length: 10 }, (_, n) => n + 1).map((n) => <button key={n} type="button" onClick={() => onChange(arr.map((x, j) => (j === i ? { ...x, score: n } : x)))} className={`h-8 flex-1 rounded border text-xs font-semibold ${t.score === n ? 'border-teal-600 bg-teal-600 text-white' : 'border-sand-300 bg-white'}`}>{n}</button>)}</div></div></div>)}
        {arr.length < (q.max ?? 20) && <button type="button" onClick={() => onChange([...arr, { treatment: '' }])} className="btn-secondary w-full"><Plus size={16} /> Add treatment ({arr.length}/{q.max ?? 20})</button>}
      </div></Field>) }
    case 'table': { const rows = (value as Record<string, string>[]) ?? []; const cols = q.columns!; return (
      <Field label={<span className="text-[16px] font-semibold text-sand-900">{cols[0]}s</span>} required={q.required} hint={q.help} error={error}><div className="space-y-3">
        {rows.map((r, i) => <div key={i} className="card p-3 space-y-2"><div className="flex items-center justify-between"><span className="eyebrow">{cols[0]} {i + 1}</span><button type="button" onClick={() => onChange(rows.filter((_, j) => j !== i))} className="btn-ghost px-2 py-1 text-xs text-bad-700"><Trash2 size={14} /> Remove</button></div>{cols.map((c) => <input key={c} className="input" placeholder={c} value={r[c] ?? ''} onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, [c]: e.target.value } : x)))} />)}</div>)}
        {rows.length < (q.max ?? 12) && <button type="button" onClick={() => onChange([...rows, {}])} className="btn-secondary w-full"><Plus size={16} /> Add {cols[0].toLowerCase()}</button>}
        {rows.length === 0 && <button type="button" onClick={() => onChange([{ [cols[0]]: 'None' }])} className="btn-ghost w-full text-sm">I don't take any</button>}
      </div></Field>) }
    case 'matrix': { const v = (value as Record<string, string>) ?? {}; const opts = q.options!; return (
      <Field label={label} required={q.required} hint={q.help} error={error}><div className="space-y-3">
        {q.rows!.map((r, i) => <div key={r} className="card p-3"><div className="text-[15px] text-sand-900">{i + 1}. {r}</div><div className={`mt-2 grid gap-1`} style={{ gridTemplateColumns: `repeat(${opts.length <= 4 ? opts.length : 2}, minmax(0, 1fr))` }}>{opts.map((o) => <button key={o} type="button" onClick={() => onChange({ ...v, [r]: o })} aria-pressed={v[r] === o} className={`min-h-9 rounded-lg border px-1.5 py-1.5 text-[12px] font-medium leading-tight ${v[r] === o ? 'border-teal-600 bg-teal-600 text-white' : 'border-sand-300 bg-white text-sand-700'}`}>{o}</button>)}</div></div>)}
        {opts.join() === 'Never,Often,Frequently,Always' && <div className="rounded-xl bg-sand-100 px-3 py-2 text-xs text-sand-600">Category total (calculated automatically): <strong>{Object.values(v).reduce((n, o) => n + opts.indexOf(o), 0)}</strong> of {q.rows!.length * 3}</div>}
      </div></Field>) }
    case 'signature': return <Field label={label} required={q.required} error={error}><input className="input font-display text-2xl italic py-3" placeholder="Type your full legal name" value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} /><div className="mt-1 text-xs text-sand-500">Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · recorded with time and document version</div></Field>
  }
}
