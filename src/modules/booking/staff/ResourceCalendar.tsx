import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { MasterDetail, Card, Field, Notice, PageHeader, Pill, QueueTable, Row, Stat, Tabs, ToConfirm, type Column, type Tone } from '../../../components/ui'
import { bookings as sample, type Booking } from '../../../mock/program'
import { nameOf } from '../../../mock/names'
import { notify } from '../../../mock/store'

/* Treatments across the top (one column per room or device), time down the left.
   The calendar is built from what the AI Agent reads in eCW plus the bookings made in this app. */
const columns: { treatment: string; resource: string; readOnly?: boolean }[] = [
  { treatment: 'NP visit', resource: 'NP · Exam 2', readOnly: true }, { treatment: 'IV therapy', resource: 'IV suite', readOnly: true },
  { treatment: 'Hydrogen nano bath', resource: 'Nano bath room 1' }, { treatment: 'Oxygen nano bath', resource: 'Nano bath room 2' },
  { treatment: 'Red light therapy', resource: 'Red light bed 1' }, { treatment: 'Salt room', resource: 'Salt room (4 seats)' },
  { treatment: 'BEMER', resource: 'BEMER mat 1' }, { treatment: 'Erchonia laser', resource: 'Erchonia unit' },
]
const DAY_START = 8 * 60, DAY_END = 17 * 60
const statusTone: Record<Booking['status'], Tone> = { Reserved: 'teal', Confirmed: 'ok', Requested: 'warn', Exception: 'bad', Completed: 'neutral', Cancelled: 'neutral' }
const ecwTone = (e: Booking['ecw']): Tone => e === 'Synced' ? 'ok' : e === 'Waiting for confirmation' ? 'teal' : e === 'Conflict' || e === 'Mirror failed' ? 'bad' : 'neutral'
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
const clock = (m: number) => `${((Math.floor(m / 60) + 11) % 12) + 1}:${String(m % 60).padStart(2, '0')} ${m >= 720 ? 'PM' : 'AM'}`
const TODAY = new Date(2026, 9, 9)
const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString()
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }
/** Sample bookings for any day: the real sample on Oct 9, a shifted subset on other weekdays, none on Sundays. */
function bookingsOn(d: Date): Booking[] {
  if (sameDay(d, TODAY)) return sample
  if (d.getDay() === 0) return []
  const k = (d.getDate() * 7 + d.getMonth() * 3) % 5
  const fmt = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`
  return sample.filter((_, i) => (i + k) % 3 !== 0).map((b) => { const shift = ((k % 3) - 1) * 30; return { ...b, id: `${b.id}-${d.getDate()}`, status: b.status === 'Exception' ? 'Confirmed' : b.status, ecw: b.ecw === 'Conflict' || b.ecw === 'Mirror failed' ? 'Synced' : b.ecw, start: fmt(toMin(b.start) + shift), end: fmt(toMin(b.end) + shift) } as Booking })
}
const chip = (t: Tone) => t === 'bad' ? 'border-bad-600/40 bg-bad-100' : t === 'ok' ? 'border-ok-600/30 bg-ok-100' : t === 'warn' ? 'border-warn-600/30 bg-warn-100' : 'border-teal-300 bg-teal-50'

export default function ResourceCalendar() {
  const nav = useNavigate()
  const [tab, setTab] = useState('calendar')
  const [view, setView] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Day')
  const [date, setDate] = useState(TODAY)
  const [step, setStep] = useState(30)
  const [sel, setSel] = useState<Booking | null>(null)
  const [readAt, setReadAt] = useState('6:02 AM')
  const day = useMemo(() => bookingsOn(date), [date])
  const exceptions = sample.filter((b) => b.status === 'Exception' || b.status === 'Requested')
  const show = notify
  const move = (n: number) => setDate(view === 'Day' ? addDays(date, n) : view === 'Week' ? addDays(date, 7 * n) : view === 'Month' ? new Date(date.getFullYear(), date.getMonth() + n, 1) : new Date(date.getFullYear() + n, date.getMonth(), 1))
  const weekStart = addDays(date, -((date.getDay() + 6) % 7))
  const label = view === 'Day' ? date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }) : view === 'Week' ? `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${addDays(weekStart, 6).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : view === 'Month' ? date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : String(date.getFullYear())
  const cols: Column<Booking>[] = [
    { key: 'p', header: 'Patient', render: (r) => <><div className="font-semibold text-sand-900">{nameOf(r.patientId)}</div><div className="text-xs text-sand-500">{r.date} · {r.start}–{r.end}</div></> },
    { key: 'mod', header: 'Treatment · room', render: (r) => <><div>{r.modality}</div><div className="text-xs text-sand-500">{r.resource}</div></> },
    { key: 'st', header: 'Status', render: (r) => <Pill tone={statusTone[r.status]}>{r.status}</Pill> },
    { key: 'ecw', header: 'eCW', render: (r) => <Pill tone={ecwTone(r.ecw)}>{r.ecw}</Pill> },
  ]
  const slots = Array.from({ length: (DAY_END - DAY_START) / step }, (_, i) => DAY_START + i * step)
  const rowH = step <= 15 ? 22 : step === 20 ? 26 : step === 30 ? 34 : 56
  const px = (m: number) => ((m - DAY_START) / step) * rowH

  return (
    <>
      <PageHeader eyebrow="Care · Calendar" title="Calendar · data pulled from eCW" description="Treatments across the top, time down the side. Insurance visits come from eCW and are read-only; program sessions are booked here and copied to eCW."
        meta={<><span className="inline-flex items-center gap-1.5">Last read from eCW: <strong className="text-sand-800">{readAt} today</strong></span><button onClick={() => { setReadAt(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })); notify('eCW calendar read again · 2 insurance visits, no new conflicts') }} className="inline-flex items-center gap-1 text-teal-700 underline"><RefreshCw size={13} /> Read eCW again</button><ToConfirm>whether rooms/devices exist as eCW resources</ToConfirm></>}
        actions={<button onClick={() => nav('/staff/calendar/new')} className="btn-primary">+ Staff booking</button>} />
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Bookings today" value={sample.length} hint="2 from eCW" tone="neutral" />
        <Stat label="Waiting for confirmation" value={sample.filter((b) => b.ecw === 'Waiting for confirmation').length} tone="teal" />
        <Stat label="Exceptions" value={sample.filter((b) => b.status === 'Exception').length} hint="patient booking stays valid" tone="bad" />
        <Stat label="Requests to review" value={sample.filter((b) => b.status === 'Requested').length} tone="warn" />
      </div>
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'calendar', label: 'Calendar' }, { key: 'exceptions', label: 'Booking exceptions & requests', count: exceptions.length }]} />
      {tab === 'calendar' ? (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <div className="flex rounded-full border border-sand-300 bg-white p-0.5" role="group" aria-label="Calendar view">{(['Day', 'Week', 'Month', 'Year'] as const).map((v) => <button key={v} onClick={() => setView(v)} aria-pressed={view === v} className={`rounded-full px-3.5 py-1 text-xs font-semibold ${view === v ? 'bg-sand-900 text-white' : 'text-sand-600'}`}>{v}</button>)}</div>
            <div className="flex items-center gap-1"><button aria-label="Previous" onClick={() => move(-1)} className="btn-secondary px-2.5 py-1.5"><ChevronLeft size={16} /></button><span className="min-w-[220px] px-2 text-center text-sm font-semibold text-sand-900">{label}</span><button aria-label="Next" onClick={() => move(1)} className="btn-secondary px-2.5 py-1.5"><ChevronRight size={16} /></button></div>
            <button onClick={() => setDate(TODAY)} className="btn-ghost px-2.5 py-1.5 text-xs">Today</button>
            {view === 'Day' && <label className="ml-auto flex items-center gap-1.5 text-xs text-sand-500">Time steps<select className="input w-auto py-1.5 pr-8 text-sm" value={step} onChange={(e) => setStep(Number(e.target.value))}>{[15, 20, 30, 60].map((n) => <option key={n} value={n}>{n} min</option>)}</select></label>}
          </div>

          {view === 'Day' && (
            <div className="grid gap-5 xl:grid-cols-4">
              <div className={`card overflow-auto ${sel ? 'xl:col-span-3' : 'xl:col-span-4'}`}>
                <div className="min-w-[980px]">
                  <div className="sticky top-0 z-10 grid border-b border-sand-200 bg-white" style={{ gridTemplateColumns: `72px repeat(${columns.length}, minmax(0, 1fr))` }}>
                    <div className="px-2 py-2 eyebrow">Time</div>
                    {columns.map((c) => <div key={c.resource} className={`border-l border-sand-100 px-2 py-2 ${c.readOnly ? 'bg-sand-50' : ''}`}><div className="text-sm font-semibold leading-tight text-sand-900">{c.treatment}</div><div className="text-[11px] text-sand-500">{c.resource}{c.readOnly ? ' · from eCW' : ''}</div></div>)}
                  </div>
                  <div className="relative grid" style={{ gridTemplateColumns: `72px repeat(${columns.length}, minmax(0, 1fr))`, height: slots.length * rowH }}>
                    <div className="relative">{slots.map((m, i) => (m % 60 === 0 || step >= 30) && <div key={m} className="absolute right-2 -translate-y-1/2 text-[11px] text-sand-500" style={{ top: i * rowH + (i === 0 ? 7 : 0) }}>{clock(m)}</div>)}</div>
                    {columns.map((c) => (
                      <div key={c.resource} className={`relative border-l border-sand-100 ${c.readOnly ? 'bg-sand-50/70' : ''}`}>
                        {slots.map((m, i) => <div key={m} className={`absolute inset-x-0 border-t ${m % 60 === 0 ? 'border-sand-200' : 'border-sand-100'}`} style={{ top: i * rowH }} />)}
                        {day.filter((b) => b.resource === c.resource).map((b) => { const t = statusTone[b.status]; return (
                          <button key={b.id} onClick={() => setSel(b)} style={{ top: px(toMin(b.start)) + 1, height: Math.max(px(toMin(b.end)) - px(toMin(b.start)) - 2, 20) }} className={`absolute inset-x-1 overflow-hidden rounded-md border px-1.5 py-0.5 text-left text-[11px] leading-tight ${sel?.id === b.id ? 'ring-2 ring-teal-500' : ''} ${chip(t)}`}>
                            <div className="truncate font-semibold text-sand-900">{nameOf(b.patientId)}</div><div className="truncate text-sand-600">{clock(toMin(b.start))} · {toMin(b.end) - toMin(b.start)} min · {b.status}</div>
                          </button>) })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {sel && <div><BookingCard b={sel} show={show} /></div>}
            </div>
          )}

          {view === 'Week' && (
            <div className="card overflow-x-auto"><div className="min-w-[900px]">
              <div className="grid border-b border-sand-200" style={{ gridTemplateColumns: '170px repeat(7, 1fr)' }}><div className="px-3 py-2 eyebrow">Treatment</div>{Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)).map((d) => <button key={d.toISOString()} onClick={() => { setDate(d); setView('Day') }} className={`border-l border-sand-100 px-2 py-2 text-left text-sm hover:bg-sand-100 ${sameDay(d, TODAY) ? 'bg-teal-50 font-semibold' : ''}`}>{d.toLocaleDateString('en-US', { weekday: 'short' })} <span className="text-sand-500">{d.getDate()}</span></button>)}</div>
              {columns.map((c) => <div key={c.resource} className="grid border-b border-sand-100" style={{ gridTemplateColumns: '170px repeat(7, 1fr)' }}><div className="px-3 py-2 text-sm"><div className="font-medium text-sand-900">{c.treatment}</div><div className="text-[11px] text-sand-500">{c.resource}</div></div>{Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)).map((d) => { const bs = bookingsOn(d).filter((b) => b.resource === c.resource); return <div key={d.toISOString()} className="space-y-1 border-l border-sand-100 p-1.5">{bs.map((b) => <button key={b.id} onClick={() => { setDate(d); setView('Day'); setSel(b) }} className={`block w-full truncate rounded border px-1.5 py-0.5 text-left text-[11px] ${chip(statusTone[b.status])}`}>{clock(toMin(b.start))} · {nameOf(b.patientId).split(' ')[0]}</button>)}</div> })}</div>)}
            </div></div>
          )}

          {view === 'Month' && (() => { const first = new Date(date.getFullYear(), date.getMonth(), 1); const start = addDays(first, -((first.getDay() + 6) % 7)); return (
            <div className="card overflow-hidden">
              <div className="grid grid-cols-7 border-b border-sand-200 bg-sand-50">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <div key={d} className="px-3 py-2 eyebrow">{d}</div>)}</div>
              <div className="grid grid-cols-7">{Array.from({ length: 42 }, (_, i) => addDays(start, i)).map((d) => { const bs = bookingsOn(d); const inMonth = d.getMonth() === date.getMonth(); const ex = bs.filter((b) => b.status === 'Exception').length; return (
                <button key={d.toISOString()} onClick={() => { setDate(d); setView('Day') }} className={`min-h-[92px] border-b border-r border-sand-100 p-2 text-left hover:bg-sand-100 ${inMonth ? '' : 'bg-sand-50/60 text-sand-400'} ${sameDay(d, TODAY) ? 'bg-teal-50' : ''}`}>
                  <div className={`text-sm ${sameDay(d, TODAY) ? 'font-bold text-sand-900' : ''}`}>{d.getDate()}</div>
                  {bs.length > 0 && <div className="mt-1 text-xs text-sand-700">{bs.length} booking{bs.length > 1 ? 's' : ''}</div>}
                  {ex > 0 && <Pill tone="bad" dot={false}>{ex} exception{ex > 1 ? 's' : ''}</Pill>}
                </button>) })}</div>
            </div>) })()}

          {view === 'Year' && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{Array.from({ length: 12 }, (_, m) => { const days = new Date(date.getFullYear(), m + 1, 0).getDate(); const total = Array.from({ length: days }, (_, i) => bookingsOn(new Date(date.getFullYear(), m, i + 1)).length).reduce((a, b) => a + b, 0); const past = new Date(date.getFullYear(), m + 1, 0) < TODAY; return (
              <button key={m} onClick={() => { setDate(new Date(date.getFullYear(), m, 1)); setView('Month') }} className={`card p-4 text-left hover:border-teal-300 ${m === TODAY.getMonth() && date.getFullYear() === 2026 ? 'border-teal-500 bg-teal-50' : ''}`}>
                <div className="font-display text-xl font-semibold text-sand-900">{new Date(2026, m, 1).toLocaleDateString('en-US', { month: 'long' })}</div>
                <div className="mt-1 text-2xl font-semibold text-sand-900">{total}</div><div className="text-xs text-sand-500">{past ? 'sessions held' : 'sessions booked'}</div>
              </button>) })}</div>
          )}
        </>
      ) : (
        <MasterDetail>
          <div><QueueTable rows={exceptions} columns={cols} rowKey={(r) => r.id} rowTone={(r) => statusTone[r.status]} onRowClick={setSel} /></div>
          <div>{sel && <BookingCard b={sel} show={show} />}</div>
        </MasterDetail>
      )}
    </>
  )
}

function BookingCard({ b, show }: { b: Booking; show: (m: string) => void }) {
  return (
    <Card title={nameOf(b.patientId)} subtitle={`${b.modality} · ${b.resource} · ${b.date}, ${b.start}–${b.end}`}>
      <Row label="Status"><Pill tone={b.status === 'Exception' ? 'bad' : b.status === 'Confirmed' ? 'ok' : b.status === 'Requested' ? 'warn' : 'teal'}>{b.status}</Pill></Row>
      <Row label="eCW mirror"><Pill tone={b.ecw === 'Synced' ? 'ok' : b.ecw === 'Conflict' || b.ecw === 'Mirror failed' ? 'bad' : 'neutral'}>{b.ecw}</Pill></Row>
      <Row label="Booked by">{b.source}</Row>
      <Row label="Rule checks">Plan of Care ✓ · spacing ✓ · weekly limit ✓ · resource ✓</Row>
      {b.ecw === 'Conflict' && <div className="mt-3"><Notice tone="bad" title="eCW slot taken by a manual booking">The patient's reservation in this app is valid and the room is held. Move the other eCW appointment or free the slot, then retry the mirror. The patient sees “Reserved” until verified.</Notice></div>}
      {b.ecw === 'Mirror failed' && <div className="mt-3"><Notice tone="bad" title="Mirror appointment could not be created">AI Agent could not find resource “BEMER” in eCW. Create the appointment manually with reason HLX:{b.id}, then mark as done.</Notice></div>}
      {b.status === 'Requested' && <div className="mt-3"><Notice tone="warn" title="Laser request · needs nurse review">Last laser Sep 22 · spacing rule ≥ 5 days ✓ · consent v1.1 signed ✓.</Notice></div>}
      {b.ecw === 'Waiting for confirmation' && <div className="mt-3"><Notice tone="teal">Reserved in the app. The AI Agent is creating the mirror appointment (reason HLX:{b.id}) and will read it back before marking “Confirmed”.</Notice></div>}
      {b.ecw === 'Read-only from eCW' && <div className="mt-3"><Notice tone="info">Insurance visit booked in eCW by staff. Shown here for context only; edit it in eCW.</Notice></div>}
      {(b.status === 'Exception' || b.status === 'Requested') && (
        <div className="mt-4 space-y-2">
          <Field label="Note" required><input className="input" placeholder="What you checked or changed" /></Field>
          <div className="grid grid-cols-2 gap-2">
            {b.status === 'Requested' ? <><button onClick={() => show('Request approved · booking reserved · mirror queued')} className="btn-primary">Approve</button><button onClick={() => show('Request declined · patient notified')} className="btn-secondary">Decline</button></> : <><button onClick={() => show('Retry queued · AI Agent will re-check the slot first')} className="btn-secondary">Retry mirror</button><button onClick={() => show('Closed · done manually in eCW by Karina')} className="btn-primary">Done manually · close</button></>}
          </div>
        </div>
      )}
    </Card>
  )
}
