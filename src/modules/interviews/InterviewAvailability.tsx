import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { Card, PageHeader, Pill, ToConfirm } from '../../components/ui'
import { addWindow, allInterviews, currentUser, fmtDate, fmtTime, googleBusy, inquiryById, interviewDays, interviewSlotMinutes, interviewWindows, isGoogleConnected, notify, removeWindow, setGoogleConnected, setSlotMinutes, slotsFor, useStore, weekdays } from '../../mock/store'

/** The advisor's interview hours. She sets weekly windows; times already busy in her Google Calendar are
 *  left out; the person picks from what remains through a link. */
const times = Array.from({ length: 21 }, (_, k) => `${String(8 + Math.floor(k / 2)).padStart(2, '0')}:${k % 2 ? '30' : '00'}`)

export default function InterviewAvailability() {
  useStore()
  const me = currentUser()
  const [draft, setDraft] = useState({ day: 1, from: '09:00', to: '12:00' })
  const connected = isGoogleConnected()
  const windows = interviewWindows()
  const days = interviewDays()
  const booked = allInterviews()
  return (
    <>
      <PageHeader eyebrow="People · Patient advisor" title="Interview calendar" description="Set the hours you are available for interviews. People you send the link to choose a time from these hours; anything already on your Teams calendar is left out." />
      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-1">
          <Card title="Microsoft Teams calendar">
            <div className="flex items-center justify-between gap-3">
              <div><div className="text-sm font-semibold text-sand-900">{connected ? `${me.name.toLowerCase()}@helixona.example · Microsoft 365` : 'Not connected'}</div><div className="text-xs text-sand-500">{connected ? 'Connected · last checked a minute ago' : 'Your busy times are not being checked'}</div></div>
              <Pill tone={connected ? 'ok' : 'warn'}>{connected ? 'Connected' : 'Off'}</Pill>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-sand-700"><li>Busy times on your calendar are never offered.</li><li>Each booked interview is added to your calendar, with a Teams invitation to the person.</li><li>Only busy or free is read. Event names stay private.</li></ul>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="btn-secondary" onClick={() => { setGoogleConnected(!connected); notify(connected ? 'Teams calendar disconnected' : 'Teams calendar connected') }}>{connected ? 'Disconnect' : 'Connect Teams calendar'}</button>
              {connected && <button className="btn-ghost" onClick={() => notify('Calendar checked just now')}><RefreshCw size={14} /> Check now</button>}
            </div>
            <div className="mt-3"><ToConfirm>one calendar per advisor or a shared clinic calendar</ToConfirm></div>
          </Card>
          <Card title="Weekly interview hours" subtitle="Repeat every week until you change them.">
            <ul className="divide-y divide-sand-100">{[...windows].sort((a, b) => a.day - b.day || a.from.localeCompare(b.from)).map((w) => <li key={w.id} className="flex items-center justify-between gap-3 py-2 text-sm"><span><strong className="inline-block w-10 text-sand-900">{weekdays[w.day]}</strong>{fmtTime(w.from)} to {fmtTime(w.to)}</span><button aria-label="Remove" className="btn-ghost px-2 py-1 text-sand-500" onClick={() => removeWindow(w.id)}><Trash2 size={15} /></button></li>)}{windows.length === 0 && <li className="py-3 text-sm text-sand-500">No hours yet. Add your first window below.</li>}</ul>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <select aria-label="Day" className="input min-w-0 px-2.5" value={draft.day} onChange={(e) => setDraft({ ...draft, day: Number(e.target.value) })}>{[1, 2, 3, 4, 5].map((d) => <option key={d} value={d}>{weekdays[d]}</option>)}</select>
              <select aria-label="From" className="input min-w-0 px-2.5" value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })}>{times.map((t) => <option key={t} value={t}>{fmtTime(t)}</option>)}</select>
              <select aria-label="To" className="input min-w-0 px-2.5" value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })}>{times.map((t) => <option key={t} value={t}>{fmtTime(t)}</option>)}</select>
            </div>
            <button disabled={draft.to <= draft.from} className="btn-primary mt-2 w-full" onClick={() => { addWindow(draft); notify(`Added ${weekdays[draft.day]} ${fmtTime(draft.from)} to ${fmtTime(draft.to)}`) }}><Plus size={15} /> Add window</button>
            <label className="mt-4 block text-sm font-medium text-sand-800">Interview length<select className="input mt-1" value={interviewSlotMinutes()} onChange={(e) => setSlotMinutes(Number(e.target.value))}>{[15, 30, 45, 60].map((n) => <option key={n} value={n}>{n} minutes</option>)}</select></label>
          </Card>
        </div>
        <div className="space-y-5 xl:col-span-2">
          <Card title="Scheduled interviews">
            {booked.length === 0 ? <p className="help">None yet.</p> : <ul className="divide-y divide-sand-100">{booked.map((b) => { const inq = inquiryById(b.inquiryId); return <li key={b.inquiryId} className="flex flex-wrap items-center justify-between gap-3 py-2.5 text-sm"><span className="flex items-center gap-3"><CalendarCheck size={16} className="text-ok-700" /><span><Link to={`/staff/inquiries/${b.inquiryId}`} className="font-semibold text-sand-900 hover:underline">{inq?.name ?? b.inquiryId}</Link><span className="block text-xs text-sand-500">Chosen by the {b.bookedBy} · {b.when}</span></span></span><span className="whitespace-nowrap font-medium text-sand-800">{fmtDate(b.date)} · {fmtTime(b.time)}</span></li> })}</ul>}
          </Card>
          <Card title="What people can choose" subtitle="The next two weeks, as the person sees them.">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{days.map((d) => { const open = slotsFor(d); const busy = connected ? googleBusy.filter((b) => b.date === d) : []; const taken = booked.filter((b) => b.date === d); return (
              <div key={d} className="rounded-xl border border-sand-200 p-3">
                <div className="text-sm font-semibold text-sand-900">{fmtDate(d)}</div>
                <div className="mt-2 flex flex-wrap gap-1">{open.map((t) => <span key={t} className="rounded-md bg-ok-100 px-1.5 py-0.5 text-[11px] font-medium text-ok-700">{fmtTime(t).replace(':00', '').replace(' ', '')}</span>)}{open.length === 0 && <span className="text-xs text-sand-400">No open times</span>}</div>
                {taken.map((b) => <div key={b.inquiryId} className="mt-2 rounded-md bg-sand-900 px-2 py-1 text-[11px] text-white">{fmtTime(b.time)} · interview</div>)}
                {busy.map((b) => <div key={b.from} className="mt-2 rounded-md bg-sand-100 px-2 py-1 text-[11px] text-sand-600">{fmtTime(b.from)} to {fmtTime(b.to)} · busy in Teams</div>)}
              </div>) })}</div>
          </Card>
        </div>
      </div>
    </>
  )
}
