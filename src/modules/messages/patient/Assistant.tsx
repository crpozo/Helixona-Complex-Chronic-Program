import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Send, Sparkles, UserRound } from 'lucide-react'
import { PhoneFrame, PatientTopBar } from '../../../components/PhoneFrame'
import { CallClinic } from '../../../components/CallClinic'

/** "Ask anything" assistant for the patient. Answers questions about the program, the app and their plan in
 *  plain language. It never gives medical advice and always points to the care team or 911 when it should. */
const suggestions = ['What happens in Step 3?', 'How do I prepare for a nano bath?', 'When is my next payment?', 'How do I reschedule a session?', 'I want to update my medications']
/** Each answer can carry buttons that take the patient straight to the right screen, instead of describing where to tap. */
interface Answer { text: string; links?: [string, string][] }
const answers: Record<string, Answer> = {
  'What happens in Step 3?': { text: 'Step 3 is "Identify Lead Actors". Your provider looks for the sources of your illness and decides which one to treat first. Yours right now are Mold (lead) and Lyme.', links: [['See my Plan of Care', '/patient/plan']] },
  'How do I prepare for a nano bath?': { text: 'Drink water beforehand, avoid a heavy meal in the hour before, and bring a change of clothes. The session lasts 45 minutes. If you feel unwell that day, message the clinic before coming.', links: [['Book a nano bath', '/patient/book'], ['Message the clinic', '/patient/messages']] },
  'When is my next payment?': { text: 'Your next membership payment is $2,000 on Nov 1, charged to the card on file.', links: [['Open payments & receipts', '/patient/payments']] },
  'How do I reschedule a session?': { text: 'I can take you there. Choose the session and pick a new time. Changes less than 12 hours before the session need a call to the office.', links: [['Reschedule a session', '/patient/book']] },
  'I want to update my medications': { text: 'Here is your list. Open an item to change how you are taking it, or add something new.', links: [['Open my medications', '/patient/medications']] },
}
const fallback: Answer = { text: 'I can help with questions about your program, your sessions, payments and how to use this app. For anything about your symptoms or treatment, a person on your care team should answer.', links: [['Talk to a person', '/patient/messages'], ['Report a flare or crash', '/patient/crash']] }

export default function Assistant() {
  const [msgs, setMsgs] = useState<{ who: 'me' | 'ai'; text: string; links?: [string, string][] }[]>([{ who: 'ai', text: 'Hi Marisol. Ask me anything about your program, your sessions or this app.' }])
  const [text, setText] = useState('')
  const ask = (q: string) => { if (!q.trim()) return; setMsgs((m) => [...m, { who: 'me', text: q.trim() }, { who: 'ai', ...(answers[q.trim()] ?? fallback) }]); setText('') }
  return (
    <PhoneFrame>
      <PatientTopBar title="Ask Helixona" back={<Link to="/patient/home" className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></Link>} />
      <div className="flex flex-1 flex-col px-5 pb-5">
        <p className="rounded-xl bg-sand-100 px-3 py-2 text-xs leading-relaxed text-sand-600">An AI assistant, not a clinician. It does not give medical advice and nobody reads this chat live. In an emergency call 911.</p>
        <div className="mt-3 flex-1 space-y-2.5">
          {msgs.map((m, i) => <div key={i} className={`flex ${m.who === 'me' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed ${m.who === 'me' ? 'bg-sand-900 text-white' : 'border border-sand-200 bg-white text-sand-800'}`}>{m.who === 'ai' && <Sparkles size={13} className="mb-1 text-teal-600" />}{m.text}{m.links && <span className="mt-2 flex flex-wrap gap-1.5">{m.links.map(([l, to]) => <Link key={l} to={to} className="inline-flex items-center gap-1 rounded-full bg-sand-900 px-3 py-1.5 text-xs font-semibold text-white">{l} <ArrowRight size={12} /></Link>)}</span>}</div></div>)}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">{suggestions.map((q) => <button key={q} onClick={() => ask(q)} className="rounded-full border border-sand-300 bg-white px-3 py-1.5 text-xs text-sand-700 hover:border-teal-400">{q}</button>)}</div>
        <form onSubmit={(e) => { e.preventDefault(); ask(text) }} className="mt-3 flex gap-2"><input className="input text-[16px]" placeholder="Ask anything…" data-mic="on" value={text} onChange={(e) => setText(e.target.value)} /><button type="submit" aria-label="Send" disabled={!text.trim()} className="btn-primary px-4"><Send size={16} /></button></form>
        <Link to="/patient/messages" className="btn-secondary mt-3 w-full"><UserRound size={15} /> Switch to a person at the clinic</Link>
        <CallClinic className="mt-2" />
      </div>
    </PhoneFrame>
  )
}
