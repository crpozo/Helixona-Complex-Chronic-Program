import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Camera, Check, ChevronDown, Clock, Leaf, Pill as PillIcon, Plus, Search } from 'lucide-react'
import { PhoneFrame, PatientTopBar } from '../../../components/PhoneFrame'
import { Choice, MonitoringNotice, Pill, ToConfirm } from '../../../components/ui'
import { catalog, frequencies, needsReason, reasons, seedMeds, statuses, statusTone, type Med, type MedKind, type MedStatus } from '../../../mock/medications'

/** My Medications & Supplements. Shows what was ordered, whether it was obtained, and what the patient reports
 *  actually taking. The patient reports changes when they happen and confirms the whole list once a month;
 *  nothing here changes the doctor's order. */
type Mode = 'list' | 'confirm' | 'review' | 'add'
const TODAY = 'Oct 9, 2026'

export default function Medications() {
  const [meds, setMeds] = useState<Med[]>(seedMeds)
  const [filter, setFilter] = useState<'All' | MedKind>('All')
  const [open, setOpen] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('list')
  const [checkedIn, setCheckedIn] = useState(false)
  const [checked, setChecked] = useState<string[]>([])
  const [q, setQ] = useState('')
  const [draft, setDraft] = useState<{ name: string; kind: MedKind; from: string }>({ name: '', kind: 'Supplement', from: 'Started on my own' })

  const patch = (id: string, p: Partial<Med>) => setMeds((ms) => ms.map((m) => (m.id === id ? { ...m, ...p, confirmed: TODAY, stale: false } : m)))
  const confirmAll = (ids: string[]) => { setMeds((ms) => ms.map((m) => (ids.includes(m.id) ? { ...m, confirmed: TODAY, stale: false } : m))); setCheckedIn(true); setMode('list') }
  const list = meds.filter((m) => filter === 'All' || m.kind === filter)
  const back = mode === 'list'
    ? <Link to="/patient/home" className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></Link>
    : <button onClick={() => setMode('list')} className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></button>

  if (mode === 'confirm') return (
    <PhoneFrame>
      <PatientTopBar title="Monthly check-in" back={back} />
      <div className="px-5 pb-8">
        <h1 className="font-display text-2xl font-semibold text-sand-900">Is this still right?</h1>
        <p className="mt-1 text-[15px] text-sand-600">This is your list as you last reported it. Confirm once and you are done.</p>
        <ul className="mt-4 divide-y divide-sand-100 rounded-2xl border border-sand-200 bg-white">{meds.map((m) => <li key={m.id} className="flex items-center justify-between gap-3 px-4 py-3"><span className="text-[15px] font-medium text-sand-900">{m.name} <span className="font-normal text-sand-500">· {m.dose}</span></span><Pill tone={statusTone(m.status)} dot={false}>{m.status}</Pill></li>)}</ul>
        <button onClick={() => confirmAll(meds.map((m) => m.id))} className="btn-primary btn-lg mt-5 w-full"><Check size={18} /> Yes, nothing has changed</button>
        <button onClick={() => setMode('list')} className="btn-secondary btn-lg mt-2 w-full">Something is different</button>
      </div>
    </PhoneFrame>
  )

  if (mode === 'review') return (
    <PhoneFrame>
      <PatientTopBar title="Review my full list" back={back} />
      <div className="px-5 pb-8">
        <h1 className="font-display text-2xl font-semibold text-sand-900">Check what you are still taking</h1>
        <p className="mt-1 text-[15px] text-sand-600">Leaving one unchecked does not mark it as stopped. To stop or change one, open it on your list.</p>
        <button onClick={() => setChecked(checked.length === meds.length ? [] : meds.map((m) => m.id))} className="btn-secondary mt-4 w-full">{checked.length === meds.length ? 'Clear all' : 'Select all'}</button>
        <div className="mt-3 space-y-2">{meds.map((m) => <Choice key={m.id} multiple size="lg" label={`${m.name} · ${m.dose}`} selected={checked.includes(m.id)} onClick={() => setChecked(checked.includes(m.id) ? checked.filter((x) => x !== m.id) : [...checked, m.id])} />)}</div>
        <button disabled={checked.length === 0} onClick={() => confirmAll(checked)} className="btn-primary btn-lg mt-5 w-full">Confirm {checked.length} of {meds.length}</button>
      </div>
    </PhoneFrame>
  )

  if (mode === 'add') {
    const hits = q.length > 1 ? catalog.filter((c) => c.toLowerCase().includes(q.toLowerCase())) : []
    return (
      <PhoneFrame>
        <PatientTopBar title="Add to my list" back={back} />
        <div className="px-5 pb-8">
          <h1 className="font-display text-2xl font-semibold text-sand-900">What are you taking?</h1>
          <p className="mt-1 text-[15px] text-sand-600">Add anything from another doctor or that you started on your own.</p>
          <div className="relative mt-4"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-400" /><input className="input pl-10 text-[16px]" placeholder="Search by name" value={q} onChange={(e) => { setQ(e.target.value); setDraft({ ...draft, name: e.target.value }) }} /></div>
          {hits.length > 0 && <ul className="mt-2 divide-y divide-sand-100 rounded-xl border border-sand-200 bg-white">{hits.map((h) => <li key={h}><button className="w-full px-4 py-3 text-left text-[15px]" onClick={() => { setDraft({ ...draft, name: h }); setQ(h) }}>{h}</button></li>)}</ul>}
          <p className="mt-2 text-sm text-sand-500">Don't see yours? Type the name exactly as it is on the bottle.</p>
          <button className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-dashed border-sand-300 bg-white p-4 text-left"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-sand-100 text-sand-700"><Camera size={18} /></span><span><span className="block text-[15px] font-semibold text-sand-900">Scan the bottle</span><span className="block text-sm text-sand-500">Take a photo of the label and confirm what we read. Coming soon.</span></span></button>
          <div className="mt-5 text-[15px] font-semibold text-sand-900">What is it?</div>
          <div className="mt-2 grid grid-cols-2 gap-2">{(['Medication', 'Supplement'] as const).map((k) => <Choice key={k} label={k} selected={draft.kind === k} onClick={() => setDraft({ ...draft, kind: k })} />)}</div>
          <div className="mt-4 text-[15px] font-semibold text-sand-900">Where is it from?</div>
          <div className="mt-2 space-y-2">{['Started on my own', 'Another doctor'].map((f) => <Choice key={f} label={f} selected={draft.from === f} onClick={() => setDraft({ ...draft, from: f })} />)}</div>
          <button disabled={!draft.name.trim()} onClick={() => { const id = `x${meds.length}`; setMeds([...meds, { id, name: draft.name.trim(), dose: 'Dose not entered', when: '', kind: draft.kind, source: 'Added by me', orderedBy: draft.from, ordered: TODAY, obtained: 'Reported by you', status: 'Taking regularly', started: TODAY, confirmed: TODAY, note: 'Your care team will review this with the rest of your list' }]); setQ(''); setDraft({ ...draft, name: '' }); setOpen(id); setMode('list') }} className="btn-primary btn-lg mt-6 w-full">Add to my list</button>
          <p className="mt-3 text-xs leading-relaxed text-sand-500">Your care team checks new items against the rest of your list. Do not stop a prescribed medicine because of something you read here; message the clinic.</p>
        </div>
      </PhoneFrame>
    )
  }

  return (
    <PhoneFrame>
      <PatientTopBar title="Medications & supplements" back={back} />
      <div className="px-5 pb-8">
        <h1 className="font-display text-2xl font-semibold text-sand-900">My Medications & Supplements</h1>
        <p className="mt-1 text-[15px] text-sand-600">Tell us when something changes. Once a month we ask you to confirm the list.</p>

        {checkedIn
          ? <div className="mt-4 flex items-center gap-2 rounded-2xl bg-ok-100 px-4 py-3 text-sm font-medium text-ok-700"><Check size={16} /> List confirmed today. Next check-in in about a month.</div>
          : <div className="mt-4 rounded-2xl border border-sand-200 bg-white p-4">
              <div className="text-[16px] font-semibold text-sand-900">Monthly check-in</div>
              <p className="text-sm text-sand-600">Last confirmed Oct 2. Has anything changed?</p>
              <div className="mt-3 space-y-2">
                <button onClick={() => setMode('confirm')} className="btn-primary w-full">No changes · I'm still taking everything as listed</button>
                <button onClick={() => document.getElementById('med-list')?.scrollIntoView({ behavior: 'smooth' })} className="btn-secondary w-full">Something changed</button>
                <button onClick={() => { setChecked([]); setMode('review') }} className="btn-secondary w-full">Review my full list</button>
              </div>
            </div>}

        <div className="mt-5 grid grid-cols-3 gap-1 rounded-xl bg-sand-100 p-1" role="tablist">{(['All', 'Medication', 'Supplement'] as const).map((k) => <button key={k} role="tab" aria-selected={filter === k} onClick={() => setFilter(k)} className={`rounded-lg py-2 text-sm font-medium ${filter === k ? 'bg-white text-sand-900 shadow-sm' : 'text-sand-600'}`}>{k === 'All' ? 'All' : `${k}s`} · {meds.filter((m) => k === 'All' || m.kind === k).length}</button>)}</div>

        <ul id="med-list" className="mt-3 space-y-3">
          {list.map((m) => { const isOpen = open === m.id; return (
            <li key={m.id} className="card overflow-hidden">
              <button onClick={() => setOpen(isOpen ? null : m.id)} aria-expanded={isOpen} className="flex w-full items-start gap-3 p-4 text-left">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand-100 text-sand-700">{m.kind === 'Medication' ? <PillIcon size={16} /> : <Leaf size={16} />}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-semibold text-sand-900">{m.name} <span className="font-normal text-sand-600">· {m.dose}</span></span>
                  <span className="mt-1 flex flex-wrap items-center gap-1.5"><Pill tone={statusTone(m.status)} dot={false}>{m.status}{m.status === 'Taking sometimes' && m.frequency ? ` · ${m.frequency.toLowerCase()}` : ''}</Pill>{m.stale && <span className="inline-flex items-center gap-1 text-xs font-medium text-warn-700"><Clock size={12} /> Not recently confirmed</span>}</span>
                </span>
                <ChevronDown size={18} className={`mt-1 shrink-0 text-sand-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && <div className="border-t border-sand-100 px-4 pb-4 pt-3">
                <dl className="space-y-1.5 text-sm">
                  {m.when && <div className="flex justify-between gap-3"><dt className="text-sand-500">How to take it</dt><dd className="text-right text-sand-900">{m.when}</dd></div>}
                  <div className="flex justify-between gap-3"><dt className="text-sand-500">Ordered</dt><dd className="text-right text-sand-900">{m.orderedBy} · {m.ordered}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-sand-500">Obtained</dt><dd className="text-right text-sand-900">{m.obtained}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-sand-500">You started</dt><dd className="text-right text-sand-900">{m.started ?? 'Not started'}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-sand-500">Last confirmed</dt><dd className="text-right text-sand-900">{m.confirmed}</dd></div>
                </dl>
                {m.note && <p className="mt-2 rounded-lg bg-sand-100 px-3 py-2 text-xs text-sand-700">{m.note}</p>}
                <div className="mt-4 text-[15px] font-semibold text-sand-900">Update what I'm taking</div>
                <div className="mt-2 grid grid-cols-2 gap-2">{statuses.map((s) => <Choice key={s} label={s} selected={m.status === s} onClick={() => patch(m.id, { status: s as MedStatus, reason: needsReason(s) ? m.reason : undefined, frequency: s === 'Taking sometimes' ? m.frequency ?? 'Some days' : undefined, started: (s === 'Taking regularly' || s === 'Taking sometimes') && (!m.started || m.started === 'Not started') ? TODAY : m.started })} />)}</div>
                {m.status === 'Taking sometimes' && <><div className="mt-3 text-sm font-medium text-sand-800">How often?</div><div className="mt-2 grid grid-cols-3 gap-2">{frequencies.map((f) => <Choice key={f} label={f} selected={m.frequency === f} onClick={() => patch(m.id, { frequency: f })} />)}</div></>}
                {(m.status === 'Taking regularly' || m.status === 'Taking sometimes') && <label className="mt-3 block text-sm font-medium text-sand-800">Date you started<input className="input mt-1" defaultValue={m.started} placeholder="A rough date is fine" onBlur={(e) => patch(m.id, { started: e.target.value })} /><span className="mt-1 block text-xs font-normal text-sand-500">Not sure? Leave it as "about" a date, or blank.</span></label>}
                {needsReason(m.status) && <><div className="mt-3 text-sm font-medium text-sand-800">What is the main reason?</div><div className="mt-2 grid grid-cols-2 gap-2">{reasons.map((r) => <Choice key={r} label={r} selected={m.reason === r} onClick={() => patch(m.id, { reason: r })} />)}</div></>}
                <label className="mt-3 block text-sm font-medium text-sand-800">Taking a different dose than ordered?<input className="input mt-1" placeholder="Optional · what you actually take" /></label>
                <p className="mt-3 text-xs leading-relaxed text-sand-500">This records what you tell us. It does not change your doctor's order.</p>
              </div>}
            </li>) })}
        </ul>

        <button onClick={() => setMode('add')} className="btn-secondary btn-lg mt-4 w-full"><Plus size={18} /> Add a medication or supplement</button>
        <div className="mt-3"><ToConfirm>how new items are checked against the rest of the list, and who reviews them</ToConfirm></div>
        <p className="mt-3 text-xs leading-relaxed text-sand-500">We recommend ordering supplements through Fullscript so the source of the product is known. If something on this list looks wrong, message the clinic.</p>
        <Link to="/patient/messages" className="btn-secondary mt-2 w-full">Message the clinic</Link>
        <div className="mt-4"><MonitoringNotice /></div>
      </div>
    </PhoneFrame>
  )
}
