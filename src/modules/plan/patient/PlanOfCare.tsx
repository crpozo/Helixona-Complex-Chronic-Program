import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronDown, Download } from 'lucide-react'
import { PhoneFrame, PatientTopBar } from '../../../components/PhoneFrame'
import { ToConfirm } from '../../../components/ui'
import { planVersions, type PlanVersion } from '../../../mock/planOfCare'

/** The patient's Plan of Care: the current plan in full, and a plain summary of what changed each time
 *  the provider revised it. Read-only; changes are made by the provider at a review. */
export function PlanBody({ v }: { v: PlanVersion }) {
  return (
    <div className="space-y-4">
      <section><div className="eyebrow">Focus</div><p className="mt-1 text-[15px] text-sand-800">{v.focus}</p></section>
      <section><div className="eyebrow">Goals</div><ul className="mt-1 list-disc space-y-1 pl-5 text-[15px] text-sand-800">{v.goals.map((g) => <li key={g}>{g}</li>)}</ul></section>
      <section><div className="eyebrow">Therapies</div><ul className="mt-1 divide-y divide-sand-100">{v.therapies.map((t) => <li key={t.name} className="flex items-start justify-between gap-3 py-2"><span><span className="block text-[15px] font-medium text-sand-900">{t.name}</span><span className="block text-xs text-sand-500">{t.note}</span></span><span className="whitespace-nowrap text-sm text-sand-700">{t.rhythm}</span></li>)}</ul></section>
      <section><div className="eyebrow">Medications and supplements</div><ul className="mt-1 list-disc space-y-1 pl-5 text-[15px] text-sand-800">{v.medications.map((m) => <li key={m}>{m}</li>)}</ul></section>
      <section><div className="eyebrow">Labs and follow-up</div><ul className="mt-1 list-disc space-y-1 pl-5 text-[15px] text-sand-800">{v.followUp.map((m) => <li key={m}>{m}</li>)}</ul></section>
    </div>
  )
}

export default function PlanOfCare() {
  const [tab, setTab] = useState<'plan' | 'changes'>('plan')
  const [open, setOpen] = useState<number | null>(null)
  const current = planVersions[0]
  return (
    <PhoneFrame>
      <PatientTopBar title="My Plan of Care" back={<Link to="/patient/home" className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></Link>} />
      <div className="px-5 pb-8">
        <h1 className="font-display text-2xl font-semibold text-sand-900">My Plan of Care</h1>
        <p className="mt-1 text-[15px] text-sand-600">Version {current.version} · updated {current.date} by your provider.</p>
        <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-sand-100 p-1" role="tablist">{([['plan', 'Current plan'], ['changes', `What changed · ${planVersions.length}`]] as const).map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-lg py-2 text-sm font-medium ${tab === k ? 'bg-white text-sand-900 shadow-sm' : 'text-sand-600'}`}>{l}</button>)}</div>

        {tab === 'plan' && <>
          <div className="mt-4 rounded-2xl border border-teal-300 bg-teal-50 p-4"><div className="eyebrow">Latest change · {current.date}</div><ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-sand-800">{current.changes.map((c) => <li key={c}>{c}</li>)}</ul><p className="mt-2 text-xs text-sand-600">Why: {current.why}</p></div>
          <div className="card mt-3 p-4"><PlanBody v={current} /></div>
          <button onClick={() => window.print()} className="btn-secondary mt-3 w-full"><Download size={15} /> Download or print the full plan</button>
        </>}

        {tab === 'changes' && <ol className="mt-4 space-y-3">{planVersions.map((v) => { const isOpen = open === v.version; return (
          <li key={v.version} className="card overflow-hidden">
            <button onClick={() => setOpen(isOpen ? null : v.version)} aria-expanded={isOpen} className="flex w-full items-start gap-3 p-4 text-left">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand-900 text-sm font-bold text-white">v{v.version}</span>
              <span className="flex-1"><span className="block text-[15px] font-semibold text-sand-900">{v.date}{v.version === current.version ? ' · current' : ''}</span><span className="block text-xs text-sand-500">Step {v.stage} · lead actor {v.lead}</span>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-sand-700">{v.changes.map((c) => <li key={c}>{c}</li>)}</ul>
                <span className="mt-1 block text-xs text-sand-500">Why: {v.why}</span></span>
              <ChevronDown size={18} className={`mt-1 shrink-0 text-sand-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="border-t border-sand-100 p-4"><div className="mb-3 text-xs font-semibold uppercase tracking-wide text-sand-500">The full plan as it was</div><PlanBody v={v} /></div>}
          </li>) })}</ol>}

        <p className="mt-4 text-xs leading-relaxed text-sand-500">Your provider changes this plan at your reviews. To ask for a change, request a plan review from Book a session or message the clinic.</p>
        <Link to="/patient/book" className="btn-secondary mt-2 w-full">Book a session from my plan</Link>
        <div className="mt-3"><ToConfirm>where the Plan of Care is written today and how each new version reaches this screen</ToConfirm></div>
      </div>
    </PhoneFrame>
  )
}
