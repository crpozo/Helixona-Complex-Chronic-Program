import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, Check, Flame, Phone, Zap } from 'lucide-react'
import { definitions } from '../../../mock/scores'
import { seedMeds } from '../../../mock/medications'
import { PhoneFrame, PatientTopBar } from '../../../components/PhoneFrame'
import { Choice, Field, MonitoringNotice, SampleBadge, ScaleSlider, VersionTag } from '../../../components/ui'

/** Report a flare or crash, in five short steps: safety check, what it is, symptoms with a few follow-up
 *  questions for the ones selected, the overall picture, and what to do with the report.
 *  A warning sign at any step stops the report and shows the 911 screen. Wording is a draft until the
 *  Medical Director approves it. */
const emergencySigns = [
  'Chest pain, pressure, or tightness',
  'Severe or sudden trouble breathing',
  'Swelling of my tongue or throat, or trouble swallowing',
  'Fainting, severe confusion, or feeling like I may pass out',
  'Sudden trouble speaking, facial drooping, or weakness on one side',
]
const unsure = "I'm not sure if my symptoms are an emergency"
const groups: [string, string[]][] = [
  ['Energy & thinking', ['Extreme fatigue', 'Brain fog', 'Headache / migraine', 'Difficulty sleeping']],
  ['Heart & breathing', ['Heart racing / palpitations', 'Getting winded more easily with activity', 'Dizziness / lightheadedness']],
  ['Pain & body', ['Increased pain', 'Muscle weakness', 'Joint pain / instability']],
  ['Immune & digestive', ['Rash / flushing / itching', 'Nausea', 'Stomach pain / diarrhea', 'Fever / chills']],
  ['Other', ['Sensitivity to light, sound, or smells', 'Other symptom']],
]
/** Follow-up questions, shown only for the symptoms selected. `stop` answers end the report with the 911 screen. */
const followUps: Record<string, { q: string; options: string[]; stop?: string[] }[]> = {
  'Getting winded more easily with activity': [
    { q: 'When do you become winded?', options: ['Only during strenuous activity', 'During normal activities, like climbing stairs', 'During very light activity, like walking across a room', 'Even while resting'], stop: ['Even while resting'] },
    { q: 'Does resting help your breathing return to normal?', options: ['Yes, within a few minutes', 'Yes, but it takes longer than usual', 'No, it continues even after resting', "I'm not sure"], stop: ['No, it continues even after resting'] },
  ],
  'Heart racing / palpitations': [
    { q: 'How would you describe what you are feeling?', options: ['My heart is beating faster than usual', 'My heart feels like it is pounding', 'My heartbeat feels irregular or skips beats', "I'm not sure"] },
    { q: 'When does this happen?', options: ['While resting', 'When standing up', 'During physical activity', 'At unpredictable times'] },
  ],
  'Extreme fatigue': [
    { q: 'What best describes your fatigue?', options: ['My body feels physically exhausted', 'My mind feels exhausted, and thinking is difficult', 'Both physically and mentally exhausted', 'I feel unusually sleepy'] },
    { q: 'Does activity make your symptoms worse?', options: ['No', 'Yes, during or right after activity', 'Yes, several hours later or the following day', "I'm not sure"] },
  ],
  'Brain fog': [
    { q: 'What are you having the most trouble with?', options: ['Finding words', 'Remembering things', 'Concentrating', 'Reading or following conversations', 'Making decisions'] },
  ],
  'Dizziness / lightheadedness': [
    { q: 'What does the dizziness feel like?', options: ['Lightheaded, like I might faint', 'The room feels like it is spinning', 'Unsteady or off balance', 'My vision darkens when I stand up'] },
    { q: 'Have you actually fainted or lost consciousness?', options: ['No', 'Yes'], stop: ['Yes'] },
  ],
  'Rash / flushing / itching': [
    { q: 'How widespread is it?', options: ['One small area', 'Several areas', 'Most of my body'] },
    { q: 'Did it come with any of these?', options: ['None of these', 'New breathing difficulty or wheezing', 'Throat tightness, voice changes, or swelling', 'Feeling faint or collapsing'], stop: ['New breathing difficulty or wheezing', 'Throat tightness, voice changes, or swelling', 'Feeling faint or collapsing'] },
  ],
}
const familiarity = ['About the same as usual', 'Familiar, but worse than usual', 'New or different for me']
const triggers = ['A recent treatment or therapy', 'Physical activity or overexertion', 'Emotional stress', 'Poor sleep', 'Food or drink', 'Environmental exposure (smoke, fragrance, mold, chemicals)', 'Heat, cold, or weather changes', 'Illness or infection', 'Medication or supplement change', 'Hormonal changes', "I don't know", 'Other']
const recentTreatments = ['Hydrogen nano bath · Oct 7', 'Red light therapy · Oct 5', 'IV therapy · Oct 2']
const support = [
  { v: 'No', l: 'Save this to my health timeline' },
  { v: 'Yes', l: 'Save this and have my care team contact me during office hours' },
]
const impacts = [['A little', 'I can still do most of my normal activities.'], ['Moderately', 'I can function, but I need to slow down or do less.'], ['A lot', 'I can only manage essential activities.'], ['Extremely', 'I can barely get out of bed or care for myself.']]
const Q = ({ children }: { children: string }) => <span className="text-[16px] font-semibold">{children}</span>

export default function CrashReport() {
  const [step, setStep] = useState(1)
  const [signs, setSigns] = useState<string[]>([])
  const [emergency, setEmergency] = useState<string | null>(null)
  const [kind, setKind] = useState<'Flare' | 'Crash'>()
  const [impact, setImpact] = useState<string>()
  const [sym, setSym] = useState<string[]>([])
  const [other, setOther] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [usual, setUsual] = useState<string>()
  const [severity, setSeverity] = useState<number>()
  const [onset, setOnset] = useState<string>()
  const [trend, setTrend] = useState<string>()
  const [trig, setTrig] = useState<string[]>([])
  const [treatment, setTreatment] = useState<string>()
  const [med, setMed] = useState<string[]>([])
  const [contact, setContact] = useState<string>()
  const [sent, setSent] = useState(false)
  const toggle = (list: string[], set: (v: string[]) => void, v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])
  const questions = sym.flatMap((s) => (followUps[s] ?? []).map((f) => ({ ...f, key: `${s}|${f.q}`, symptom: s })))
  const word = kind?.toLowerCase() ?? 'flare'

  if (sent) return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col px-5 pt-16 pb-8 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-ok-100 text-ok-700"><Check size={36} /></span>
        <h1 className="mt-5 font-display text-[26px] font-semibold text-sand-900">We received your {word} report</h1>
        <p className="mt-2 text-sand-600">Sent at {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}. {contact === 'Yes' ? 'Your care team has been notified in the clinic\'s medical record system and will contact you during office hours.' : 'Saved to your health timeline so you and your care team can see patterns over time.'}</p>
        <p className="mt-3 rounded-xl bg-sand-100 px-4 py-3 text-sm text-sand-700">In a few days we will ask how you are feeling, so we know when this {word} ended.</p>
        <div className="mt-6 text-left"><MonitoringNotice /></div>
        <a href="tel:911" className="btn-danger btn-lg mt-4 w-full"><Phone size={18} /> If this is an emergency, call 911</a>
        <Link to="/patient/home" className="btn-secondary btn-lg mt-2 w-full">Back to my program</Link>
      </div>
    </PhoneFrame>
  )

  if (emergency) return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col bg-bad-100 px-5 pt-14 pb-8 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-bad-600 text-white"><AlertTriangle size={38} /></span>
        <h1 className="mt-5 font-display text-[30px] font-semibold leading-tight text-bad-700">Call 911 now</h1>
        <p className="mt-3 text-[17px] text-sand-900">{emergency === unsure ? 'If you may be having an emergency, call 911. This form cannot tell you whether it is safe to wait.' : 'These symptoms may be signs of a medical emergency. Do not wait for a response from Helixona or continue this report.'}</p>
        <a href="tel:911" className="btn-danger btn-lg mt-6 w-full bg-bad-600 text-white"><Phone size={20} /> Call 911</a>
        <p className="mt-4 text-sm text-sand-700">This report was not sent. Helixona does not watch this app around the clock and cannot send help.</p>
        <button onClick={() => { setEmergency(null); setSigns([]) }} className="btn-ghost mt-auto w-full text-sm">I selected this by mistake · go back</button>
      </div>
    </PhoneFrame>
  )

  const next = () => setStep(step + 1)
  const canNext = step === 2 ? !!kind && !!impact : step === 3 ? sym.length > 0 && questions.every((f) => answers[f.key]) && (questions.length === 0 || !!usual) : step === 4 ? severity !== undefined && !!onset && !!trend : true
  return (
    <PhoneFrame>
      <PatientTopBar title="Report a flare or crash" back={step === 1 ? <Link to="/patient/home" className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></Link> : <button onClick={() => setStep(step - 1)} className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></button>} right={<VersionTag>Crash report v2 · draft</VersionTag>} />
      <div className="px-5 pb-8">
        <div className="flex items-center gap-1.5" aria-label={`Step ${step} of 5`}>{[1, 2, 3, 4, 5].map((n) => <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= step ? 'bg-sand-900' : 'bg-sand-200'}`} />)}</div>
        <div className="mt-1 text-xs text-sand-500">Step {step} of 5</div>

        {step === 1 && <div className="mt-4">
          <h1 className="font-display text-2xl font-semibold text-sand-900">First, let's make sure you're safe</h1>
          <p className="mt-1 text-[15px] text-sand-600">Are you experiencing any of these right now?</p>
          <div className="mt-4 space-y-2">{[...emergencySigns, unsure].map((s) => <Choice key={s} multiple size="lg" label={s} selected={signs.includes(s)} onClick={() => toggle(signs, setSigns, s)} />)}</div>
          {signs.length > 0
            ? <button onClick={() => setEmergency(signs.includes(unsure) && signs.length === 1 ? unsure : signs[0])} className="btn-danger btn-lg mt-5 w-full bg-bad-600 text-white">Continue</button>
            : <button onClick={next} className="btn-primary btn-lg mt-5 w-full">None of these apply · Continue</button>}
          <div className="mt-4"><MonitoringNotice /></div>
          <div className="mt-3"><SampleBadge>Draft wording · to be approved by the Medical Director</SampleBadge></div>
        </div>}

        {step === 2 && <div className="mt-4 space-y-7">
          <Field label={<Q>What are you reporting?</Q>} required>
            <div className="space-y-2">{(['Flare', 'Crash'] as const).map((k) => { const d = definitions[k.toLowerCase() as 'flare' | 'crash']; const on = kind === k; return (
              <button key={k} type="button" onClick={() => setKind(k)} aria-pressed={on} className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left ${on ? 'border-sand-900 bg-teal-50 shadow-[0_0_0_1px_#141414]' : 'border-sand-300 bg-white'}`}>
                <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${k === 'Crash' ? 'bg-sand-900 text-teal-300' : 'bg-bad-100 text-bad-700'}`}>{k === 'Crash' ? <Zap size={17} /> : <Flame size={17} />}</span>
                <span><span className="block text-[16px] font-semibold text-sand-900">{d.title}</span><span className="mt-0.5 block text-sm leading-relaxed text-sand-600">{d.text}</span></span>
              </button>) })}</div>
          </Field>
          {kind && <Field label={<Q>How much is this affecting your daily activities?</Q>} required>
            <div className="space-y-2">{impacts.map(([v, d]) => <Choice key={v} size="lg" label={`${v} · ${d}`} selected={impact === v} onClick={() => setImpact(v)} />)}</div>
          </Field>}
        </div>}

        {step === 3 && <div className="mt-4">
          <h1 className="font-display text-2xl font-semibold text-sand-900">What symptoms are you experiencing?</h1>
          <p className="mt-1 text-[15px] text-sand-600">Select all that apply. We'll ask a few more questions based on your answers.</p>
          <div className="mt-2"><SampleBadge>Draft wording · to be approved by the Medical Director</SampleBadge></div>
          {groups.map(([g, items]) => <div key={g} className="mt-4"><div className="eyebrow mb-2">{g}</div><div className="space-y-2">{items.map((s) => <Choice key={s} multiple label={s} selected={sym.includes(s)} onClick={() => toggle(sym, setSym, s)} />)}</div></div>)}
          {sym.includes('Other symptom') && <input className="input mt-2 text-[16px]" placeholder="Describe your other symptoms" value={other} onChange={(e) => setOther(e.target.value)} />}
          {questions.length > 0 && <div className="mt-6 space-y-5 border-t border-sand-200 pt-5">
            {questions.map((f) => <Field key={f.key} label={<span><span className="eyebrow block">{f.symptom}</span><Q>{f.q}</Q></span>} required>
              <div className="space-y-2">{f.options.map((o) => <Choice key={o} label={o} selected={answers[f.key] === o} onClick={() => { if (f.stop?.includes(o)) setEmergency(o); else setAnswers({ ...answers, [f.key]: o }) }} />)}</div>
            </Field>)}
            <Field label={<Q>Compared with your usual symptoms, is this:</Q>} required><div className="space-y-2">{familiarity.map((o) => <Choice key={o} label={o} selected={usual === o} onClick={() => setUsual(o)} />)}</div></Field>
            {usual === 'New or different for me' && <div className="flex gap-3 rounded-xl border border-warn-600/30 bg-warn-100 p-3.5 text-sm text-warn-700"><AlertTriangle size={18} className="shrink-0" /><div>New or unusual symptoms should be checked by a clinician. Please call the office at (949) 257-2644 during office hours, or seek care elsewhere if it cannot wait.</div></div>}
          </div>}
        </div>}

        {step === 4 && <div className="mt-4 space-y-7">
          <Field label={<Q>{`At their worst during this ${word}, how severe have your symptoms been?`}</Q>} required><ScaleSlider value={severity} onChange={setSeverity} minLabel="No symptoms" maxLabel="Worst imaginable" /></Field>
          <Field label={<Q>{`When did this ${word} begin?`}</Q>} required><div className="space-y-2">{['Today', 'Yesterday', '2–3 days ago', 'More than 3 days ago', "I'm not sure"].map((o) => <Choice key={o} size="lg" label={o} selected={onset === o} onClick={() => setOnset(o)} />)}</div>{onset === 'More than 3 days ago' && <input type="date" className="input mt-2" aria-label="Approximate start date" />}</Field>
          <Field label={<Q>Since it began, are your symptoms:</Q>} required><div className="space-y-2">{['Getting better', 'Staying about the same', 'Getting worse', 'Going up and down'].map((o) => <Choice key={o} size="lg" label={o} selected={trend === o} onClick={() => setTrend(o)} />)}</div></Field>
        </div>}

        {step === 5 && <div className="mt-4 space-y-7">
          <Field label={<Q>Do you think something may have contributed?</Q>} hint="Optional · select any that apply">
            <div className="space-y-2">{triggers.map((t) => <Choice key={t} multiple label={t} selected={trig.includes(t)} onClick={() => toggle(trig, setTrig, t)} />)}</div>
            {trig.includes('A recent treatment or therapy') && <div className="mt-3 rounded-xl border border-sand-300 p-3"><div className="text-[15px] font-semibold text-sand-900">Which treatment?</div><div className="mt-2 space-y-2">{recentTreatments.map((t) => <Choice key={t} label={t} selected={treatment === t} onClick={() => setTreatment(t)} />)}</div></div>}
            {trig.includes('Medication or supplement change') && <div className="mt-3 rounded-xl border border-sand-300 p-3"><div className="text-[15px] font-semibold text-sand-900">Which one?</div><div className="mt-2 space-y-2">{seedMeds.filter((m) => m.sinceLastVisit || m.source === 'Added by me').map((m) => <Choice key={m.id} multiple label={`${m.name} · ${m.status.toLowerCase()}`} selected={med.includes(m.id)} onClick={() => toggle(med, setMed, m.id)} />)}</div></div>}
          </Field>
          <Field label={<Q>What would you like us to do with this report?</Q>} required><div className="space-y-2">{support.map((o) => <Choice key={o.v} size="lg" label={o.l} selected={contact === o.v} onClick={() => setContact(o.v)} />)}</div>{contact === 'Yes' && <p className="mt-2 rounded-xl bg-teal-50 px-3 py-2 text-sm text-sand-700">When you send this report, your care team gets a message in the clinic's medical record system, so the right person sees it and calls you during office hours.</p>}</Field>
        </div>}

        {step > 1 && step < 5 && <button disabled={!canNext} onClick={next} className="btn-primary btn-lg mt-8 w-full">Continue</button>}
        {step === 5 && <button disabled={!contact} onClick={() => setSent(true)} className="btn-primary btn-lg mt-8 w-full">Send report</button>}
        {step > 1 && <>
          <p className="mt-3 text-center text-xs leading-relaxed text-sand-500">Flare reports are reviewed by your care team during office hours (Mon–Fri 8 AM–5 PM); responses are not immediate. If you need to speak with someone, please call the office at (949) 257-2644.</p>
          <p className="mt-2 text-center text-sm font-semibold text-bad-700">If you have chest pain or severe shortness of breath, call 911.</p>
        </>}
      </div>
    </PhoneFrame>
  )
}
