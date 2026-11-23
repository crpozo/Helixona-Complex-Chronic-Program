import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, MessageCircle, Sparkles, Pill as PillIcon, Flame, Zap, Calendar, CalendarCheck, ClipboardList, CreditCard, FileCheck2, FileSignature, HeartPulse, Receipt, Siren } from 'lucide-react'
import { PhoneFrame, Wordmark } from '../../../components/PhoneFrame'
import { MonitoringNotice, Pill } from '../../../components/ui'
import { getPathway, pathwayLabel } from '../../../mock/questionnaire'
import { Actors, Roadmap } from '../../../components/Roadmap'
import { myPlan } from '../../../mock/roadmap'

export default function PatientHome() {
  const [flare, setFlare] = useState<'Flare' | 'Crash' | null>('Flare')
  /* Once a month the app asks the patient to confirm the medication list. Dismissing it hides it for this visit. */
  const [medPrompt, setMedPrompt] = useState(() => { try { return sessionStorage.getItem('hlx-med-prompt') !== 'off' } catch { return true } })
  const closeMedPrompt = () => { setMedPrompt(false); try { sessionStorage.setItem('hlx-med-prompt', 'off') } catch { /* ignore */ } }
  return (
    <PhoneFrame>
      {medPrompt && <div className="absolute inset-0 z-30 flex items-end bg-sand-900/40" role="dialog" aria-modal="true" aria-label="Monthly medication check-in">
        <div className="w-full rounded-t-3xl bg-white p-5 pb-7">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 text-teal-700"><PillIcon size={20} /></span>
          <h2 className="mt-3 font-display text-2xl font-semibold text-sand-900">Monthly medication check-in</h2>
          <p className="mt-1 text-[15px] text-sand-600">It has been a month since you confirmed your medications and supplements. Are you still taking everything as listed, or has something changed?</p>
          <Link to="/patient/medications" onClick={closeMedPrompt} className="btn-primary btn-lg mt-4 w-full">Review my list</Link>
          <button onClick={closeMedPrompt} className="btn-ghost mt-2 w-full">Remind me later</button>
        </div>
      </div>}
      <div className="px-5 pt-12 pb-8">
        <div className="flex items-center justify-between"><Wordmark size="sm" /><span className="text-xs text-sand-500">Marisol A.</span></div>
        <h1 className="mt-6 font-display text-[26px] font-semibold text-sand-900">Good evening, Marisol</h1>
        <p className="text-sand-600">{getPathway() === 'chronic' ? <>You're in <strong>A&P</strong>.</> : <>Your pathway: <strong>{pathwayLabel.optimization}</strong>. First visit not yet scheduled.</>}</p>

        <div className="card mt-5 overflow-hidden">
          <div className="bg-teal-800 px-4 py-3 text-white">
            <div className="text-xs text-teal-200">Your next step</div>
            <div className="font-semibold">Add the missing pages of your lab report</div>
          </div>
          <div className="p-4 text-sm text-sand-600">Ana asked for pages 3–4 of your Quest report (lipid panel). Everything else is complete.
            <Link to="/patient/uploads" className="btn-primary mt-3 w-full">Upload now</Link>
          </div>
        </div>

        <div className="mt-5"><Roadmap current={myPlan.stage} /></div>
        <div className="card mt-2 p-4"><div className="flex items-center justify-between"><span className="eyebrow">What we're working on</span><span className="text-xs text-sand-500">Set by {myPlan.updatedBy} · {myPlan.updatedAt}</span></div><div className="mt-2"><Actors actors={myPlan.actors} lead={myPlan.leadActor} /></div><p className="mt-2 text-xs text-sand-500">Your lead actor is treated first. Dr. D. updates this list at each review.</p></div>

        <div className="mt-6 eyebrow">Your program</div>
        <ul className="mt-2 grid grid-cols-2 gap-2">
          <Tile to="/patient/intake" icon={<ClipboardList size={20} />} label="Questionnaire" status="Submitted" tone="ok" />
          <Tile to="/patient/forms" icon={<FileCheck2 size={20} />} label="Signed forms" status="9 of 10" tone="warn" />
          <Tile to="/patient/book" icon={<Calendar size={20} />} label="Scheduled visits" status="2 scheduled" tone="warn" />
          <Tile to="/patient/payments" icon={<CreditCard size={20} />} label="Card on file" status="Add a card to book" tone="neutral" />
        </ul>

        {flare && (
          <div className="card mt-4 p-4">
            <div className="flex items-start gap-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${flare === 'Crash' ? 'bg-sand-900 text-teal-300' : 'bg-bad-100 text-bad-700'}`}>{flare === 'Crash' ? <Zap size={17} /> : <Flame size={17} />}</span>
              <div className="flex-1"><div className="font-semibold text-sand-900">Active {flare.toLowerCase()} · since Oct 2</div><p className="text-sm text-sand-600">{flare === 'Crash' ? 'Changed from a flare on Oct 8. The start date stays Oct 2.' : 'Reported Oct 2 · affecting daily activities a lot.'}</p></div></div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {flare === 'Flare' ? <button onClick={() => setFlare('Crash')} className="btn-secondary px-2 py-2 text-[11px]">It became a crash</button> : <span className="self-center text-xs text-sand-500">Your care team was told.</span>}
              <button onClick={() => setFlare(null)} className="btn-secondary px-2 py-2 text-[11px]">It is over</button>
            </div>
          </div>
        )}
        <div className="mt-6 eyebrow">During your program</div>
        <ul className="mt-2 space-y-2">
          {([
            ['/patient/survey', 'Daily health check-in', 'About one minute · 3 recent treatments to review', <HeartPulse size={16} />],
            ['/patient/crash', 'Report a flare or crash', 'Anytime · reviewed during office hours', <Siren size={16} />],
            ['/patient/medications', 'Medications & supplements', 'Monthly check-in due · 5 new since your last visit', <PillIcon size={16} />],
            ['/patient/book', 'Book a session', 'Nano bath Thu Oct 9 · 9:00 AM confirmed', <CalendarCheck size={16} />],
            ['/patient/agreement', 'Membership agreement & payment', 'Available once your program is offered', <FileSignature size={16} />],
            ['/patient/payments', 'Payments & receipts', 'Next: $2,000 on Nov 1', <Receipt size={16} />],
            ['/patient/messages', 'Message the clinic', 'Chat or email your care team · answered in office hours', <MessageCircle size={16} />],
            ['/patient/assistant', 'Ask Helixona', 'AI assistant · ask anything about your program', <Sparkles size={16} />],
            ['/patient/settings', 'Notifications', 'Email and text message preferences', <Bell size={16} />],
          ] as [string, string, string, React.ReactNode][]).map(([to, t, d, icon]) => (
            <li key={t}><Link to={to} className="card flex items-center gap-3 p-3.5 hover:border-teal-300">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">{icon}</span>
              <span className="flex-1"><span className="block font-semibold text-sand-800">{t}</span><span className="block text-xs text-sand-500">{d}</span></span>
            </Link></li>
          ))}
        </ul>
        <p className="mt-2 text-[11px] text-sand-500">For review: these are shown unlocked so every patient screen is reachable from here. In the real app they appear as the program progresses.</p>
        <div className="mt-6"><MonitoringNotice /></div>
        <div className="mt-4 flex items-center justify-center gap-1 text-xs text-sand-500"><HeartPulse size={12} /> Helixona · Irvine, CA · (949) 257-2644</div>
      </div>
    </PhoneFrame>
  )
}

function Tile({ to, icon, label, status, tone }: { to?: string; icon: React.ReactNode; label: string; status: string; tone: 'ok' | 'warn' | 'neutral' | 'teal' }) {
  const inner = (
    <div className="card h-full p-3.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-teal-700">{icon}</span>
      <div className="mt-3 font-semibold text-sand-900 text-[15px]">{label}</div>
      <div className="mt-1"><Pill tone={tone} dot={false}>{status}</Pill></div>
    </div>
  )
  return <li>{to ? <Link to={to} className="block h-full hover:-translate-y-px transition-transform">{inner}</Link> : inner}</li>
}
