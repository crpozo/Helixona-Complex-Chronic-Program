import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Check, ChevronDown, Clock, Lock } from 'lucide-react'
import { CallClinic } from '../../../components/CallClinic'
import { PhoneFrame, PatientTopBar } from '../../../components/PhoneFrame'
import { Notice, Pill } from '../../../components/ui'
import { modalities } from '../../../mock/program'
import { Roadmap } from '../../../components/Roadmap'
import { myPlan, stageLabel } from '../../../mock/roadmap'

/** Demo patient is treated here as an Active member (P-0031) so the booking flow is visible. */
export default function Booking() {
  const [view, setView] = useState<'list' | 'slots' | 'done'>('list')
  const [sel, setSel] = useState(modalities[0])
  const [slot, setSlot] = useState<string>()
  const [reviews, setReviews] = useState<string[]>([])
  const [planReview, setPlanReview] = useState(false)
  const plan: Record<string, 'book' | 'request' | 'not'> = { 'MOD-01': 'book', 'MOD-02': 'book', 'MOD-03': 'book', 'MOD-04': 'not', 'MOD-05': 'request', 'MOD-06': 'book', 'MOD-07': 'not', 'MOD-08': 'not', 'MOD-09': 'not', 'MOD-10': 'book' }
  const [prefOpen, setPrefOpen] = useState(false)
  const [days, setDays] = useState<string[]>([])
  const [wins, setWins] = useState<string[]>([])
  const [found, setFound] = useState(false)
  const [help, setHelp] = useState(false)
  const [helpSent, setHelpSent] = useState(false)
  const earliest: [string, string][] = [['Thu, Oct 9', '2:30 PM'], ['Fri, Oct 10', '8:00 AM'], ['Sat, Oct 11', '9:00 AM'], ['Sat, Oct 11', '4:00 PM']]
  const more: [string, string][] = [['Mon, Oct 13', '10:30 AM'], ['Mon, Oct 13', '4:00 PM'], ['Tue, Oct 14', '8:00 AM'], ['Wed, Oct 15', '1:30 PM'], ['Thu, Oct 16', '11:00 AM'], ['Fri, Oct 17', '3:00 PM']]
  const shown = found ? [...earliest, ...more].filter(([d]) => days.length === 0 || days.includes(d.slice(0, 3))) : earliest

  if (view === 'done') return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col px-5 pt-16 pb-8 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-ok-100 text-ok-700"><Check size={36} /></span>
        <h1 className="mt-5 font-display text-[26px] font-semibold text-sand-900">{plan[sel.id] === 'request' ? 'Request sent' : 'Reserved'}</h1>
        <p className="mt-2 text-sand-600">{sel.name} · {slot}</p>
        <div className="card mt-6 p-4 text-left text-sm">
          <div className="flex items-center justify-between"><span className="font-semibold">Status</span><Pill tone={plan[sel.id] === 'request' ? 'warn' : 'teal'}>{plan[sel.id] === 'request' ? 'Waiting for staff review' : 'Reserved · waiting for confirmation'}</Pill></div>
          <p className="mt-2 text-sand-600">{plan[sel.id] === 'request' ? 'A nurse reviews this request. Please allow 1–2 business days.' : 'Your spot is held. You\'ll get a text when it is confirmed in our clinic calendar, usually within a few minutes.'}</p>
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
        <div className="card mt-4 p-3.5 text-sm text-sand-700"><div className="flex items-center gap-2 font-semibold"><Clock size={15} /> Your plan allows</div><ul className="mt-1 list-disc pl-5 text-sand-600"><li>Up to {sel.maxPerWeek} sessions per week (you've had 1 this week)</li><li>At least {sel.minSpacingDays} day{sel.minSpacingDays > 1 ? 's' : ''} between sessions · last session Oct 7</li><li>Book at least 2 hours ahead</li></ul></div>
        <h2 className="mt-5 font-display text-xl font-semibold text-sand-900">Let's find a time that works for you</h2>
        <p className="mt-1 text-sm text-sand-600">Choose one of the earliest available appointments, or tell us which days and times work best for you.</p>
        <div className="mt-3 grid grid-cols-2 gap-2">{shown.map(([day, time]) => { const key = `${day} · ${time}`; const on = slot === key; return (
          <button key={key} onClick={() => setSlot(key)} role="radio" aria-checked={on} className={`flex items-start gap-2.5 rounded-xl border p-3 text-left ${on ? 'border-sand-900 bg-teal-50' : 'border-sand-300 bg-white'}`}>
            <span className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${on ? 'border-sand-900' : 'border-sand-400'}`}>{on && <span className="h-2 w-2 rounded-full bg-sand-900" />}</span>
            <span><span className="block text-[15px] font-semibold text-sand-900">{day}</span><span className="block text-xs text-sand-500">{time} · Irvine</span></span>
          </button>) })}</div>
        {found && <p className="mt-2 text-sm font-medium text-ok-700">Showing the earliest times that match what you chose.</p>}

        <div className="mt-3 rounded-xl border border-sand-300 bg-white">
          <button onClick={() => setPrefOpen(!prefOpen)} aria-expanded={prefOpen} className="flex w-full items-center justify-between px-4 py-3 text-left text-[15px] font-semibold text-sand-900">Not seeing a time that works?<ChevronDown size={17} className={`transition-transform ${prefOpen ? 'rotate-180' : ''}`} /></button>
          {prefOpen && <div className="border-t border-sand-200 p-4">
            <div className="eyebrow">Preferred weekdays <span className="normal-case tracking-normal text-sand-500">(choose any)</span></div>
            <div className="mt-2 grid grid-cols-3 gap-2">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((x) => <button key={x} aria-pressed={days.includes(x)} onClick={() => setDays(days.includes(x) ? days.filter((y) => y !== x) : [...days, x])} className={`rounded-lg border py-2.5 text-sm font-medium ${days.includes(x) ? 'border-sand-900 bg-sand-900 text-white' : 'border-sand-300 text-sand-700'}`}>{x}</button>)}</div>
            <div className="mt-4 eyebrow">Preferred time windows <span className="normal-case tracking-normal text-sand-500">(choose any)</span></div>
            <div className="mt-2 grid grid-cols-2 gap-2">{['Early morning', 'Morning', 'Afternoon', 'Late afternoon'].map((x) => <button key={x} aria-pressed={wins.includes(x)} onClick={() => setWins(wins.includes(x) ? wins.filter((y) => y !== x) : [...wins, x])} className={`rounded-lg border py-2.5 text-sm font-medium ${wins.includes(x) ? 'border-sand-900 bg-sand-900 text-white' : 'border-sand-300 text-sand-700'}`}>{x}</button>)}</div>
            <label className="mt-4 block eyebrow">Specific date <span className="normal-case tracking-normal text-sand-500">(optional)</span><input type="date" className="input mt-2 normal-case tracking-normal" /></label>
            <button onClick={() => { setFound(true); setSlot(undefined); setPrefOpen(false) }} className="btn-secondary mt-4 w-full">Find times that work for me</button>
          </div>}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm"><button onClick={() => setFound(!found)} className="font-medium text-teal-700 underline">View full calendar</button><button onClick={() => setHelp(true)} className="font-medium text-teal-700 underline">Ask our team to help me schedule</button></div>
        {help && <div className="mt-3 rounded-xl border border-sand-300 bg-sand-50 p-4">
          <div className="text-[15px] font-semibold text-sand-900">We can schedule this with you</div>
          {helpSent ? <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-ok-700"><Check size={15} /> Note sent · please allow 1–2 business days</p> : <>
            <textarea rows={3} className="input mt-2 text-[16px]" placeholder="Tell us which days and times work for you" />
            <button onClick={() => setHelpSent(true)} className="btn-primary mt-2 w-full">Send a note to the clinic</button></>}
          <CallClinic className="mt-2" label="Call the clinic to schedule" />
        </div>}
        <button disabled={!slot} onClick={() => setView('done')} className="btn-primary btn-lg mt-6 w-full">{plan[sel.id] === 'request' ? 'Send request' : 'Reserve this time'}</button>
        <p className="mt-3 rounded-xl border border-dashed border-sand-300 px-3 py-2 text-xs text-sand-500"><strong>Sample availability.</strong> Real times come from the clinic calendar, with rooms, equipment and staff checked together. Sundays are never offered.</p>
      </div>
    </PhoneFrame>
  )

  return (
    <PhoneFrame>
      <PatientTopBar title="Book a session" back={<Link to="/patient/home" className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></Link>} />
      <div className="px-5 pb-8">
        <h1 className="font-display text-2xl font-semibold text-sand-900">Your sessions</h1>
        <p className="mt-1 text-sm text-sand-600">Only services in your Plan of Care can be booked. <Link to="/patient/plan" className="font-medium text-teal-700 underline">See my Plan of Care</Link></p>
        <div className="card mt-3 p-3"><div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold text-sand-900">{stageLabel(myPlan.stage)}</span><span className="text-xs text-sand-500">Your stage</span></div><div className="mt-2"><Roadmap current={myPlan.stage} compact /></div><p className="mt-2 text-xs text-sand-500">Services shown match your stage and your Plan of Care.</p></div>
        <div className="mt-4 eyebrow">Coming up</div>
        <ul className="mt-2 space-y-2">
          <li className="card flex items-center gap-3 p-3.5"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-teal-700"><CalendarDays size={16} /></span><span className="flex-1"><span className="block font-semibold text-sand-900">Nano bath · Thu Oct 9, 9:00 AM</span><span className="block text-xs text-sand-500">Nano bath room 1 · 45 min</span></span><Pill tone="ok">Confirmed</Pill></li>
          <li className="card flex items-center gap-3 p-3.5"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand-100 text-sand-500"><Lock size={15} /></span><span className="flex-1"><span className="block font-semibold text-sand-900">Nurse practitioner visit · Thu Oct 9, 8:00 AM</span><span className="block text-xs text-sand-500">Insurance visit · booked by our office</span></span><Pill dot={false}>From clinic calendar</Pill></li>
        </ul>
        <div className="mt-5 eyebrow">Book a session for your plan of care</div>
        {(() => {
          const rows = modalities.filter((m) => m.active).map((m) => {
            const inStage = m.stages.includes(myPlan.stage)
            const mode: 'book' | 'request' | 'not' | 'stage' = (plan[m.id] ?? 'not') === 'not' ? 'not' : inStage ? plan[m.id] : 'stage'
            return { m, mode, firstStage: Math.min(...m.stages.filter((n) => n > myPlan.stage), 99) }
          })
          const available = rows.filter((r) => r.mode === 'book' || r.mode === 'request')
          const unavailable = rows.filter((r) => r.mode === 'not' || r.mode === 'stage')
          return (
            <>
              <ul className="mt-2 space-y-2">
                {available.map(({ m, mode }) => (
                  <li key={m.id}>
                    <button onClick={() => { setSel(m); setSlot(undefined); setView('slots') }} className="card flex w-full items-center gap-3 p-3.5 text-left hover:border-teal-300">
                      <span className="flex-1 min-w-0"><span className="block font-semibold text-sand-900">{m.name}</span><span className="block text-xs text-sand-500">{m.duration} min · up to {m.maxPerWeek}/week · {m.minSpacingDays}+ days apart</span></span>
                      {mode === 'book' ? <Pill tone="ok" dot={false}>Book now</Pill> : <Pill tone="warn" dot={false}>Request</Pill>}
                    </button>
                  </li>
                ))}
              </ul>
              {unavailable.length > 0 && <>
                <div className="mt-6 eyebrow">Not available to you right now</div>
                <p className="mt-1 text-xs text-sand-500">Want one of these? Ask your care team to review it for your plan.</p>
                <ul className="mt-2 space-y-2">
                  {unavailable.map(({ m, mode, firstStage }) => { const asked = reviews.includes(m.id); return (
                    <li key={m.id} className="card p-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex-1 min-w-0"><span className="block font-semibold text-sand-600">{m.name}</span><span className="block text-xs text-sand-500">{m.duration} min</span></span>
                        <Pill dot={false}>{mode === 'not' ? 'Not in your care plan' : firstStage < 99 ? `From Step ${firstStage}` : 'Earlier steps only'}</Pill>
                      </div>
                      {asked
                        ? <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-ok-700"><Check size={13} /> Review requested · please allow 1–2 business days</p>
                        : <button onClick={() => setReviews([...reviews, m.id])} className="btn-secondary mt-2.5 w-full py-2 text-[11px]">Request a review</button>}
                    </li>) })}
                </ul>
              </>}
            </>
          )
        })()}
        <div className="card mt-6 p-4">
          <div className="font-semibold text-sand-900">Need something different?</div>
          <p className="mt-1 text-sm text-sand-600">Ask for a review of your plan: another therapy, a different rhythm, or a check on how a therapy is going.</p>
          {planReview
            ? <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-ok-700"><Check size={15} /> Request sent · please allow 1–2 business days</p>
            : <><textarea rows={3} className="input mt-3 text-[16px]" placeholder="Write a note to your care team (optional)" /><button onClick={() => setPlanReview(true)} className="btn-secondary mt-2 w-full">Send a note and request a review</button></>}
          <CallClinic className="mt-2" label="Call the clinic to schedule" />
        </div>
        <div className="mt-4"><Notice tone="info">Spacing and weekly limits are part of your Plan of Care. Your provider decides any change at your review.</Notice></div>
      </div>
    </PhoneFrame>
  )
}
