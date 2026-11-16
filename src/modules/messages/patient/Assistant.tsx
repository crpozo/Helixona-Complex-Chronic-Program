import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Send, Sparkles } from 'lucide-react'
import { PhoneFrame, PatientTopBar } from '../../../components/PhoneFrame'

/** "Ask anything" assistant for the patient. Answers questions about the program, the app and their plan in
 *  plain language. It never gives medical advice and always points to the care team or 911 when it should. */
const suggestions = ['What happens in Step 3?', 'How do I prepare for a nano bath?', 'When is my next payment?', 'How do I reschedule a session?']
const answers: Record<string, string> = {
  'What happens in Step 3?': 'Step 3 is "Identify Lead Actors". Dr. D. looks for the sources of your illness and decides which one to treat first. Yours right now are Mold (lead) and Lyme. You can see every step on your Healing Roadmap.',
  'How do I prepare for a nano bath?': 'Drink water beforehand, avoid a heavy meal in the hour before, and bring a change of clothes. The session lasts 45 minutes. If you feel unwell that day, message the clinic before coming.',
  'When is my next payment?': 'Your next membership payment is $2,000 on Nov 1, charged to the card on file. Receipts are under Payments & receipts.',
  'How do I reschedule a session?': 'Open Book a session, tap the session under Coming up, and choose a new time. Changes less than 12 hours before the session need a call to the office at (949) 257-2644.',
}
const fallback = 'I can help with questions about your program, your sessions, payments and how to use this app. For anything about your symptoms or treatment, please message your care team so a person can answer.'

export default function Assistant() {
  const [msgs, setMsgs] = useState<{ who: 'me' | 'ai'; text: string }[]>([{ who: 'ai', text: 'Hi Marisol. Ask me anything about your program, your sessions or this app.' }])
  const [text, setText] = useState('')
  const ask = (q: string) => { if (!q.trim()) return; setMsgs((m) => [...m, { who: 'me', text: q.trim() }, { who: 'ai', text: answers[q.trim()] ?? fallback }]); setText('') }
  return (
    <PhoneFrame>
      <PatientTopBar title="Ask Helixona" back={<Link to="/patient/home" className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></Link>} />
      <div className="flex flex-1 flex-col px-5 pb-5">
        <p className="rounded-xl bg-sand-100 px-3 py-2 text-xs leading-relaxed text-sand-600">An AI assistant, not a clinician. It does not give medical advice and nobody reads this chat live. In an emergency call 911.</p>
        <div className="mt-3 flex-1 space-y-2.5">
          {msgs.map((m, i) => <div key={i} className={`flex ${m.who === 'me' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed ${m.who === 'me' ? 'bg-sand-900 text-white' : 'border border-sand-200 bg-white text-sand-800'}`}>{m.who === 'ai' && <Sparkles size={13} className="mb-1 text-teal-600" />}{m.text}</div></div>)}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">{suggestions.map((q) => <button key={q} onClick={() => ask(q)} className="rounded-full border border-sand-300 bg-white px-3 py-1.5 text-xs text-sand-700 hover:border-teal-400">{q}</button>)}</div>
        <form onSubmit={(e) => { e.preventDefault(); ask(text) }} className="mt-3 flex gap-2"><input className="input text-[16px]" placeholder="Ask anything…" value={text} onChange={(e) => setText(e.target.value)} /><button type="submit" aria-label="Send" disabled={!text.trim()} className="btn-primary px-4"><Send size={16} /></button></form>
        <Link to="/patient/messages" className="mt-3 text-center text-sm text-teal-700 underline">Talk to a person at the clinic instead</Link>
      </div>
    </PhoneFrame>
  )
}
