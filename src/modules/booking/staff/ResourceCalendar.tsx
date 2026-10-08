import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, Field, Notice, PageHeader, Pill, QueueTable, Row, Stat, Tabs, ToConfirm, Toast, type Column, type Tone } from '../../../components/ui'
import { bookings, type Booking } from '../../../mock/program'

const lanes = ['NP · Exam 2', 'IV suite', 'Nano bath room 1', 'Nano bath room 2', 'Red light bed 1', 'Salt room (4 seats)', 'BEMER mat 1', 'Erchonia unit']
const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16]
const statusTone: Record<Booking['status'], Tone> = { Reserved: 'teal', Confirmed: 'ok', Requested: 'warn', Exception: 'bad', Completed: 'neutral', Cancelled: 'neutral' }
const ecwTone = (e: Booking['ecw']): Tone => e === 'Synced' ? 'ok' : e === 'Waiting for confirmation' ? 'teal' : e === 'Conflict' || e === 'Mirror failed' ? 'bad' : 'neutral'
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }

export default function ResourceCalendar() {
  const [tab, setTab] = useState('calendar')
  const [sel, setSel] = useState<Booking | null>(bookings[1])
  const [toast, setToast] = useState<string | null>(null)
  const show = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2200) }
  const exceptions = bookings.filter((b) => b.status === 'Exception' || b.status === 'Requested')
  const cols: Column<Booking>[] = [
    { key: 'id', header: 'Booking', render: (r) => <><div className="font-semibold">{r.id}</div><div className="text-xs text-sand-500">{r.date} · {r.start}–{r.end}</div></> },
    { key: 'p', header: 'Patient', render: (r) => r.patientId },
    { key: 'mod', header: 'Modality · resource', render: (r) => <><div>{r.modality}</div><div className="text-xs text-sand-500">{r.resource}</div></> },
    { key: 'st', header: 'Status', render: (r) => <Pill tone={statusTone[r.status]}>{r.status}</Pill> },
    { key: 'ecw', header: 'eCW', render: (r) => <Pill tone={ecwTone(r.ecw)}>{r.ecw}</Pill> },
  ]
  return (
    <>
      <Toast message={toast} />
      <PageHeader eyebrow="Booking · Operations" title="Resource calendar" description="One lane per room or device. The app owns these bookings; eCW receives a mirror copy. Insurance visits (NP, IV, labs) are read from eCW and shown read-only." meta={<ToConfirm>whether rooms/devices exist as eCW resources</ToConfirm>} actions={<><button className="btn-secondary"><ChevronLeft size={16} /></button><span className="self-center text-sm font-semibold">Thursday, Oct 9, 2026</span><button className="btn-secondary"><ChevronRight size={16} /></button><button className="btn-primary">+ Staff booking</button></>} />
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Bookings today" value={bookings.length} hint="2 from eCW" tone="neutral" />
        <Stat label="Waiting for confirmation" value={bookings.filter((b) => b.ecw === 'Waiting for confirmation').length} tone="teal" />
        <Stat label="Exceptions" value={bookings.filter((b) => b.status === 'Exception').length} hint="patient booking stays valid" tone="bad" />
        <Stat label="Requests to review" value={bookings.filter((b) => b.status === 'Requested').length} tone="warn" />
      </div>
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'calendar', label: 'Calendar' }, { key: 'exceptions', label: 'Booking exceptions & requests', count: exceptions.length }]} />
      {tab === 'calendar' ? (
        <div className="grid gap-5 xl:grid-cols-4">
          <div className="xl:col-span-3 card overflow-x-auto">
            <div className="min-w-[860px]">
              <div className="grid border-b border-sand-200" style={{ gridTemplateColumns: '170px repeat(9, 1fr)' }}><div className="px-3 py-2 eyebrow">Resource</div>{hours.map((h) => <div key={h} className="border-l border-sand-100 px-2 py-2 text-xs text-sand-500">{h > 12 ? h - 12 : h}{h >= 12 ? ' PM' : ' AM'}</div>)}</div>
              {lanes.map((lane) => {
                const items = bookings.filter((b) => b.resource === lane)
                const readOnly = lane.startsWith('NP') || lane.startsWith('IV')
                return (
                  <div key={lane} className={`relative grid border-b border-sand-100 ${readOnly ? 'bg-sand-50' : ''}`} style={{ gridTemplateColumns: '170px 1fr', minHeight: 52 }}>
                    <div className="px-3 py-3 text-sm"><div className="font-medium text-sand-900">{lane}</div>{readOnly && <div className="text-[11px] text-sand-500">Read-only from eCW</div>}</div>
                    <div className="relative">
                      {hours.map((h, i) => <div key={h} className="absolute top-0 bottom-0 border-l border-sand-100" style={{ left: `${(i / 9) * 100}%` }} />)}
                      {items.map((b) => { const l = ((toMin(b.start) - 480) / 540) * 100, w = ((toMin(b.end) - toMin(b.start)) / 540) * 100; const t = statusTone[b.status]; return (
                        <button key={b.id} onClick={() => setSel(b)} style={{ left: `${l}%`, width: `${w}%` }} className={`absolute top-2 bottom-2 overflow-hidden rounded-md border px-2 text-left text-xs ${sel?.id === b.id ? 'ring-2 ring-teal-500' : ''} ${t === 'bad' ? 'border-bad-600/40 bg-bad-100' : t === 'ok' ? 'border-ok-600/30 bg-ok-100' : t === 'warn' ? 'border-warn-600/30 bg-warn-100' : t === 'teal' ? 'border-teal-500/40 bg-teal-50' : 'border-sand-300 bg-sand-100'}`}>
                          <div className="truncate font-semibold text-sand-900">{b.patientId}</div><div className="truncate text-sand-600">{b.status}{b.ecw !== '—' && b.ecw !== 'Read-only from eCW' ? ` · ${b.ecw}` : ''}</div>
                        </button>) })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div>{sel && <BookingCard b={sel} show={show} />}</div>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-5">
          <div className="xl:col-span-3"><QueueTable rows={exceptions} columns={cols} rowKey={(r) => r.id} rowTone={(r) => statusTone[r.status]} onRowClick={setSel} /></div>
          <div className="xl:col-span-2">{sel && <BookingCard b={sel} show={show} />}</div>
        </div>
      )}
    </>
  )
}

function BookingCard({ b, show }: { b: Booking; show: (m: string) => void }) {
  return (
    <Card title={`${b.id} · ${b.patientId}`} subtitle={`${b.modality} · ${b.resource} · ${b.date}, ${b.start}–${b.end}`}>
      <Row label="Status"><Pill tone={b.status === 'Exception' ? 'bad' : b.status === 'Confirmed' ? 'ok' : b.status === 'Requested' ? 'warn' : 'teal'}>{b.status}</Pill></Row>
      <Row label="eCW mirror"><Pill tone={b.ecw === 'Synced' ? 'ok' : b.ecw === 'Conflict' || b.ecw === 'Mirror failed' ? 'bad' : 'neutral'}>{b.ecw}</Pill></Row>
      <Row label="Booked by">{b.source}</Row>
      <Row label="Rule checks">Plan of Care ✓ · spacing ✓ · weekly limit ✓ · resource ✓</Row>
      {b.ecw === 'Conflict' && <div className="mt-3"><Notice tone="bad" title="eCW slot taken by a manual booking">The patient's reservation in this app is valid and the room is held. Move the other eCW appointment or free the slot, then retry the mirror. The patient sees “Reserved” until verified.</Notice></div>}
      {b.ecw === 'Mirror failed' && <div className="mt-3"><Notice tone="bad" title="Mirror appointment could not be created">Connector could not find resource “BEMER” in eCW. Create the appointment manually with reason HLX:{b.id}, then mark as done.</Notice></div>}
      {b.status === 'Requested' && <div className="mt-3"><Notice tone="warn" title="Laser request · needs nurse review">Last laser Sep 22 · spacing rule ≥ 5 days ✓ · consent v1.1 signed ✓.</Notice></div>}
      {b.ecw === 'Waiting for confirmation' && <div className="mt-3"><Notice tone="teal">Reserved in the app. The connector is creating the mirror appointment (reason HLX:{b.id}) and will read it back before marking “Confirmed”.</Notice></div>}
      {b.ecw === 'Read-only from eCW' && <div className="mt-3"><Notice tone="info">Insurance visit booked in eCW by staff. Shown here for context only; edit it in eCW.</Notice></div>}
      {(b.status === 'Exception' || b.status === 'Requested') && (
        <div className="mt-4 space-y-2">
          <Field label="Note" required><input className="input" placeholder="What you checked or changed" /></Field>
          <div className="grid grid-cols-2 gap-2">
            {b.status === 'Requested' ? <><button onClick={() => show('Request approved · booking reserved · mirror queued')} className="btn-primary">Approve</button><button onClick={() => show('Request declined · patient notified')} className="btn-secondary">Decline</button></> : <><button onClick={() => show('Retry queued · connector will re-check the slot first')} className="btn-secondary">Retry mirror</button><button onClick={() => show('Closed · done manually in eCW by Karina')} className="btn-primary">Done manually · close</button></>}
          </div>
        </div>
      )}
    </Card>
  )
}
