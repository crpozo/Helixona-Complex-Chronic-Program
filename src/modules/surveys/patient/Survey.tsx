import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { PhoneFrame, PatientTopBar } from '../../../components/PhoneFrame'
import { Choice, Field, MonitoringNotice, SampleBadge, VersionTag } from '../../../components/ui'

const scale = (v: number | undefined, set: (n: number) => void) => (
  <div className="grid grid-cols-11 gap-1">
    {Array.from({ length: 11 }, (_, n) => (
      <button key={n} type="button" onClick={() => set(n)} aria-pressed={v === n} className={`h-11 rounded-lg border text-[15px] font-semibold ${v === n ? 'border-teal-600 bg-teal-600 text-white' : 'border-sand-300 bg-white text-sand-700'}`}>{n}</button>
    ))}
  </div>
)

export default function Survey() {
  const nav = useNavigate()
  const [a, setA] = useState<Record<string, unknown>>({})
  const [done, setDone] = useState(false)
  const set = (k: string, v: unknown) => setA((x) => ({ ...x, [k]: v }))
  const ready = a.energy !== undefined && a.pain !== undefined && a.reaction !== undefined && a.contact !== undefined

  if (done) {
    return (
      <PhoneFrame>
        <div className="flex flex-1 flex-col px-5 pt-16 pb-8 text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-ok-100 text-ok-700"><Check size={36} /></span>
          <h1 className="mt-5 font-display text-[26px] font-semibold text-sand-900">Thank you</h1>
          <p className="mt-2 text-sand-600">Your check-in was received at {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}. {a.contact === 'Yes' ? 'A nurse will contact you during clinic hours, usually within 4 hours.' : 'Your care team reviews check-ins during clinic hours.'}</p>
          <div className="mt-6 text-left"><MonitoringNotice /></div>
          <Link to="/patient/home" className="btn-primary btn-lg mt-8 w-full">Back to my program</Link>
        </div>
      </PhoneFrame>
    )
  }

  return (
    <PhoneFrame>
      <PatientTopBar title="Check-in · 1 day after red light" back={<Link to="/patient/home" className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></Link>} right={<VersionTag>Survey v2</VersionTag>} />
      <div className="px-5 pb-8">
        <h1 className="font-display text-2xl font-semibold text-sand-900">How are you feeling today?</h1>
        <p className="mt-1 text-[15px] text-sand-600">About 2 minutes. This is day 1 of 3 check-ins after your red light session on Oct 7.</p>
        <div className="mt-4"><MonitoringNotice /></div>
        <div className="mt-6 space-y-7">
          <div><div className="mb-2"><SampleBadge /></div><Field label={<span className="text-[16px] font-semibold">Energy level today</span>} required>{scale(a.energy as number, (n) => set('energy', n))}<div className="mt-1.5 flex justify-between text-xs text-sand-500"><span>None</span><span>Full</span></div></Field></div>
          <div><div className="mb-2"><SampleBadge /></div><Field label={<span className="text-[16px] font-semibold">Pain level today</span>} required>{scale(a.pain as number, (n) => set('pain', n))}<div className="mt-1.5 flex justify-between text-xs text-sand-500"><span>No pain</span><span>Worst imaginable</span></div></Field></div>
          <div><div className="mb-2"><SampleBadge /></div><Field label={<span className="text-[16px] font-semibold">Sleep quality last night</span>}>{scale(a.sleep as number, (n) => set('sleep', n))}</Field></div>
          <div><div className="mb-2"><SampleBadge /></div><Field label={<span className="text-[16px] font-semibold">Did you have any reaction after your session?</span>} required><div className="grid grid-cols-2 gap-2">{['Yes', 'No'].map((o) => <Choice key={o} size="lg" label={o} selected={a.reaction === o} onClick={() => set('reaction', o)} />)}</div></Field></div>
          {a.reaction === 'Yes' && <div><div className="mb-2"><SampleBadge /></div><Field label={<span className="text-[16px] font-semibold">Please describe it</span>}><textarea rows={3} className="input text-[16px]" value={(a.reactionText as string) ?? ''} onChange={(e) => set('reactionText', e.target.value)} placeholder="e.g., mild redness on arms for a few hours" /></Field></div>}
          <div><div className="mb-2"><SampleBadge /></div><Field label={<span className="text-[16px] font-semibold">Would you like someone from the care team to contact you?</span>} required><div className="grid grid-cols-2 gap-2">{['Yes', 'No'].map((o) => <Choice key={o} size="lg" label={o} selected={a.contact === o} onClick={() => set('contact', o)} />)}</div></Field></div>
        </div>
        <button disabled={!ready} onClick={() => setDone(true)} className="btn-primary btn-lg mt-8 w-full">Send check-in</button>
        <button onClick={() => nav('/patient/crash')} className="btn-ghost mt-2 w-full text-sm">Feeling much worse? Report a crash or flare</button>
      </div>
    </PhoneFrame>
  )
}
