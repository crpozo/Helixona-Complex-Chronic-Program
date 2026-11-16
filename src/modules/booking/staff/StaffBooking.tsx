import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { Breadcrumb, Card, Field, Notice, PageHeader, Row } from '../../../components/ui'
import { Avatar } from '../../../components/Avatar'
import { modalities, members } from '../../../mock/program'
import { patients } from '../../../mock/patients'
import { sessionOptions } from '../../../mock/billing'
import { nameOf } from '../../../mock/names'
import { planFor } from '../../../mock/roadmap'
import { currentUser, logEvent, notify } from '../../../mock/store'

/** A booking made by staff for a patient: who, which treatment, how long (which sets the price), when and where.
 *  The slot is checked against the eCW calendar before it can be booked. */
const people = [...new Set([...patients.map((p) => p.id), ...members.map((m) => m.id)])]
const clock = (m: number) => `${((Math.floor(m / 60) + 11) % 12) + 1}:${String(m % 60).padStart(2, '0')} ${m >= 720 ? 'PM' : 'AM'}`

export default function StaffBooking() {
  const nav = useNavigate()
  const [who, setWho] = useState('')
  const [q, setQ] = useState('')
  const [modId, setModId] = useState('MOD-02')
  const mod = modalities.find((m) => m.id === modId)!
  const opts = sessionOptions[modId] ?? [{ min: mod.duration, price: 0 }]
  const [len, setLen] = useState(opts[0].min)
  const opt = opts.find((o) => o.min === len) ?? opts[0]
  const [date, setDate] = useState('2026-10-09')
  const [time, setTime] = useState(9 * 60 + 30)
  const [room, setRoom] = useState(mod.resources[0])
  const [pay, setPay] = useState('Included in the plan')
  const [note, setNote] = useState('')
  const times = Array.from({ length: (17 * 60 - 8 * 60) / 15 }, (_, i) => 8 * 60 + i * 15).filter((m) => m + opt.min <= 17 * 60)
  const pickMod = (id: string) => { const m = modalities.find((x) => x.id === id)!; setModId(id); setRoom(m.resources[0]); setLen((sessionOptions[id] ?? [{ min: m.duration }])[0].min) }
  const conflict = date === '2026-10-09' && room === 'Nano bath room 1' && time < 9 * 60 + 45 && time + opt.min > 9 * 60
  const stageOk = !who || mod.stages.includes(planFor(who).stage)
  const ready = !!who && !conflict
  const book = () => { logEvent(who, `Session booked by staff · ${mod.name} · ${opt.min} min`, `${date} ${clock(time)} · ${room}`); notify(`Booked for ${nameOf(who)} · reserved here, copying to eCW`); nav('/staff/calendar') }
  const row = (ok: boolean, text: string) => <li className="flex items-start gap-2 text-sm"><span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${ok ? 'bg-ok-100 text-ok-700' : 'bg-bad-100 text-bad-700'}`}>{ok ? <Check size={12} /> : <X size={12} />}</span><span className={ok ? 'text-sand-800' : 'font-medium text-bad-700'}>{text}</span></li>

  return (
    <>
      <Breadcrumb items={[{ label: 'Calendar', to: '/staff/calendar' }, { label: 'Staff booking' }]} />
      <PageHeader eyebrow="Care · Calendar" title="Book a session for a patient" description="Choose the patient, the treatment and how long. The price follows the length. The time is checked against the eCW calendar before it is reserved." />
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card title="Patient">
            {who ? <div className="flex items-center gap-3"><Avatar name={nameOf(who)} size={40} /><div className="flex-1"><div className="font-semibold text-sand-900">{nameOf(who)}</div><div className="text-xs text-sand-500">Step {planFor(who).stage} of 7 · {planFor(who).pathway}</div></div><button onClick={() => setWho('')} className="btn-ghost px-2 py-1 text-sm">Change</button></div>
              : <><input autoFocus className="input" placeholder="Search by name…" value={q} onChange={(e) => setQ(e.target.value)} /><ul className="mt-2 max-h-56 divide-y divide-sand-100 overflow-auto">{people.filter((id) => nameOf(id).toLowerCase().includes(q.toLowerCase())).map((id) => <li key={id}><button onClick={() => setWho(id)} className="flex w-full items-center gap-2.5 px-1 py-2 text-left hover:bg-sand-100"><Avatar name={nameOf(id)} size={28} /><span className="font-medium text-sand-900">{nameOf(id)}</span></button></li>)}</ul></>}
          </Card>
          <Card title="Treatment and length" subtitle="Each length has its own price, set in Admin setup · Modalities.">
            <Field label="Treatment" required><select className="input" value={modId} onChange={(e) => pickMod(e.target.value)}>{modalities.filter((m) => m.active).map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></Field>
            <div className="mt-4"><div className="label">Session length <span className="text-bad-600">*</span></div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{opts.map((o) => <button key={o.min} type="button" onClick={() => setLen(o.min)} aria-pressed={len === o.min} className={`rounded-xl border p-3 text-left ${len === o.min ? 'border-teal-500 bg-teal-50' : 'border-sand-300 bg-white hover:border-sand-400'}`}><div className="text-lg font-semibold text-sand-900">{o.min} min</div><div className="text-sm text-sand-600">${o.price}</div></button>)}</div>
            </div>
          </Card>
          <Card title="When and where">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Date" required><input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
              <Field label="Start time" required hint="In 15-minute steps."><select className="input" value={time} onChange={(e) => setTime(Number(e.target.value))}>{times.map((m) => <option key={m} value={m}>{clock(m)}</option>)}</select></Field>
              <Field label="Room or device" required><select className="input" value={room} onChange={(e) => setRoom(e.target.value)}>{mod.resources.map((r) => <option key={r}>{r}</option>)}</select></Field>
              <Field label="Payment"><select className="input" value={pay} onChange={(e) => setPay(e.target.value)}><option>Included in the plan</option><option>Charge the card on file</option><option>Pay at the front desk</option></select></Field>
              <div className="sm:col-span-2"><Field label="Note"><input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything the team should know" /></Field></div>
            </div>
          </Card>
        </div>
        <div className="space-y-5">
          <Card title="Summary">
            <Row label="Patient">{who ? nameOf(who) : '—'}</Row>
            <Row label="Treatment">{mod.name}</Row>
            <Row label="Length">{opt.min} minutes</Row>
            <Row label="Price">{pay === 'Included in the plan' ? `Included · list $${opt.price}` : `$${opt.price}`}</Row>
            <Row label="When">{new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {clock(time)}–{clock(time + opt.min)}</Row>
            <Row label="Where">{room}</Row>
            <div className="mt-4 eyebrow">Checks</div>
            <ul className="mt-2 space-y-1.5">
              {row(!conflict, conflict ? 'eCW calendar: this room is taken 9:00–9:45 AM' : 'eCW calendar: room is free')}
              {row(stageOk, stageOk ? 'Allowed at this patient’s roadmap step' : `Not usually booked at Step ${who ? planFor(who).stage : ''} · needs physician approval`)}
              {row(true, `Spacing rule: at least ${mod.minSpacingDays} days apart`)}
              {row(true, `Weekly limit: up to ${mod.maxPerWeek} a week`)}
            </ul>
            {conflict && <div className="mt-3"><Notice tone="bad" title="Choose another time or room">The slot is already used in eCW. Nothing is reserved until the time is free.</Notice></div>}
            <button disabled={!ready} onClick={book} className="btn-primary btn-lg mt-4 w-full">Book session</button>
            <p className="help mt-2">Booked as {currentUser().name}. The patient is told by text and email; the AI Agent copies the booking to eCW and confirms it.</p>
          </Card>
        </div>
      </div>
    </>
  )
}
