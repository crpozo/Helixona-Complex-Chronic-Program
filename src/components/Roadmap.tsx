import { useState } from 'react'
import { Check, ChevronDown, GraduationCap, PersonStanding } from 'lucide-react'
import { stages } from '../mock/roadmap'

const ROAD = '#3B2218'      // road colour from the clinic graphic
const AHEAD = '#D9D2C9'     // road not travelled yet

/** One row's piece of the winding road: enters at the centre, swings out to the node, returns to the centre.
 *  Drawn in a 0–100 box and stretched to the row height, so rows can grow when opened. */
function RoadPiece({ side, top, bottom }: { side: 'left' | 'right'; top: string; bottom: string }) {
  const x = side === 'left' ? 24 : 76
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      <path d={`M50 0 C50 26 ${x} 24 ${x} 50`} fill="none" stroke={top} strokeWidth={15} vectorEffect="non-scaling-stroke" />
      <path d={`M${x} 50 C${x} 76 50 74 50 100`} fill="none" stroke={bottom} strokeWidth={15} vectorEffect="non-scaling-stroke" />
      <path d={`M50 0 C50 26 ${x} 24 ${x} 50 C${x} 76 50 74 50 100`} fill="none" stroke="#fff" strokeOpacity={0.55} strokeWidth={1.5} strokeDasharray="5 6" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/** Healing Roadmap. Default: the patient's vertical, tappable road with a figure standing on the current step.
 *  `compact`: one-line stepper for staff headers and tight spaces. */
export function Roadmap({ current, compact = false }: { current: number; compact?: boolean }) {
  const [open, setOpen] = useState<number | null>(current)

  if (compact) return (
    <ol className="flex min-w-[220px] items-center" aria-label="Healing Roadmap">
      {stages.map((s, i) => {
        const state = s.n < current ? 'done' : s.n === current ? 'current' : 'next'
        return (
          <li key={s.n} className="flex flex-1 items-center last:flex-none">
            <span title={`Step ${s.n} · ${s.title}`} aria-current={state === 'current' ? 'step' : undefined} className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${state === 'current' ? 'bg-teal-400 text-sand-900 ring-4 ring-teal-100' : state === 'done' ? 'bg-sand-900 text-white' : 'border border-sand-300 bg-white text-sand-500'}`}>{state === 'done' ? <Check size={11} /> : s.n}</span>
            {i < stages.length - 1 && <span className={`mx-1 h-0.5 flex-1 ${s.n < current ? 'bg-sand-900' : 'bg-sand-200'}`} />}
          </li>
        )
      })}
    </ol>
  )

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between"><span className="eyebrow">Your healing roadmap</span><span className="text-xs text-sand-500">Step {current} of {stages.length}</span></div>
      <p className="mt-1 text-xs text-sand-500">Tap a step to read what happens there.</p>
      <ol className="mt-3" aria-label="Healing Roadmap">
        {stages.map((s, i) => {
          const state = s.n < current ? 'done' : s.n === current ? 'current' : 'next'
          const side = i % 2 === 0 ? 'left' : 'right'
          const isOpen = open === s.n
          return (
            <li key={s.n} className="flex items-stretch gap-2">
              {/* the road */}
              <div className="relative w-[84px] shrink-0">
                <RoadPiece side={side} top={state === 'next' ? AHEAD : ROAD} bottom={state === 'done' ? ROAD : AHEAD} />
                <span className={`absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 font-semibold ${state === 'current' ? 'h-11 w-11 border-white bg-teal-400 text-sand-900 shadow-[0_0_0_4px_rgba(212,183,122,0.35)]' : 'h-8 w-8 border-white text-[13px] ' + (state === 'done' ? 'bg-sand-900 text-white' : 'bg-white text-sand-600 shadow-[0_0_0_1px_#d6d1c9]')}`} style={{ left: side === 'left' ? '24%' : '76%' }}>
                  {state === 'current' ? <PersonStanding size={26} strokeWidth={2.2} aria-label="You are here" /> : state === 'done' ? <Check size={15} /> : s.n === stages.length ? <GraduationCap size={16} /> : s.n}
                </span>
              </div>
              {/* the step */}
              <button type="button" onClick={() => setOpen(isOpen ? null : s.n)} aria-expanded={isOpen} aria-current={state === 'current' ? 'step' : undefined}
                className={`my-1 flex-1 rounded-xl border bg-white px-3 py-2.5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${state === 'current' ? 'border-teal-500' : 'border-sand-200 hover:border-sand-300'}`} style={{ borderLeft: `6px solid ${s.color}` }}>
                <span className="flex items-start gap-2">
                  <span className="flex-1">
                    <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-sand-500">Step {s.n}{state === 'current' ? ' · You are here' : state === 'done' ? ' · Done' : ''}</span>
                    <span className={`block text-[15px] leading-snug ${state === 'next' ? 'font-medium text-sand-600' : 'font-semibold text-sand-900'}`}>{s.title}</span>
                  </span>
                  <ChevronDown size={16} className={`mt-1 shrink-0 text-sand-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </span>
                {isOpen && <span className="mt-1.5 block text-sm leading-relaxed text-sand-700">{s.blurb}</span>}
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/** The actors a patient is working on, lead actor first. */
export function Actors({ actors, lead, size = 'md' }: { actors: string[]; lead?: string; size?: 'sm' | 'md' }) {
  if (!actors.length) return <span className="text-xs text-sand-500">Not identified yet</span>
  const ordered = [...(lead && actors.includes(lead) ? [lead] : []), ...actors.filter((a) => a !== lead)]
  return (
    <div className="flex flex-wrap gap-1.5">
      {ordered.map((a) => (
        <span key={a} className={`inline-flex items-center gap-1 rounded-full border font-medium ${size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'} ${a === lead ? 'border-teal-500 bg-teal-50 text-sand-900' : 'border-sand-300 bg-white text-sand-700'}`}>
          {a}{a === lead && <span className="text-[10px] uppercase tracking-[0.12em] text-teal-700">· lead</span>}
        </span>
      ))}
    </div>
  )
}
