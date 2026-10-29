import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CalendarCheck, Clock, CreditCard, Lock, Users } from 'lucide-react'
import { PhoneFrame, PatientTopBar, Wordmark } from '../../components/PhoneFrame'
import { Choice, Field, Notice, Pill } from '../../components/ui'
import { consents } from '../../mock/consentContent'

/** Public "Book a treatment" flow (treatment-only, no patient enrollment). Meeting of Oct 20, 2026. */
const therapies = [
  { id: 'salt', name: 'Salt room', duration: 45, price: 45, group: true, clearance: false, consent: 'general-informed-consent-for-treatment' },
  { id: 'nano', name: 'Oxygen & hydrogen nano bath', duration: 45, price: 95, group: false, clearance: false, consent: 'general-informed-consent-for-treatment' },
  { id: 'red', name: 'Red light therapy', duration: 30, price: 65, group: false, clearance: false, consent: 'general-informed-consent-for-treatment' },
  { id: 'h2', name: 'Hydrogen inhalation', duration: 60, price: 55, group: false, clearance: false, consent: 'general-informed-consent-for-treatment' },
  { id: 'bemer', name: 'BEMER', duration: 20, price: 40, group: false, clearance: false, consent: 'general-informed-consent-for-treatment' },
  { id: 'iv', name: 'IV therapy', duration: 60, price: 225, group: false, clearance: false, consent: 'consent-and-authorization-for-intravenous-therapy-procedures' },
  { id: 'eboo', name: 'EBOO', duration: 120, price: 0, group: false, clearance: true, consent: '' },
  { id: 'laser', name: 'Erchonia laser', duration: 30, price: 0, group: false, clearance: true, consent: '' },
]
const slots = ['Today · 1:00 PM', 'Today · 3:30 PM', 'Tomorrow · 10:00 AM', 'Tomorrow · 2:00 PM', 'Sat · 9:00 AM']

export default function BookTreatment() {
  const [step, setStep] = useState<'list' | 'time' | 'details' | 'consent' | 'done'>('list')
  const [t, setT] = useState(therapies[0])
  const [slot, setSlot] = useState<string>()
  const [people, setPeople] = useState(1)
  const [visited, setVisited] = useState<string>()
  const [agree, setAgree] = useState(false)
  const [sig, setSig] = useState('')
  const consent = consents.find((c) => c.key === t.consent)

  const Header = ({ title, back }: { title: string; back: () => void }) => <PatientTopBar title={title} back={<button onClick={back} className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></button>} right={<span className="text-xs text-sand-500">Step {['list', 'time', 'details', 'consent', 'done'].indexOf(step) + 1} of 5</span>} />

  if (step === 'list') return (
    <PhoneFrame>
      <div className="bg-teal-800 px-6 pt-12 pb-8 text-white"><Wordmark light size="md" /><h1 className="mt-5 font-display text-[28px] leading-[1.1] font-semibold">Book a treatment</h1><p className="mt-2 text-teal-100 text-[15px]">Pick a therapy, choose a time, pay securely. No forms beyond what the therapy needs.</p></div>
      <div className="-mt-4 flex-1 rounded-t-3xl bg-white px-5 pt-6 pb-8">
        <ul className="space-y-2">
          {therapies.map((x) => (
            <li key={x.id}>
              {x.clearance ? (
                <div className="card flex items-center gap-3 p-3.5 opacity-90"><span className="flex-1"><span className="block font-semibold text-sand-900">{x.name}</span><span className="block text-xs text-sand-500">Requires physician clearance</span></span><Link to="/public/become-a-patient" className="btn-secondary px-3 py-1.5 text-[11px]">Become a patient</Link></div>
              ) : (
                <button onClick={() => { setT(x); setStep('time') }} className="card flex w-full items-center gap-3 p-3.5 text-left hover:border-teal-300"><span className="flex-1"><span className="block font-semibold text-sand-900">{x.name}</span><span className="block text-xs text-sand-500">{x.duration} min · ${x.price}{x.group ? ' per person · up to 4 people' : ''}</span></span><Pill tone="ok" dot={false}>Book</Pill></button>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-xs text-sand-500">Looking for a physician-led program? <Link to="/public/become-a-patient" className="text-teal-700 underline">Become a patient</Link>.</p>
      </div>
    </PhoneFrame>
  )

  if (step === 'time') return (
    <PhoneFrame>
      <Header title={t.name} back={() => setStep('list')} />
      <div className="px-5 pb-8">
        <h1 className="font-display text-2xl font-semibold text-sand-900">Pick a time</h1>
        <p className="mt-1 text-sm text-sand-600">{t.duration} minutes · ${t.price}{t.group ? ' per person' : ''} · Irvine</p>
        {t.group && <div className="card mt-4 p-3.5"><div className="flex items-center gap-2 text-sm font-semibold"><Users size={15} /> How many people?</div><div className="mt-2 grid grid-cols-4 gap-2">{[1, 2, 3, 4].map((n) => <Choice key={n} label={String(n)} selected={people === n} onClick={() => setPeople(n)} />)}</div></div>}
        <div className="mt-4 eyebrow">Available times</div>
        <ul className="mt-2 space-y-2">{slots.map((s) => <li key={s}><button onClick={() => setSlot(s)} className={`card flex w-full items-center justify-between p-3.5 text-left ${slot === s ? 'border-teal-500 bg-teal-50' : 'hover:border-teal-300'}`}><span className="font-semibold text-sand-900">{s}</span><Clock size={16} className="text-sand-400" /></button></li>)}</ul>
        <button disabled={!slot} onClick={() => setStep('details')} className="btn-primary btn-lg mt-6 w-full">Continue</button>
      </div>
    </PhoneFrame>
  )

  if (step === 'details') return (
    <PhoneFrame>
      <Header title="Your details" back={() => setStep('time')} />
      <div className="px-5 pb-8 space-y-4">
        <Field label="Have you been to Helixona before?" required><div className="grid grid-cols-2 gap-2">{['Yes', 'No, first time'].map((o) => <Choice key={o} label={o} selected={visited === o} onClick={() => setVisited(o)} />)}</div></Field>
        {visited === 'Yes' && <Notice tone="teal">Enter the mobile number on file and we'll text you a link that fills in your details.</Notice>}
        <Field label="Full name" required><input className="input text-[16px]" /></Field>
        <Field label="Date of birth" required><input type="date" className="input text-[16px]" /></Field>
        <div className="grid grid-cols-2 gap-3"><Field label="Mobile phone" required><input className="input text-[16px]" /></Field><Field label="Email" required><input className="input text-[16px]" /></Field></div>
        <Field label="Address" required hint="Needed for the card billing address."><input className="input text-[16px]" /></Field>
        {t.group && <Field label="Special occasion or anything we should know?"><input className="input text-[16px]" placeholder="Optional" /></Field>}
        <div className="card p-4">
          <div className="mb-2 flex items-center justify-between text-xs text-sand-500"><span className="flex items-center gap-1"><Lock size={12} /> Secure payment by Stripe</span><span>${t.price * (t.group ? people : 1)} today</span></div>
          <div className="space-y-2"><input className="input" placeholder="Card number" /><div className="grid grid-cols-2 gap-2"><input className="input" placeholder="MM / YY" /><input className="input" placeholder="CVC" /></div></div>
          <p className="mt-2 text-xs text-sand-500">Your spot is reserved and paid when you continue. Free cancellation up to 24 hours before; a no-show fee of $25 applies after that.</p>
        </div>
        <button disabled={!visited} onClick={() => setStep('consent')} className="btn-primary btn-lg w-full"><CreditCard size={16} /> Pay and reserve</button>
      </div>
    </PhoneFrame>
  )

  if (step === 'consent') return (
    <PhoneFrame>
      <Header title="Informed consent" back={() => setStep('details')} />
      <div className="px-5 pb-8">
        <h1 className="font-display text-2xl font-semibold text-sand-900">{consent?.title}</h1>
        <p className="mt-1 text-sm text-sand-500">Required for {t.name}. Signed once a year.</p>
        <article className="card mt-4 max-h-72 overflow-y-auto p-4 text-[14px] leading-relaxed text-sand-700">{consent?.paragraphs.map((p, i) => p.h ? <h3 key={i} className="mt-3 font-semibold text-sand-900">{p.t}</h3> : <p key={i} className="mt-2">{p.t}</p>)}</article>
        <label className="mt-4 flex items-start gap-3 rounded-xl border border-sand-300 bg-white p-3.5 text-[15px]"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-5 w-5 accent-teal-600" /><span>I have read and understood this consent.</span></label>
        <input className="input mt-3 font-display text-2xl italic py-3" placeholder="Type your full legal name to sign" value={sig} onChange={(e) => setSig(e.target.value)} />
        <button disabled={!agree || !sig} onClick={() => setStep('done')} className="btn-primary btn-lg mt-4 w-full">Sign and finish</button>
      </div>
    </PhoneFrame>
  )

  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col px-5 pt-16 pb-8 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-ok-100 text-ok-700"><CalendarCheck size={36} /></span>
        <h1 className="mt-5 font-display text-[26px] font-semibold text-sand-900">You're booked</h1>
        <p className="mt-2 text-sand-600">{t.name} · {slot}{t.group ? ` · ${people} ${people > 1 ? 'people' : 'person'}` : ''}. A confirmation with directions and preparation instructions is on its way by email and text.</p>
        <div className="card mt-6 p-4 text-left text-sm space-y-1 text-sand-700">
          <div><strong>When you arrive:</strong> everything is done. Just say your name at the front desk.</div>
          <div><strong>Cancellation:</strong> free up to 24 hours before; $25 no-show fee after that.</div>
          <div className="text-xs text-sand-500 pt-1">Behind the scenes: the booking is mirrored to the clinic calendar (eCW) and verified before it shows as confirmed for staff.</div>
        </div>
        <Link to="/public/book" className="btn-secondary btn-lg mt-6 w-full">Book another treatment</Link>
      </div>
    </PhoneFrame>
  )
}
