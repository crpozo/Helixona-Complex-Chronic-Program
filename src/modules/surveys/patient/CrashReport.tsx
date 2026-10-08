import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, Check, Phone } from 'lucide-react'
import { PhoneFrame, PatientTopBar } from '../../../components/PhoneFrame'
import { Choice, Field, MonitoringNotice, SampleBadge, VersionTag } from '../../../components/ui'

const symptoms = ['Extreme fatigue', 'Pain flare', 'Headache / migraine', 'Dizziness', 'Heart racing', 'Nausea', 'Brain fog', 'Fever or chills', 'Rash', 'Shortness of breath', 'Chest pain', 'Fainting']

export default function CrashReport() {
  const [sev, setSev] = useState<number>()
  const [sym, setSym] = useState<string[]>([])
  const [ctx, setCtx] = useState<string>()
  const [onset, setOnset] = useState<string>()
  const [contact, setContact] = useState<string>()
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)
  const redFlag = sym.includes('Chest pain') || sym.includes('Fainting') || sym.includes('Shortness of breath')

  if (sent) {
    return (
      <PhoneFrame>
        <div className="flex flex-1 flex-col px-5 pt-16 pb-8 text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-ok-100 text-ok-700"><Check size={36} /></span>
          <h1 className="mt-5 font-display text-[26px] font-semibold text-sand-900">We received your report</h1>
          <p className="mt-2 text-sand-600">Sent at {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}. {contact === 'Yes' ? 'Your care team has been notified and will contact you during clinic hours.' : 'Your care team will review it during clinic hours.'}</p>
          <div className="mt-6 text-left"><MonitoringNotice /></div>
          <a href="tel:911" className="btn-danger btn-lg mt-4 w-full"><Phone size={18} /> If this is an emergency, call 911</a>
          <Link to="/patient/home" className="btn-secondary btn-lg mt-2 w-full">Back to my program</Link>
        </div>
      </PhoneFrame>
    )
  }

  return (
    <PhoneFrame>
      <PatientTopBar title="Report a crash or flare" back={<Link to="/patient/home" className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></Link>} right={<VersionTag>Crash report v1</VersionTag>} />
      <div className="px-5 pb-8">
        <MonitoringNotice />
        {redFlag && <div className="mt-3 flex gap-3 rounded-xl border border-bad-600/30 bg-bad-100 p-3.5 text-sm text-bad-700"><AlertTriangle size={18} className="shrink-0" /><div><strong>Chest pain, fainting or trouble breathing can be an emergency.</strong> Please call 911 or go to the nearest emergency room now. You can still send this report afterwards.</div></div>}
        <div className="mt-6 space-y-7">
          <div><div className="mb-2"><SampleBadge /></div><Field label={<span className="text-[16px] font-semibold">How severe is it right now?</span>} required>
            <div className="grid grid-cols-11 gap-1">{Array.from({ length: 11 }, (_, n) => <button key={n} type="button" onClick={() => setSev(n)} className={`h-11 rounded-lg border text-[15px] font-semibold ${sev === n ? (n >= 8 ? 'border-bad-600 bg-bad-600 text-white' : 'border-teal-600 bg-teal-600 text-white') : 'border-sand-300 bg-white text-sand-700'}`}>{n}</button>)}</div>
            <div className="mt-1.5 flex justify-between text-xs text-sand-500"><span>Mild</span><span>Worst ever</span></div></Field></div>
          <div><div className="mb-2"><SampleBadge /></div><Field label={<span className="text-[16px] font-semibold">What are you experiencing?</span>} hint="Select all that apply"><div className="grid grid-cols-2 gap-2">{symptoms.map((s) => <Choice key={s} multiple label={s} selected={sym.includes(s)} onClick={() => setSym(sym.includes(s) ? sym.filter((x) => x !== s) : [...sym, s])} />)}</div></Field></div>
          <div><div className="mb-2"><SampleBadge /></div><Field label={<span className="text-[16px] font-semibold">When did it start?</span>} required><div className="space-y-2">{['In the last few hours', 'Yesterday', '2–3 days ago', 'More than 3 days ago'].map((o) => <Choice key={o} size="lg" label={o} selected={onset === o} onClick={() => setOnset(o)} />)}</div></Field></div>
          <div><div className="mb-2"><SampleBadge /></div><Field label={<span className="text-[16px] font-semibold">Is this related to a recent session?</span>}><div className="space-y-2">{['Yes — red light (Oct 7)', 'Yes — nano bath (Oct 5)', 'Not related to a session', 'Not sure'].map((o) => <Choice key={o} size="lg" label={o} selected={ctx === o} onClick={() => setCtx(o)} />)}</div></Field></div>
          <div><div className="mb-2"><SampleBadge /></div><Field label={<span className="text-[16px] font-semibold">Anything else you want us to know?</span>}><textarea rows={3} className="input text-[16px]" value={text} onChange={(e) => setText(e.target.value)} /></Field></div>
          <div><div className="mb-2"><SampleBadge /></div><Field label={<span className="text-[16px] font-semibold">Would you like someone to contact you?</span>} required><div className="grid grid-cols-2 gap-2">{['Yes', 'No'].map((o) => <Choice key={o} size="lg" label={o} selected={contact === o} onClick={() => setContact(o)} />)}</div></Field></div>
        </div>
        <button disabled={sev === undefined || !onset || !contact} onClick={() => setSent(true)} className="btn-primary btn-lg mt-8 w-full">Send report</button>
        <p className="mt-3 text-center text-xs text-sand-500">Reports are reviewed during clinic hours (Mon–Fri 8 AM–5 PM). Not monitored overnight.</p>
      </div>
    </PhoneFrame>
  )
}
