import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Plus, Trash2, UserRound } from 'lucide-react'
import { PhoneFrame, PatientTopBar } from '../../../components/PhoneFrame'
import { Choice, ToConfirm } from '../../../components/ui'

/** Share with someone who helps me: the patient names a person, chooses exactly what that person may see and
 *  whether the clinic may talk with them, and signs the permission. Nothing is shared until it is signed, and it
 *  can be withdrawn at any time. The legal wording is a draft for the clinic's attorney. */
const areas: [string, string][] = [
  ['Appointments and bookings', 'Dates, times and what is booked'],
  ['Plan of Care', 'The current plan and what changed'],
  ['Medications and supplements', 'The list and what I report taking'],
  ['Daily check-ins and flare or crash reports', 'My answers and my trend'],
  ['Messages with the clinic', 'What I write and what the clinic answers'],
  ['Billing and payments', 'Charges, receipts and payment problems'],
]
interface Person { name: string; relation: string; email: string; phone: string; share: string[]; talk: boolean; signed: string }
const fmtPhone = (v: string) => { const d = v.replace(/\D/g, '').slice(0, 10); return d.length > 6 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : d.length > 3 ? `(${d.slice(0, 3)}) ${d.slice(3)}` : d }

export default function Sharing() {
  const [people, setPeople] = useState<Person[]>([{ name: 'Daniel Andrade', relation: 'Spouse or partner', email: 'daniel@example.com', phone: '(949) 555-0148', share: ['Appointments and bookings', 'Plan of Care'], talk: true, signed: 'Sep 2, 2026' }])
  const [adding, setAdding] = useState(false)
  const [d, setD] = useState({ name: '', relation: 'Family member', email: '', phone: '', share: [] as string[], talk: false, agree: false, sign: '' })
  const ready = d.name.trim() && (d.email.trim() || d.phone.trim()) && d.share.length > 0 && d.agree && d.sign.trim()

  if (adding) return (
    <PhoneFrame>
      <PatientTopBar title="Add a person" back={<button onClick={() => setAdding(false)} className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></button>} />
      <div className="px-5 pb-8">
        <h1 className="font-display text-2xl font-semibold text-sand-900">Who helps you?</h1>
        <p className="mt-1 text-[15px] text-sand-600">A caregiver, family member or friend. You decide what they can see.</p>
        <label className="mt-4 block text-sm font-medium text-sand-800">Full legal name <span className="text-bad-600">*</span><input className="input mt-1 text-[16px]" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} /></label>
        <label className="mt-3 block text-sm font-medium text-sand-800">Relationship to you<select className="input mt-1 text-[16px]" value={d.relation} onChange={(e) => setD({ ...d, relation: e.target.value })}>{['Spouse or partner', 'Parent', 'Adult child', 'Family member', 'Friend', 'Paid caregiver', 'Other'].map((r) => <option key={r}>{r}</option>)}</select></label>
        <label className="mt-3 block text-sm font-medium text-sand-800">Email<input type="email" className="input mt-1 text-[16px]" value={d.email} onChange={(e) => setD({ ...d, email: e.target.value })} /></label>
        <label className="mt-3 block text-sm font-medium text-sand-800">Phone number<input inputMode="numeric" className="input mt-1 text-[16px]" value={d.phone} onChange={(e) => setD({ ...d, phone: fmtPhone(e.target.value) })} /><span className="mt-1 block text-xs font-normal text-sand-500">An email or a phone number is needed so we can confirm who they are.</span></label>

        <div className="mt-5 text-[16px] font-semibold text-sand-900">What may they see? <span className="text-bad-600">*</span></div>
        <p className="text-sm text-sand-500">Only what you tick. Everything else stays private.</p>
        <div className="mt-2 space-y-2">{areas.map(([a, hint]) => <Choice key={a} multiple label={`${a} · ${hint}`} selected={d.share.includes(a)} onClick={() => setD({ ...d, share: d.share.includes(a) ? d.share.filter((x) => x !== a) : [...d.share, a] })} />)}</div>

        <div className="mt-5 text-[16px] font-semibold text-sand-900">May we talk with them?</div>
        <div className="mt-2"><Choice multiple label="Yes, Helixona may discuss the items I ticked with this person by phone, email or in person" selected={d.talk} onClick={() => setD({ ...d, talk: !d.talk })} /></div>

        <div className="mt-5 rounded-2xl border border-sand-300 bg-sand-50 p-4 text-sm leading-relaxed text-sand-800">
          <div className="font-semibold text-sand-900">Authorization to share my health information</div>
          <p className="mt-2">I authorize Helixona to disclose the categories of my health information selected above to {d.name.trim() || 'the person named above'}{d.talk ? ', and to discuss them with that person' : ''}. This authorization is voluntary; my care, payment and enrollment do not depend on it.</p>
          <p className="mt-2">It stays in effect for one year from the date I sign, unless I end it sooner. I may revoke it at any time from this screen or in writing to Helixona; revoking does not affect information already shared. Information disclosed under this authorization may be shared again by the person who receives it and may no longer be protected by federal privacy law.</p>
          <p className="mt-2">I am entitled to a copy of this authorization.</p>
          <div className="mt-3"><ToConfirm>final authorization wording, expiration and sensitive categories (attorney)</ToConfirm></div>
        </div>
        <div className="mt-3"><Choice multiple label="I have read and I agree to this authorization" selected={d.agree} onClick={() => setD({ ...d, agree: !d.agree })} /></div>
        <label className="mt-3 block text-sm font-medium text-sand-800">Type your full name to sign <span className="text-bad-600">*</span><input className="input mt-1 font-display text-xl" value={d.sign} onChange={(e) => setD({ ...d, sign: e.target.value })} /></label>
        <p className="mt-1 text-xs text-sand-500">Signed today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}. A copy goes to your email.</p>
        <button disabled={!ready} onClick={() => { setPeople([...people, { name: d.name.trim(), relation: d.relation, email: d.email, phone: d.phone, share: d.share, talk: d.talk, signed: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }]); setD({ name: '', relation: 'Family member', email: '', phone: '', share: [], talk: false, agree: false, sign: '' }); setAdding(false) }} className="btn-primary btn-lg mt-5 w-full">Sign and share</button>
      </div>
    </PhoneFrame>
  )

  return (
    <PhoneFrame>
      <PatientTopBar title="Sharing" back={<Link to="/patient/settings" className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></Link>} />
      <div className="px-5 pb-8">
        <h1 className="font-display text-2xl font-semibold text-sand-900">Share with someone who helps me</h1>
        <p className="mt-1 text-[15px] text-sand-600">Choose who can see parts of your record, and exactly which parts. You can stop sharing at any time.</p>
        <ul className="mt-4 space-y-3">{people.map((p) => (
          <li key={p.name} className="card p-4">
            <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700"><UserRound size={18} /></span>
              <div className="flex-1"><div className="text-[16px] font-semibold text-sand-900">{p.name}</div><div className="text-xs text-sand-500">{p.relation} · {[p.email, p.phone].filter(Boolean).join(' · ')}</div></div></div>
            <ul className="mt-3 space-y-1">{p.share.map((a) => <li key={a} className="flex items-center gap-2 text-sm text-sand-800"><Check size={14} className="text-ok-700" />{a}</li>)}</ul>
            <p className="mt-2 text-xs text-sand-500">{p.talk ? 'The clinic may talk with this person about these items.' : 'The clinic may not discuss your care with this person.'} Signed {p.signed}.</p>
            <button onClick={() => setPeople(people.filter((x) => x !== p))} className="btn-danger mt-3 w-full py-2 text-xs"><Trash2 size={14} /> Stop sharing</button>
          </li>))}
          {people.length === 0 && <li className="rounded-2xl border border-dashed border-sand-300 p-5 text-center text-sm text-sand-500">You are not sharing with anyone.</li>}
        </ul>
        <button onClick={() => setAdding(true)} className="btn-primary btn-lg mt-4 w-full"><Plus size={18} /> Add a person</button>
        <p className="mt-3 text-xs leading-relaxed text-sand-500">The person gets their own secure sign-in. They never see anything you did not tick, and they cannot change your answers unless you allow it.</p>
      </div>
    </PhoneFrame>
  )
}
