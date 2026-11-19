import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CalendarCheck, Phone } from 'lucide-react'
import { PhoneFrame, Wordmark } from '../../components/PhoneFrame'
import { bookInterview, fmtDate, fmtTime, inquiryById, interviewDays, interviewOf, interviewSlotMinutes, slotsFor, useStore } from '../../mock/store'

/** The page a person opens from the interview link: pick a day and a time, or change the one already chosen. */
export default function ScheduleInterview() {
  useStore()
  const { id = '' } = useParams()
  const inq = inquiryById(id)
  const current = interviewOf(id)
  const [changing, setChanging] = useState(false)
  const days = interviewDays().filter((d) => slotsFor(d, id).length > 0)
  const [day, setDay] = useState<string>()
  const [time, setTime] = useState<string>()
  const first = inq?.name.split(' ')[0]
  const picking = !current || changing
  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col">
        <div className="bg-teal-800 px-6 pt-12 pb-8 text-white">
          <Wordmark light size="md" />
          <h1 className="mt-5 font-display text-[28px] font-semibold leading-[1.1]">{picking ? 'Choose a time for your call' : 'Your call is scheduled'}</h1>
          <p className="mt-2 text-[15px] text-teal-100">{first ? `Hi ${first}. ` : ''}A {interviewSlotMinutes()}-minute phone call with a Helixona patient advisor.</p>
        </div>
        <div className="-mt-4 flex-1 rounded-t-3xl bg-white px-5 pb-8 pt-6">
          {!picking && current && <>
            <div className="flex items-center gap-3 rounded-2xl bg-ok-100 p-4 text-ok-700"><CalendarCheck size={22} /><div><div className="text-[17px] font-semibold">{fmtDate(current.date)}</div><div className="text-[15px]">{fmtTime(current.time)} · Pacific time</div></div></div>
            <p className="mt-4 text-[15px] text-sand-700">We will call the phone number you gave us. A calendar invitation is on its way to your email.</p>
            <button onClick={() => { setChanging(true); setDay(undefined); setTime(undefined) }} className="btn-secondary btn-lg mt-5 w-full">Choose a different time</button>
            <a href="tel:9492572644" className="btn-ghost mt-2 w-full"><Phone size={16} /> Call the office · (949) 257-2644</a>
          </>}
          {picking && <>
            <div className="text-[16px] font-semibold text-sand-900">Pick a day</div>
            <div className="-mx-5 mt-2 flex gap-2 overflow-x-auto px-5 pb-1">{days.map((d) => { const [wd, md] = fmtDate(d).split(', '); return <button key={d} onClick={() => { setDay(d); setTime(undefined) }} aria-pressed={day === d} className={`shrink-0 rounded-2xl border px-4 py-3 text-center ${day === d ? 'border-sand-900 bg-sand-900 text-white' : 'border-sand-300 bg-white text-sand-800'}`}><span className="block text-xs">{wd}</span><span className="block text-[15px] font-semibold">{md}</span></button> })}</div>
            {day && <><div className="mt-5 text-[16px] font-semibold text-sand-900">Pick a time <span className="text-sm font-normal text-sand-500">· Pacific time</span></div>
              <div className="mt-2 grid grid-cols-3 gap-2">{slotsFor(day, id).map((t) => <button key={t} onClick={() => setTime(t)} aria-pressed={time === t} className={`rounded-xl border py-3 text-[15px] font-medium ${time === t ? 'border-sand-900 bg-teal-50 shadow-[0_0_0_1px_#141414]' : 'border-sand-300 bg-white'}`}>{fmtTime(t)}</button>)}</div></>}
            <button disabled={!day || !time} onClick={() => { bookInterview(id, day!, time!); setChanging(false) }} className="btn-primary btn-lg mt-6 w-full">{current ? 'Change my call' : 'Schedule my call'}</button>
            {current && <button onClick={() => setChanging(false)} className="btn-ghost mt-2 w-full">Keep {fmtDate(current.date)} · {fmtTime(current.time)}</button>}
            <p className="mt-4 text-center text-xs text-sand-500">None of these work? Call the office at (949) 257-2644.</p>
          </>}
        </div>
      </div>
    </PhoneFrame>
  )
}
