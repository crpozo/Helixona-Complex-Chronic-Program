import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Settings, MessageCircle, Sparkles, Pill as PillIcon, Flame, Zap, CalendarCheck, ClipboardList, CreditCard, FileCheck2, FileSignature, HeartPulse, Siren } from 'lucide-react'
import { PhoneFrame, Wordmark } from '../../../components/PhoneFrame'
import { MonitoringNotice } from '../../../components/ui'
import { getPathway, pathwayLabel } from '../../../mock/questionnaire'
import { Actors, Roadmap } from '../../../components/Roadmap'
import { myPlan } from '../../../mock/roadmap'

export default function PatientHome() {
  const [flare, setFlare] = useState<'Flare' | 'Crash' | null>('Flare')
  /* Once a month the app asks the patient to confirm the medication list. Dismissing it hides it for this visit. */
  const [medPrompt, setMedPrompt] = useState(() => { try { return sessionStorage.getItem('hlx-med-prompt') !== 'off' } catch { return true } })
  const closeMedPrompt = () => { setMedPrompt(false); try { sessionStorage.setItem('hlx-med-prompt', 'off') } catch { /* ignore */ } }
  /* A short to-do list. Only what is still open is listed: a finished item (the questionnaire, for example) is not shown. */
  const todos = ([
    ['/patient/uploads', 'Upload pages 3–4 of your lab report', 'Asked by Ana · Oct 7', <FileCheck2 size={16} />, false],
    ['/patient/intake', 'Questionnaire', 'Submitted', <ClipboardList size={16} />, true],
    ['/patient/forms', 'Sign 1 remaining form', '9 of 10 signed', <FileSignature size={16} />, false],
    ['/patient/payments', 'Add a card on file', 'Needed to book sessions', <CreditCard size={16} />, false],
    ['/patient/medications', 'Confirm your medication list', 'Monthly check-in · last confirmed Oct 2', <PillIcon size={16} />, false],
  ] as [string, string, string, React.ReactNode, boolean][]).filter((t) => !t[4])
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
        <div className="flex items-center justify-between"><Wordmark size="sm" /><span className="flex items-center gap-2 text-xs text-sand-500">Marisol A.<Link to="/patient/settings" aria-label="Settings" className="flex h-9 w-9 items-center justify-center rounded-full bg-sand-100 text-sand-700"><Settings size={17} /></Link></span></div>
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

        <ul className="mt-4 grid grid-cols-2 gap-2.5">
          {([
            ['/patient/survey', 'Daily check-in', 'About one minute', <HeartPulse size={22} />, '#2f7a4f', '#dcefe3'],
            ['/patient/crash', 'Report a flare or crash', 'Anytime', <Siren size={22} />, '#b4382e', '#f9dcd9'],
            ['/patient/medications', 'Medications & supplements', 'Monthly check-in due', <PillIcon size={22} />, '#6f4b8a', '#ece2f1'],
            ['/patient/book', 'Book a session', 'Next: Thu Oct 9 · 9:00 AM', <CalendarCheck size={22} />, '#8a6d1f', '#f3eadb'],
            ['/patient/assistant', 'Ask Helixona', 'AI assistant', <Sparkles size={22} />, '#1f7a82', '#d8eef0'],
            ['/patient/messages', 'Message the clinic', 'Chat, email or call', <MessageCircle size={22} />, '#3b6ea5', '#e3edf7'],
          ] as [string, string, string, React.ReactNode, string, string][]).map(([to, t, d, icon, color, tint]) => (
            <li key={t}><Link to={to} className="card flex h-full flex-col gap-2 p-3.5 transition-transform active:scale-[0.98]">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: tint, color }}>{icon}</span>
              <span className="text-[15px] font-semibold leading-tight text-sand-900">{t}</span>
              <span className="text-xs text-sand-500">{d}</span>
            </Link></li>
          ))}
        </ul>

        {todos.length > 0 && <>
          <div className="mt-6 flex items-center justify-between"><span className="eyebrow">To do</span><span className="text-xs text-sand-500">{todos.length} left · finished items disappear</span></div>
          <ul className="mt-2 space-y-2">{todos.map(([to, t, d, icon]) => (
            <li key={t}><Link to={to} className="card flex items-center gap-3 p-3.5">
              <span className="flex h-6 w-6 shrink-0 rounded-full border-2 border-sand-300" aria-hidden />
              <span className="flex-1"><span className="block font-semibold text-sand-900">{t}</span><span className="block text-xs text-sand-500">{d}</span></span>
              <span className="text-sand-400">{icon}</span>
            </Link></li>))}</ul>
        </>}

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

        <div className="mt-5"><Roadmap current={myPlan.stage} /></div>
        <div className="card mt-2 p-4"><div className="flex items-center justify-between"><span className="eyebrow">What we're working on</span><span className="text-xs text-sand-500">Updated {myPlan.updatedAt}</span></div><div className="mt-2"><Actors actors={myPlan.actors} lead={myPlan.leadActor} /></div><p className="mt-2 text-xs text-sand-500">Your lead actor is treated first. Your provider updates this list at each review.</p></div>

        <div className="mt-6 eyebrow">More</div>
        <ul className="mt-2 space-y-2">
          {([
            ['/patient/plan', 'My Plan of Care', 'The full plan and what has changed over time', <ClipboardList size={16} />],
            ['/patient/intake', 'My questionnaire and forms', 'What you already sent us', <FileCheck2 size={16} />],
            ['/patient/settings', 'Settings', 'Membership, payments, sharing and notifications', <Settings size={16} />],
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

