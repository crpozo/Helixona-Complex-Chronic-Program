import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { stages } from '../mock/roadmap'

/** Healing Roadmap stepper. `compact` is the staff version (one line); the default is the patient card. */
export function Roadmap({ current, compact = false, to }: { current: number; compact?: boolean; to?: string }) {
  const cur = stages.find((s) => s.n === current) ?? stages[0]
  const steps = (
    <ol className="flex items-center" aria-label="Healing Roadmap">
      {stages.map((s, i) => {
        const state = s.n < current ? 'done' : s.n === current ? 'current' : 'next'
        return (
          <li key={s.n} className="flex flex-1 items-center last:flex-none">
            <span title={`Step ${s.n} · ${s.title}`} aria-current={state === 'current' ? 'step' : undefined}
              className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${compact ? 'h-6 w-6 text-[11px]' : 'h-8 w-8 text-[13px]'} ${state === 'current' ? 'bg-teal-400 text-sand-900 ring-4 ring-teal-100' : state === 'done' ? 'bg-sand-900 text-white' : 'border border-sand-300 bg-white text-sand-500'}`}>
              {state === 'done' ? <Check size={compact ? 11 : 14} /> : s.n}
            </span>
            {i < stages.length - 1 && <span className={`mx-1 h-0.5 flex-1 ${s.n < current ? 'bg-sand-900' : 'bg-sand-200'}`} />}
          </li>
        )
      })}
    </ol>
  )
  if (compact) return <div className="min-w-[220px]">{steps}</div>
  const inner = (
    <>
      <div className="flex items-center justify-between"><span className="eyebrow">Your healing roadmap</span><span className="text-xs text-sand-500">Step {cur.n} of {stages.length}</span></div>
      <div className="mt-3">{steps}</div>
      <div className="mt-3 font-semibold text-sand-900 text-[15px]">Step {cur.n} · {cur.title}</div>
      <p className="mt-0.5 text-sm text-sand-600">{cur.blurb}</p>
      {cur.n < stages.length && <p className="mt-1.5 text-xs text-sand-500">Next: Step {cur.n + 1} · {stages[cur.n].title}</p>}
    </>
  )
  return to ? <Link to={to} className="card block p-4 hover:border-teal-300">{inner}</Link> : <div className="card p-4">{inner}</div>
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
