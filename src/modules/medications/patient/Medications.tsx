import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Pill as PillIcon, Leaf } from 'lucide-react'
import { PhoneFrame, PatientTopBar } from '../../../components/PhoneFrame'
import { MonitoringNotice } from '../../../components/ui'

/** What the doctor ordered: each medication and supplement with dose, who ordered it and the date it started,
 *  and a simple "taken today" check. The list comes from the care team; the patient only records what they took. */
interface Item { id: string; name: string; dose: string; when: string; kind: 'Medication' | 'Supplement'; by: string; started: string; note?: string; week: boolean[] }
const seed: Item[] = [
  { id: 'm1', name: 'Low-dose naltrexone', dose: '3 mg', when: 'Every night', kind: 'Medication', by: 'Dr. D.', started: 'Jun 15, 2026', note: 'Increased from 1.5 mg on Jul 13', week: [true, true, true, false, true, true] },
  { id: 'm2', name: 'Cholestyramine', dose: '4 g', when: 'Once a day, away from other medicines', kind: 'Medication', by: 'Dr. D.', started: 'Aug 24, 2026', week: [true, true, false, true, true, true] },
  { id: 'm3', name: 'Levothyroxine', dose: '75 mcg', when: 'Every morning, empty stomach', kind: 'Medication', by: 'Dr. Patel (continued)', started: 'Before the program', week: [true, true, true, true, true, true] },
  { id: 's1', name: 'Magnesium glycinate', dose: '400 mg', when: 'Every night', kind: 'Supplement', by: 'Dr. D.', started: 'Jun 22, 2026', week: [true, false, true, true, true, true] },
  { id: 's2', name: 'Vitamin D3', dose: '5,000 IU', when: 'Every morning', kind: 'Supplement', by: 'Dr. D.', started: 'Jun 22, 2026', week: [true, true, true, true, false, true] },
  { id: 's3', name: 'Omega-3', dose: '2 g', when: 'With dinner', kind: 'Supplement', by: 'Dr. D.', started: 'Sep 28, 2026', week: [true, true, true, true, true, true] },
]
const days = ['S', 'M', 'T', 'W', 'T', 'F', 'Today']

export default function Medications() {
  const [taken, setTaken] = useState<Record<string, boolean | undefined>>({ m3: true })
  const [tab, setTab] = useState<'Medication' | 'Supplement'>('Medication')
  const list = seed.filter((i) => i.kind === tab)
  const done = seed.filter((i) => taken[i.id] !== undefined).length
  return (
    <PhoneFrame>
      <PatientTopBar title="Medications & supplements" back={<Link to="/patient/home" className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></Link>} />
      <div className="px-5 pb-8">
        <h1 className="font-display text-2xl font-semibold text-sand-900">What your doctor ordered</h1>
        <p className="mt-1 text-[15px] text-sand-600">Mark what you took today. Your care team sees it next to your check-ins.</p>
        <div className="mt-3 rounded-xl bg-sand-100 px-3 py-2 text-sm text-sand-700"><strong>{done} of {seed.length}</strong> recorded for today</div>
        <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-sand-100 p-1" role="tablist">{(['Medication', 'Supplement'] as const).map((k) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium ${tab === k ? 'bg-white text-sand-900 shadow-sm' : 'text-sand-600'}`}>{k === 'Medication' ? <PillIcon size={15} /> : <Leaf size={15} />}{k}s · {seed.filter((i) => i.kind === k).length}</button>)}</div>
        <ul className="mt-3 space-y-3">
          {list.map((i) => { const t = taken[i.id]; return (
            <li key={i.id} className="card p-4">
              <div className="text-[16px] font-semibold text-sand-900">{i.name} <span className="font-normal text-sand-600">· {i.dose}</span></div>
              <div className="text-sm text-sand-600">{i.when}</div>
              <div className="mt-1 text-xs text-sand-500">Ordered by {i.by} · started {i.started}</div>
              {i.note && <div className="mt-1 text-xs text-sand-500">{i.note}</div>}
              <div className="mt-3 flex items-center gap-1.5" aria-label="Last 7 days">{[...i.week, t].map((d, k) => <span key={k} className="flex flex-1 flex-col items-center gap-1"><span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${d === true ? 'bg-sand-900 text-white' : d === false ? 'border border-bad-600/40 bg-bad-100 text-bad-700' : 'border border-dashed border-sand-300 text-sand-400'}`}>{d === true ? <Check size={11} /> : d === false ? '–' : ''}</span><span className={`text-[10px] ${k === 6 ? 'font-semibold text-sand-800' : 'text-sand-400'}`}>{days[k]}</span></span>)}</div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button onClick={() => setTaken({ ...taken, [i.id]: true })} aria-pressed={t === true} className={`rounded-xl border px-3 py-2.5 text-sm font-semibold ${t === true ? 'border-sand-900 bg-sand-900 text-white' : 'border-sand-300 bg-white text-sand-800'}`}>{t === true ? 'Taken today' : 'I took it'}</button>
                <button onClick={() => setTaken({ ...taken, [i.id]: false })} aria-pressed={t === false} className={`rounded-xl border px-3 py-2.5 text-sm font-medium ${t === false ? 'border-bad-600/40 bg-bad-100 text-bad-700' : 'border-sand-300 bg-white text-sand-600'}`}>{t === false ? 'Skipped today' : 'I skipped it'}</button>
              </div>
            </li>) })}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-sand-500">Do not start, stop or change a dose here. If something on this list looks wrong, message the clinic.</p>
        <Link to="/patient/messages" className="btn-secondary mt-2 w-full">Message the clinic</Link>
        <div className="mt-4"><MonitoringNotice /></div>
      </div>
    </PhoneFrame>
  )
}
