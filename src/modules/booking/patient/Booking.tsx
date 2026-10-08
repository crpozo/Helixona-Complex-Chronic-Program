import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Check, Clock, Lock } from 'lucide-react'
import { PhoneFrame, PatientTopBar } from '../../../components/PhoneFrame'
import { Notice, Pill } from '../../../components/ui'
import { modalities } from '../../../mock/program'

/** Demo patient is treated here as an Active member (P-0031) so the booking flow is visible. */
export default function Booking() {
  const [view, setView] = useState<'list' | 'slots' | 'done'>('list')
  const [sel, setSel] = useState(modalities[0])
  const [slot, setSlot] = useState<string>()
  const plan: Record<string, 'book' | 'request' | 'not'> = { 'MOD-01': 'book', 'MOD-02': 'book', 'MOD-03': 'book', 'MOD-04': 'not', 'MOD-05': 'request', 'MOD-06': 'book', 'MOD-07': 'not', 'MOD-08': 'not', 'MOD-09': 'not' }
  const slots = ['Thu Oct 9 · 11:00 AM', 'Thu Oct 9 · 2:30 PM', 'Sat Oct 11 · 9:00 AM', 'Mon Oct 13 · 10:30 AM', 'Mon Oct 13 · 4:00 PM']

  if (view === 'done') return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col px-5 pt-16 pb-8 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-ok-100 text-ok-700"><Check size={36} /></span>
        <h1 className="mt-5 font-display text-[26px] font-semibold text-sand-900">{plan[sel.id] === 'request' ? 'Request sent' : 'Reserved'}</h1>
        <p className="mt-2 text-sand-600">{sel.name} · {slot}</p>
        <div className="card mt-6 p-4 text-left text-sm">
          <div className="flex items-center justify-between"><span className="font-semibold">Status</span><Pill tone={plan[sel.id] === 'request' ? 'warn' : 'teal'}>{plan[sel.id] === 'request' ? 'Waiting for staff review' : 'Reserved · waiting for confirmation'}</Pill></div>
          <p className="mt-2 text-sand-600">{plan[sel.id] === 'request' ? 'A nurse reviews laser requests within 1 business day.' : 'Your spot is held. You\'ll get a text when it is confirmed in our clinic calendar, usually within a few minutes.'}</p>
          <div className="mt-3 border-t border-sand-100 pt-3"><div className="eyebrow mb-1">Before your session</div>{sel.prep}</div>
          <div className="mt-3 text-xs text-sand-500">Cancel up to {sel.cancelWindowHours} hours before without charge.</div>
        </div>
        <Link to="/patient/home" className="btn-primary btn-lg mt-8 w-full">Back to my program</Link>
      </div>
    </PhoneFrame>
  )

  if (view === 'slots') return (
    <PhoneFrame>
      <PatientTopBar title={sel.name} back={<button onClick={() => setView('list')} className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></button>} />
      <div className="px-5 pb-8">
        <h1 className="font-display text-2xl font-semibold text-sand-900">{plan[sel.id] === 'request' ? 'Request a time' : 'Pick a time'}</h1>
        <p className="mt-1 text-sm text-sand-600">{sel.duration} minutes · {sel.location}</p>
        <div className="card mt-4 p-3.5 text-sm text-sand-700"><div className="flex items-center gap-2 font-semibold"><Clock size={15} /> Your plan allows</div><ul className="mt-1 list-disc pl-5 text-sand-600"><li>Up to {sel.maxPerWeek} sessions per week (you've had 1 this week)</li><li>At least {sel.minSpacingDays} day{sel.minSpacingDays > 1 ? 's' : ''} between sessions · last session Oct 7</li><li>Book at least {sel.leadTimeHours} hours ahead</li></ul></div>
        <div className="mt-5 eyebrow">Available times</div>
        <ul className="mt-2 space-y-2">{slots.map((s, i) => <li key={s}><button disabled={i === 0} onClick={() => setSlot(s)} className={`card flex w-full items-center justify-between p-3.5 text-left ${slot === s ? 'border-teal-500 bg-teal-50' : ''} ${i === 0 ? 'opacity-50' : 'hover:border-teal-300'}`}><span className="font-semibold text-sand-900">{s}</span>{i === 0 ? <span className="text-xs text-sand-500">Too soon after Oct 7</span> : <CalendarDays size={16} className="text-sand-400" />}</button></li>)}</ul>
        <button disabled={!slot} onClick={() => setView('done')} className="btn-primary btn-lg mt-6 w-full">{plan[sel.id] === 'request' ? 'Send request' : 'Reserve this time'}</button>
      </div>
    </PhoneFrame>
  )

  return (
    <PhoneFrame>
      <PatientTopBar title="Book a session" back={<Link to="/patient/home" className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></Link>} />
      <div className="px-5 pb-8">
        <h1 className="font-display text-2xl font-semibold text-sand-900">Your sessions</h1>
        <p className="mt-1 text-sm text-sand-600">Only services in your Plan of Care can be booked. Dr. D. updates your plan at each review.</p>
        <div className="mt-4 eyebrow">Coming up</div>
        <ul className="mt-2 space-y-2">
          <li className="card flex items-center gap-3 p-3.5"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-teal-700"><CalendarDays size={16} /></span><span className="flex-1"><span className="block font-semibold text-sand-900">Nano bath · Thu Oct 9, 9:00 AM</span><span className="block text-xs text-sand-500">Nano bath room 1 · 45 min</span></span><Pill tone="ok">Confirmed</Pill></li>
          <li className="card flex items-center gap-3 p-3.5"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand-100 text-sand-500"><Lock size={15} /></span><span className="flex-1"><span className="block font-semibold text-sand-900">Nurse practitioner visit · Thu Oct 9, 8:00 AM</span><span className="block text-xs text-sand-500">Insurance visit · booked by our office</span></span><Pill dot={false}>From clinic calendar</Pill></li>
        </ul>
        <div className="mt-5 eyebrow">Book a session</div>
        <ul className="mt-2 space-y-2">
          {modalities.filter((m) => m.active).map((m) => {
            const mode = plan[m.id]
            return (
              <li key={m.id}>
                <button disabled={mode === 'not'} onClick={() => { setSel(m); setSlot(undefined); setView('slots') }} className={`card flex w-full items-center gap-3 p-3.5 text-left ${mode === 'not' ? 'opacity-60' : 'hover:border-teal-300'}`}>
                  <span className="flex-1 min-w-0"><span className="block font-semibold text-sand-900">{m.name}</span><span className="block text-xs text-sand-500">{m.duration} min · up to {m.maxPerWeek}/week · {m.minSpacingDays}+ days apart</span></span>
                  {mode === 'book' && <Pill tone="ok" dot={false}>Book now</Pill>}{mode === 'request' && <Pill tone="warn" dot={false}>Request</Pill>}{mode === 'not' && <Pill dot={false}>Not in your care plan</Pill>}
                </button>
              </li>
            )
          })}
        </ul>
        <div className="mt-5"><Notice tone="info">Spacing and weekly limits are part of your Plan of Care. If you need something different, ask your nurse.</Notice></div>
      </div>
    </PhoneFrame>
  )
}
