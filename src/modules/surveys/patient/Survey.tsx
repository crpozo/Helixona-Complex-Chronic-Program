import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { PhoneFrame, PatientTopBar } from '../../../components/PhoneFrame'
import { Choice, Field, MonitoringNotice, VersionTag } from '../../../components/ui'

/** Daily health check-in. Redesigned per the Oct 20, 2026 review: sliders instead of 0–10 buttons,
 *  then a follow-up on the treatments the patient actually received (dates come from the booking records). */
const measures = [
  { key: 'energy', label: 'Energy', low: 'Drained', high: 'Full of energy', prev: 4 },
  { key: 'fatigue', label: 'Fatigue', low: 'None', high: 'Severe', prev: 6 },
  { key: 'pain', label: 'Pain', low: 'No pain', high: 'Worst imaginable', prev: 3 },
  { key: 'fog', label: 'Brain fog', low: 'Clear', high: 'Very foggy', prev: 5 },
  { key: 'sleep', label: 'Sleep last night', low: 'Poor', high: 'Restful', prev: 5 },
]
const recentTreatments = [
  { name: 'Red light therapy', when: 'Oct 21 · 2 days ago' },
  { name: 'Oxygen & hydrogen nano bath', when: 'Oct 19 · 4 days ago' },
  { name: 'IV therapy (glutathione)', when: 'Oct 16 · 7 days ago' },
]
const treatmentOptions = ['Yes, I feel better', 'Some things improved, others worsened', 'No', 'Not sure yet']

function Slider({ value, prev, onChange, low, high }: { value?: number; prev: number; onChange: (n: number) => void; low: string; high: string }) {
  const v = value ?? prev
  return (
    <div>
      <div className="flex items-center gap-3">
        <input type="range" min={0} max={10} step={1} value={v} onChange={(e) => onChange(Number(e.target.value))} className="h-2 flex-1 cursor-pointer accent-teal-600" aria-valuemin={0} aria-valuemax={10} aria-valuenow={v} />
        <span className={`w-9 text-center font-display text-2xl font-semibold ${value === undefined ? 'text-sand-400' : 'text-sand-900'}`}>{v}</span>
      </div>
      <div className="mt-1 flex justify-between text-xs text-sand-500"><span>{low}</span><span>{high}</span></div>
      <div className="mt-1 text-xs text-sand-400">Yesterday: {prev}{value === undefined ? ' · slide to update' : ''}</div>
    </div>
  )
}

export default function Survey() {
  const nav = useNavigate()
  const [a, setA] = useState<Record<string, number | undefined>>({})
  const [t, setT] = useState<Record<string, string>>({})
  const [contact, setContact] = useState<string>()
  const [step, setStep] = useState<'snapshot' | 'treatments' | 'done'>('snapshot')
  const set = (k: string, v: number) => setA((x) => ({ ...x, [k]: v }))
  const answered = measures.filter((m) => a[m.key] !== undefined).length

  if (step === 'done') {
    return (
      <PhoneFrame>
        <div className="flex flex-1 flex-col px-5 pt-16 pb-8 text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-ok-100 text-ok-700"><Check size={36} /></span>
          <h1 className="mt-5 font-display text-[26px] font-semibold text-sand-900">Thank you</h1>
          <p className="mt-2 text-sand-600">Your check-in was saved at {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}. {contact === 'Yes' ? 'Your request to be contacted is in the care team queue; they reply during office hours.' : 'Your care team reviews check-ins during office hours. You can see your trend on your home screen.'}</p>
          <div className="mt-6 text-left"><MonitoringNotice /></div>
          <Link to="/patient/home" className="btn-primary btn-lg mt-8 w-full">Back to my program</Link>
        </div>
      </PhoneFrame>
    )
  }

  if (step === 'treatments') {
    return (
      <PhoneFrame>
        <PatientTopBar title="Daily health check-in" back={<button onClick={() => setStep('snapshot')} className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></button>} right={<VersionTag>Check-in v3</VersionTag>} />
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
              </div>
            ))}
            <Field label={<span className="text-[16px] font-semibold">Would you like someone from the care team to contact you?</span>} required><div className="grid grid-cols-2 gap-2">{['Yes', 'No'].map((o) => <Choice key={o} size="lg" label={o} selected={contact === o} onClick={() => setContact(o)} />)}</div></Field>
          </div>
          <button disabled={!contact} onClick={() => setStep('done')} className="btn-primary btn-lg mt-8 w-full">Save my check-in</button>
          <button onClick={() => nav('/patient/crash')} className="btn-ghost mt-2 w-full text-sm">Feeling much worse? Report a crash or flare</button>
          <div className="mt-4"><MonitoringNotice /></div>
        </div>
      </PhoneFrame>
    )
  }

  return (
    <PhoneFrame>
      <PatientTopBar title="Daily health check-in" back={<Link to="/patient/home" className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></Link>} right={<VersionTag>Check-in v3</VersionTag>} />
      <div className="px-5 pb-8">
        <h1 className="font-display text-2xl font-semibold text-sand-900">Your daily health snapshot</h1>
        <p className="mt-1 text-[15px] text-sand-600">About one minute. Slide each bar to where you are today; yesterday's answer is shown so you don't start from zero.</p>
        <div className="mt-6 space-y-6">
          {measures.map((m) => (
            <div key={m.key}>
              <div className="mb-1.5 text-[16px] font-semibold text-sand-900">{m.label}</div>
              <Slider value={a[m.key]} prev={m.prev} onChange={(n) => set(m.key, n)} low={m.low} high={m.high} />
            </div>
          ))}
        </div>
        <div className="mt-6 text-center text-xs text-sand-500">{answered} of {measures.length} updated · unchanged bars keep yesterday's value</div>
        <button onClick={() => setStep('treatments')} className="btn-primary btn-lg mt-3 w-full">Next: recent treatments</button>
        <button onClick={() => nav('/patient/crash')} className="btn-ghost mt-2 w-full text-sm">Feeling much worse? Report a crash or flare</button>
        <div className="mt-4"><MonitoringNotice /></div>
      </div>
    </PhoneFrame>
  )
}
