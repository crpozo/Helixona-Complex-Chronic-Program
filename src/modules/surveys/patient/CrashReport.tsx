import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, Check, Phone } from 'lucide-react'
import { PhoneFrame, PatientTopBar } from '../../../components/PhoneFrame'
import { Choice, Field, MonitoringNotice, SampleBadge, ScaleSlider, VersionTag } from '../../../components/ui'

const support = [
  { v: 'No', l: 'Just document this flare (tracking my symptoms and patterns over time)' },
  { v: 'Yes', l: "I'd like someone to contact me" },
]
const symptoms = ['Extreme fatigue', 'Pain flare', 'Headache / migraine', 'Dizziness', 'Heart racing', 'Nausea', 'Brain fog', 'Fever or chills', 'Rash', 'Fainting', 'Shortness of breath', 'Other']

export default function CrashReport() {
  const [sev, setSev] = useState<number>()
  const [sym, setSym] = useState<string[]>([])
  const [onset, setOnset] = useState<string>()
  const [contact, setContact] = useState<string>()
  const [other, setOther] = useState('')
  const [sob, setSob] = useState<string>()
  const [sent, setSent] = useState(false)
  const redFlag = sym.includes('Fainting')

  if (sent) {
    return (
      <PhoneFrame>
        <div className="flex flex-1 flex-col px-5 pt-16 pb-8 text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-ok-100 text-ok-700"><Check size={36} /></span>
          <h1 className="mt-5 font-display text-[26px] font-semibold text-sand-900">We received your report</h1>
          <p className="mt-2 text-sand-600">Sent at {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}. {contact === 'Yes' ? 'Your care team has been notified in the clinic\'s medical record system and will contact you during office hours.' : 'Saved to your flare history so you and your care team can see patterns over time.'}</p>
          <div className="mt-6 text-left"><MonitoringNotice /></div>
          <a href="tel:911" className="btn-danger btn-lg mt-4 w-full"><Phone size={18} /> If this is an emergency, call 911</a>
          <Link to="/patient/home" className="btn-secondary btn-lg mt-2 w-full">Back to my program</Link>
        </div>
      </PhoneFrame>
    )
  }

  if (sym.includes('Shortness of breath') && sob === 'Severe') {
    return (
      <PhoneFrame>
        <div className="flex flex-1 flex-col bg-bad-100 px-5 pt-14 pb-8 text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-bad-600 text-white"><AlertTriangle size={38} /></span>
          <h1 className="mt-5 font-display text-[30px] font-semibold leading-tight text-bad-700">Call 911 now</h1>
          <p className="mt-3 text-[17px] text-sand-900">Severe trouble breathing can be an emergency. Please stop here and call 911, or go to the nearest emergency room.</p>
          <a href="tel:911" className="btn-danger btn-lg mt-6 w-full bg-bad-600 text-white"><Phone size={20} /> Call 911</a>
          <p className="mt-4 text-sm text-sand-700">This report was not sent. Helixona does not watch this app around the clock and cannot send help.</p>
          <button onClick={() => setSob(undefined)} className="btn-ghost mt-auto w-full text-sm">My breathing is not severe · go back</button>
        </div>
      </PhoneFrame>
    )
  }

  return (
    <PhoneFrame>
      <PatientTopBar title="Report a crash or flare" back={<Link to="/patient/home" className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></Link>} right={<VersionTag>Crash report v1</VersionTag>} />
      <div className="px-5 pb-8">
        <MonitoringNotice />
        {redFlag && <div className="mt-3 flex gap-3 rounded-xl border border-bad-600/30 bg-bad-100 p-3.5 text-sm text-bad-700"><AlertTriangle size={18} className="shrink-0" /><div><strong>Fainting can be an emergency.</strong> Please call 911 or go to the nearest emergency room now. You can still send this report afterwards.</div></div>}
        <div className="mt-6 space-y-7">
          <div><div className="mb-2"><SampleBadge /></div><Field label={<span className="text-[16px] font-semibold">How severe are your symptoms?</span>} required>
            <ScaleSlider value={sev} onChange={setSev} min={0} max={10} minLabel="0 · Mild" maxLabel="10 · Worst ever" /></Field></div>
          <div><div className="mb-2"><SampleBadge /></div><Field label={<span className="text-[16px] font-semibold">What symptoms are you experiencing?</span>} hint="Select all that apply"><div className="grid grid-cols-2 gap-2">{symptoms.map((s) => <Choice key={s} multiple label={s} selected={sym.includes(s)} onClick={() => setSym(sym.includes(s) ? sym.filter((x) => x !== s) : [...sym, s])} />)}</div>{sym.includes('Shortness of breath') && <div className="mt-3 rounded-xl border border-sand-300 p-3"><div className="text-[15px] font-semibold text-sand-900">How severe is your shortness of breath? <span className="text-bad-600">*</span></div><div className="mt-2 space-y-2">{[['Mild', 'I notice it but can talk and move normally'], ['Moderate', 'I have to slow down or rest'], ['Severe', 'I struggle to breathe or speak']].map(([v, d]) => <Choice key={v} size="lg" label={`${v} · ${d}`} selected={sob === v} onClick={() => setSob(v)} />)}</div></div>}{sym.includes('Other') && <input className="input mt-2 text-[16px]" placeholder="Describe your other symptoms" value={other} onChange={(e) => setOther(e.target.value)} autoFocus />}</Field></div>
          <div><div className="mb-2"><SampleBadge /></div><Field label={<span className="text-[16px] font-semibold">When did the crash or flare begin?</span>} required><div className="space-y-2">{['In the last few hours', 'Yesterday', '2–3 days ago', 'More than 3 days ago'].map((o) => <Choice key={o} size="lg" label={o} selected={onset === o} onClick={() => setOnset(o)} />)}</div></Field></div>
          <div><div className="mb-2"><SampleBadge /></div><Field label={<span className="text-[16px] font-semibold">How can we support you?</span>} required><div className="space-y-2">{support.map((o) => <Choice key={o.v} size="lg" label={o.l} selected={contact === o.v} onClick={() => setContact(o.v)} />)}</div>{contact === 'Yes' && <p className="mt-2 rounded-xl bg-teal-50 px-3 py-2 text-sm text-sand-700">When you send this report, your care team gets a message in the clinic's medical record system, so the right person sees it and calls you during office hours.</p>}</Field></div>
        </div>
        <button disabled={sev === undefined || !onset || !contact || (sym.includes('Shortness of breath') && !sob)} onClick={() => setSent(true)} className="btn-primary btn-lg mt-8 w-full">Send report</button>
        <p className="mt-3 text-center text-xs leading-relaxed text-sand-500">Flare reports are reviewed by your care team during office hours (Mon–Fri 8 AM–5 PM); responses are not immediate. If you need to speak with someone, please call the office at (949) 257-2644.</p>
        <p className="mt-2 text-center text-sm font-semibold text-bad-700">If you have chest pain or severe shortness of breath, call 911.</p>
      </div>
    </PhoneFrame>
  )
}
