import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Mail, MessageCircle, Send } from 'lucide-react'
import { PhoneFrame, PatientTopBar } from '../../../components/PhoneFrame'
import { Field, MonitoringNotice } from '../../../components/ui'

/** Direct line to the clinic: a chat thread and an email form. Both land with the care team and are answered
 *  during office hours; both are logged on the patient record. */
export default function Messages() {
  const [tab, setTab] = useState<'chat' | 'email'>('chat')
  const [thread, setThread] = useState<{ who: 'me' | 'clinic'; name?: string; text: string; when: string }[]>([
    { who: 'clinic', name: 'Ana · patient advisor', text: 'Hi Marisol, we still need pages 3–4 of your Quest report. You can upload them from your home screen.', when: 'Oct 7 · 2:20 PM' },
    { who: 'me', text: 'Thanks, I will upload them tonight.', when: 'Oct 7 · 2:41 PM' },
  ])
  const [text, setText] = useState('')
  const [mail, setMail] = useState({ topic: 'Scheduling', subject: '', body: '' })
  const [sent, setSent] = useState<{ subject: string; topic: string; when: string }[]>([{ subject: 'Question about my A&P visit', topic: 'Scheduling', when: 'Oct 2 · answered Oct 3' }])
  const now = () => new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).replace(', ', ' · ')
  const send = () => { if (!text.trim()) return; setThread((t) => [...t, { who: 'me', text: text.trim(), when: now() }]); setText('') }
  return (
    <PhoneFrame>
      <PatientTopBar title="Message the clinic" back={<Link to="/patient/home" className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></Link>} />
      <div className="flex flex-1 flex-col px-5 pb-6">
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-sand-100 p-1" role="tablist">{([['chat', 'Chat', MessageCircle], ['email', 'Email', Mail]] as const).map(([k, l, I]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium ${tab === k ? 'bg-white text-sand-900 shadow-sm' : 'text-sand-600'}`}><I size={15} />{l}</button>)}</div>
        <p className="mt-3 text-xs text-sand-500">Answered by your care team Monday to Friday, 8 AM to 5 PM. Usually within one business day.</p>

        {tab === 'chat' && <>
          <div className="mt-3 flex-1 space-y-2.5">
            {thread.map((m, i) => <div key={i} className={`flex ${m.who === 'me' ? 'justify-end' : 'justify-start'}`}><div className="max-w-[85%]">{m.name && <div className="mb-0.5 text-[11px] text-sand-500">{m.name}</div>}<div className={`rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed ${m.who === 'me' ? 'bg-sand-900 text-white' : 'border border-sand-200 bg-white text-sand-800'}`}>{m.text}</div><div className={`mt-0.5 text-[11px] text-sand-400 ${m.who === 'me' ? 'text-right' : ''}`}>{m.when}{m.who === 'me' && ' · sent'}</div></div></div>)}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send() }} className="mt-3 flex gap-2"><input className="input text-[16px]" placeholder="Write a message…" value={text} onChange={(e) => setText(e.target.value)} /><button type="submit" aria-label="Send" disabled={!text.trim()} className="btn-primary px-4"><Send size={16} /></button></form>
        </>}

        {tab === 'email' && <div className="mt-3 space-y-4">
          <Field label="What is it about?"><select className="input text-[16px]" value={mail.topic} onChange={(e) => setMail({ ...mail, topic: e.target.value })}>{['Scheduling', 'Billing', 'My documents', 'My plan of care', 'Something else'].map((t) => <option key={t}>{t}</option>)}</select></Field>
          <Field label="Subject" required><input className="input text-[16px]" value={mail.subject} onChange={(e) => setMail({ ...mail, subject: e.target.value })} /></Field>
          <Field label="Message" required><textarea rows={5} className="input text-[16px]" value={mail.body} onChange={(e) => setMail({ ...mail, body: e.target.value })} /></Field>
          <button disabled={!mail.subject.trim() || !mail.body.trim()} onClick={() => { setSent([{ subject: mail.subject, topic: mail.topic, when: `${now()} · sent` }, ...sent]); setMail({ ...mail, subject: '', body: '' }) }} className="btn-primary btn-lg w-full"><Mail size={16} /> Send email</button>
          <div><div className="eyebrow">Your emails</div><ul className="mt-2 space-y-2">{sent.map((s, i) => <li key={i} className="card flex items-center gap-3 p-3"><Check size={15} className="shrink-0 text-ok-700" /><span className="flex-1"><span className="block text-sm font-semibold text-sand-900">{s.subject}</span><span className="block text-xs text-sand-500">{s.topic} · {s.when}</span></span></li>)}</ul></div>
        </div>}
        <div className="mt-4"><MonitoringNotice /></div>
      </div>
    </PhoneFrame>
  )
}
