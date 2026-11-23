import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, ChevronDown, Info } from 'lucide-react'
import { PhoneFrame, PatientTopBar } from '../../../components/PhoneFrame'
import { Choice, MonitoringNotice, ScaleSlider, VersionTag } from '../../../components/ui'

/** Daily health check-in v4 (clinic brief of Nov 19, 2026, docs/source/HCOS_Daily_Health_Checkin_v4.md).
 *  Every slider runs the same way: 0 is the worst day, 10 the best, better to the right. Yesterday's answer is
 *  shown for reference only; nothing counts as today's answer until the patient moves the slider or taps
 *  "Same as yesterday". Each category has optional details that never block sending. */
interface Measure { key: string; label: string; about: string; low: string; high: string; prev: number; prompt: string; options: string[]; follow?: { q: string; options: string[] }[]; note: string }
const measures: Measure[] = [
  { key: 'energy', label: 'Energy', about: 'How much energy do you have for your usual activities today?', low: 'No energy', high: 'Full of energy', prev: 4, prompt: 'What is affecting your energy today?',
    options: ['Low energy throughout the day', 'Energy dropped suddenly', 'Energy worsened after activity', 'Needed extra rest or naps', 'Feel physically weak', 'Feel sleepy or drowsy', 'Energy comes and goes', 'Other'],
    follow: [{ q: 'When was your energy lowest?', options: ['Morning', 'Afternoon', 'Evening', 'All day', 'Not sure'] }], note: 'Anything else about your energy today?' },
  { key: 'comfort', label: 'Physical Comfort', about: 'How comfortable is your body today? Think about aches, pain, or discomfort.', low: 'Severe pain', high: 'No pain', prev: 6, prompt: 'What kind of pain or discomfort are you experiencing?',
    options: ['Headache', 'Migraine', 'Joint pain', 'Muscle pain', 'Bone or deep aching pain', 'Nerve pain (burning, tingling, or shooting)', 'Neck or back pain', 'Abdominal pain', 'Widespread pain', 'Other'],
    follow: [{ q: 'Where?', options: ['Head / Face', 'Neck / Shoulders', 'Arms / Hands', 'Upper Back', 'Abdomen', 'Lower Back / Hips', 'Legs / Feet', 'All over'] }, { q: 'What does it feel like?', options: ['Aching', 'Sharp or stabbing', 'Burning', 'Throbbing', 'Pressure or tightness', 'Tingling or electric', 'Cramping'] }], note: 'Anything else about your pain?' },
  { key: 'clarity', label: 'Mental Clarity', about: 'How clearly can you think, focus, and remember things today?', low: 'Very foggy', high: 'Clear and focused', prev: 5, prompt: 'What are you noticing with your thinking or memory?',
    options: ['Trouble concentrating', 'Forgetting things', 'Difficulty finding words', 'Thinking feels slow', 'Hard to follow conversations', 'Difficulty reading or understanding information', 'Feeling mentally overwhelmed', 'Mentally tired after thinking or concentrating', 'Other'],
    follow: [{ q: 'When is your mental clarity most affected?', options: ['Morning', 'Afternoon', 'Evening', 'All day', 'Comes and goes', 'Not sure'] }], note: 'Anything else about your mental clarity?' },
  { key: 'sleep', label: 'Sleep Quality', about: 'How well did you sleep last night?', low: 'Very poor sleep', high: 'Restful sleep', prev: 5, prompt: 'What affected your sleep?',
    options: ['Trouble falling asleep', 'Woke up several times', 'Woke up too early', 'Sweating or feeling too hot', 'Feeling too cold', 'Racing thoughts', 'Pain or physical discomfort', 'Needed to use the bathroom', 'Breathing problems or snoring', 'Restless legs or body', 'Nightmares or vivid dreams', 'Slept but did not feel rested', 'Other'],
    follow: [{ q: 'How many times did you wake up?', options: ['None', 'Once', '2–3 times', '4 or more', 'Not sure'] }], note: 'Anything else about your sleep?' },
  { key: 'digestion', label: 'Digestive Comfort', about: 'How comfortable has your stomach and digestion been today?', low: 'Very uncomfortable', high: 'Very comfortable', prev: 6, prompt: 'What digestive symptoms are you experiencing?',
    options: ['Diarrhea or loose stools', 'Constipation', 'Bloating', 'Gas', 'Abdominal pain or cramping', 'Nausea', 'Acid reflux or heartburn', 'Vomiting', 'Feeling unusually full', 'Poor appetite', 'Urgent need for a bowel movement', 'Other'],
    follow: [{ q: 'Have you noticed a change after eating?', options: ['Symptoms worsened', 'Symptoms improved', 'No noticeable connection', 'Not sure'] }], note: 'Anything else about your digestion?' },
]
const recentTreatments = [
  { name: 'Red light therapy', when: 'Oct 21 · 2 days ago' },
  { name: 'Hydrogen nano bath', when: 'Oct 19 · 4 days ago' },
  { name: 'IV therapy (glutathione)', when: 'Oct 16 · 7 days ago' },
]
const treatmentOptions = ['Yes, I feel better', 'Some things improved, others worsened', 'No', 'Not sure yet']

function Chips({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (o: string) => void }) {
  return <div className="flex flex-wrap gap-2">{options.map((o) => { const on = selected.includes(o); return <button key={o} type="button" aria-pressed={on} onClick={() => onToggle(o)} className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm ${on ? 'border-sand-900 bg-sand-900 text-white' : 'border-sand-300 bg-white text-sand-700'}`}>{on && <Check size={13} />}{o}</button> })}</div>
}

export default function Survey() {
  const nav = useNavigate()
  const [a, setA] = useState<Record<string, number | undefined>>({})
  const [t, setT] = useState<Record<string, string>>({})
  const [fb, setFb] = useState<Record<string, string>>({})
  const [step, setStep] = useState<'snapshot' | 'treatments' | 'done'>('snapshot')
  const set = (k: string, v: number) => setA((x) => ({ ...x, [k]: v }))
  const answered = measures.filter((m) => a[m.key] !== undefined).length
  const [same, setSame] = useState<string[]>([])
  const [info, setInfo] = useState<string | null>(null)
  const [openD, setOpenD] = useState<string[]>([])
  const [picks, setPicks] = useState<Record<string, string[]>>({})
  const toggleIn = (k: string, o: string) => setPicks((x) => { const cur = x[k] ?? []; return { ...x, [k]: cur.includes(o) ? cur.filter((y) => y !== o) : [...cur, o] } })

  if (step === 'done') {
    return (
      <PhoneFrame>
        <div className="flex flex-1 flex-col px-5 pt-16 pb-8 text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-ok-100 text-ok-700"><Check size={36} /></span>
          <h1 className="mt-5 font-display text-[26px] font-semibold text-sand-900">Thank you</h1>
          <p className="mt-2 text-sand-600">Your check-in was saved at {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}. Your care team reviews check-ins during office hours. You can see your trend on your home screen.</p>
          <div className="mt-6 text-left"><MonitoringNotice /></div>
          <Link to="/patient/home" className="btn-primary btn-lg mt-8 w-full">Back to my program</Link>
        </div>
      </PhoneFrame>
    )
  }

  if (step === 'treatments') {
    return (
      <PhoneFrame>
        <PatientTopBar title="Daily health check-in" back={<button onClick={() => setStep('snapshot')} className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></button>} right={<VersionTag>Check-in v4 · draft</VersionTag>} />
        <div className="px-5 pb-8">
          <h1 className="font-display text-2xl font-semibold text-sand-900">Let's check in on your recent treatments</h1>
          <p className="mt-1 text-[15px] text-sand-600">These are the sessions you've had in the last 7 days.</p>
          <div className="mt-5 space-y-5">
            {recentTreatments.map((r) => (
              <div key={r.name} className="card p-4">
                <div className="font-semibold text-sand-900">{r.name}</div>
                <div className="text-xs text-sand-500">{r.when}</div>
                <div className="mt-3 text-[15px] font-medium text-sand-800">Do you feel this treatment helped?</div>
                <div className="mt-2 space-y-2">{treatmentOptions.map((o) => <Choice key={o} label={o} selected={t[r.name] === o} onClick={() => setT({ ...t, [r.name]: o })} />)}</div>
                <label className="mt-3 block"><span className="mb-1.5 block text-sm font-medium text-sand-700">Tell us more <span className="font-normal text-sand-500">(optional)</span></span><textarea rows={2} className="input text-[16px]" placeholder="How did you feel after this session?" value={fb[r.name] ?? ''} onChange={(e) => setFb({ ...fb, [r.name]: e.target.value })} /></label>
              </div>
            ))}
          </div>
          <button onClick={() => setStep('done')} className="btn-primary btn-lg mt-8 w-full">Save my check-in</button>
          <button onClick={() => nav('/patient/crash')} className="btn-ghost mt-2 w-full text-sm">Feeling much worse? Report a crash or flare</button>
          <div className="mt-4"><MonitoringNotice /></div>
        </div>
      </PhoneFrame>
    )
  }

  return (
    <PhoneFrame>
      <PatientTopBar title="Daily health check-in" back={<Link to="/patient/home" className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></Link>} right={<VersionTag>Check-in v4 · draft</VersionTag>} />
      <div className="px-5 pb-8">
        <h1 className="font-display text-2xl font-semibold text-sand-900">Your Daily Health Snapshot</h1>
        <p className="mt-1 text-[15px] text-sand-600">How are you feeling today? Move each slider to show how you're doing. <strong>A higher number means you're feeling better.</strong> Have more to share? You can add details below any question.</p>
        <div className="mt-6 space-y-4">
          {measures.map((m) => { const v = a[m.key]; const isOpen = openD.includes(m.key); const n = (picks[m.key] ?? []).length + m.follow!.reduce((t, f) => t + (picks[m.key + f.q] ?? []).length, 0); return (
            <div key={m.key} className="rounded-2xl border border-sand-200 bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[17px] font-semibold text-sand-900">{m.label}</div>
                <button type="button" aria-label={`What does ${m.label} mean?`} aria-expanded={info === m.key} onClick={() => setInfo(info === m.key ? null : m.key)} className={`flex h-8 w-8 items-center justify-center rounded-full ${info === m.key ? 'bg-sand-900 text-white' : 'bg-sand-100 text-sand-600'}`}><Info size={16} /></button>
              </div>
              {info === m.key && <p className="mt-2 rounded-xl bg-sand-100 px-3 py-2 text-sm text-sand-700">{m.about} 0 means "{m.low.toLowerCase()}", 10 means "{m.high.toLowerCase()}".</p>}
              <ScaleSlider value={v} onChange={(x) => { set(m.key, x); setSame(same.filter((k) => k !== m.key)) }} min={0} max={10} minLabel={`0 · ${m.low}`} maxLabel={`10 · ${m.high}`} />
              <div className="mt-2 flex items-center justify-between gap-2 text-xs text-sand-500">
                <span>Yesterday: <strong className="text-sand-700">{m.prev}</strong>{v === undefined ? ' · not yet answered' : same.includes(m.key) ? ' · same as yesterday' : ''}</span>
                {v === undefined && <button type="button" onClick={() => { set(m.key, m.prev); setSame([...same, m.key]) }} className="rounded-full border border-sand-300 px-3 py-1.5 text-xs font-semibold text-sand-800">Same as yesterday</button>}
              </div>
              {v !== undefined && v <= 4 && !isOpen && <p className="mt-2 text-sm text-sand-600">Having a difficult day? You can tell us a little more.</p>}
              <button type="button" aria-expanded={isOpen} onClick={() => setOpenD(isOpen ? openD.filter((k) => k !== m.key) : [...openD, m.key])} className="mt-3 flex w-full items-center justify-between rounded-xl bg-sand-50 px-3 py-2.5 text-sm font-medium text-sand-800"><span>{isOpen ? 'Hide details' : '+ Add details (optional)'}{n > 0 && <span className="ml-2 rounded-full bg-sand-900 px-2 py-0.5 text-[11px] text-white">{n} selected</span>}</span><ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} /></button>
              {isOpen && <div className="mt-3 space-y-4">
                <div><div className="mb-2 text-sm font-semibold text-sand-900">{m.prompt}</div><Chips options={m.options} selected={picks[m.key] ?? []} onToggle={(o) => toggleIn(m.key, o)} /></div>
                {m.follow!.map((f) => <div key={f.q}><div className="mb-2 text-sm font-semibold text-sand-900">{f.q}</div><Chips options={f.options} selected={picks[m.key + f.q] ?? []} onToggle={(o) => toggleIn(m.key + f.q, o)} /></div>)}
                {m.key === 'sleep' && <label className="block text-sm font-semibold text-sand-900">About how many hours did you sleep?<input type="number" step="0.5" min="0" max="24" inputMode="decimal" className="input mt-1" placeholder="For example 6.5" /></label>}
                {m.key === 'digestion' && <label className="block text-sm font-semibold text-sand-900">How many bowel movements have you had today?<input type="number" min="0" inputMode="numeric" className="input mt-1" placeholder="Optional" /></label>}
                <textarea rows={2} className="input" placeholder={m.note} />
                {m.key === 'comfort' && <p className="rounded-xl bg-bad-100 px-3 py-2 text-sm font-medium text-bad-700">If you have chest pain or severe shortness of breath, call 911. Do not use this check-in for an emergency.</p>}
              </div>}
            </div>) })}
        </div>
        <div className="mt-5 text-center text-xs text-sand-500">{answered} of {measures.length} answered · you can send without answering all of them · skipped questions are saved as skipped</div>
        <Link to="/patient/crash" className="btn-ghost mt-1 w-full text-sm">Report a flare or crash instead</Link>
        <button onClick={() => setStep('treatments')} className="btn-primary btn-lg mt-3 w-full">Next: recent treatments</button>
        <button onClick={() => nav('/patient/crash')} className="btn-ghost mt-2 w-full text-sm">Feeling much worse? Report a crash or flare</button>
        <div className="mt-4"><MonitoringNotice /></div>
      </div>
    </PhoneFrame>
  )
}
