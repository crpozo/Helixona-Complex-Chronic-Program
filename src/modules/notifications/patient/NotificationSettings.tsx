import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BellRing, ChevronRight, FileSignature, Mail, MessageSquare, Receipt, Users } from 'lucide-react'
import { PhoneFrame, PatientTopBar } from '../../../components/PhoneFrame'

/** Patient notification preferences: which channel carries each kind of message. Required notices (care-team
 *  replies, payment problems) can be moved between channels but not switched off entirely. */
const kinds: { key: string; label: string; descr: string; required?: boolean }[] = [
  { key: 'reminders', label: 'Appointment reminders', descr: 'The day before and 2 hours before a session' },
  { key: 'checkins', label: 'Daily check-in reminder', descr: 'Each morning at 8:00 AM' },
  { key: 'followups', label: 'Treatment follow-ups', descr: '1, 3 and 7 days after a session' },
  { key: 'care', label: 'Messages from your care team', descr: 'Replies and follow-up on your reports', required: true },
  { key: 'billing', label: 'Receipts and payment notices', descr: 'Monthly receipt, card expiring, failed payment', required: true },
]

export default function NotificationSettings() {
  const [email, setEmail] = useState(true)
  const [sms, setSms] = useState(true)
  const [push, setPush] = useState(false)
  const [per, setPer] = useState<Record<string, { email: boolean; sms: boolean; push: boolean }>>(Object.fromEntries(kinds.map((k) => [k.key, { email: true, sms: k.key !== 'billing', push: true }])))
  const [saved, setSaved] = useState(false)
  const set = (k: string, ch: 'email' | 'sms' | 'push', v: boolean) => { setPer({ ...per, [k]: { ...per[k], [ch]: v } }); setSaved(false) }

  return (
    <PhoneFrame>
      <PatientTopBar title="Settings" back={<Link to="/patient/home" className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></Link>} />
      <div className="px-5 pb-8">
        <h1 className="font-display text-2xl font-semibold text-sand-900">Settings</h1>
        <div className="mt-4 eyebrow">My account</div>
        <ul className="mt-2 card divide-y divide-sand-200">{([
          ['/patient/agreement', 'Membership agreement & payment', 'Available once your program is offered', <FileSignature size={17} />],
          ['/patient/payments', 'Payments & receipts', 'Next: $2,000 on Nov 1', <Receipt size={17} />],
          ['/patient/sharing', 'Share with someone who helps me', 'Sharing with 1 person', <Users size={17} />],
        ] as [string, string, string, React.ReactNode][]).map(([to, t, d, icon]) => <li key={t}><Link to={to} className="flex items-center gap-3 px-4 py-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">{icon}</span><span className="flex-1"><span className="block font-semibold text-sand-800">{t}</span><span className="block text-xs text-sand-500">{d}</span></span><ChevronRight size={16} className="text-sand-400" /></Link></li>)}</ul>

        <h2 className="mt-7 font-display text-xl font-semibold text-sand-900">How should we reach you?</h2>
        <p className="mt-1 text-[15px] text-sand-600">Choose where each kind of message goes. Messages never include your health details; they tell you something is waiting in the app.</p>

        <div className="mt-5 eyebrow">Channels</div>
        <div className="mt-2 space-y-2">
          <ChannelRow icon={<Mail size={18} />} label="Email" descr="marisol.a@example.com" on={email} onChange={(v) => { setEmail(v); setSaved(false) }} />
          <ChannelRow icon={<BellRing size={18} />} label="App notifications" descr="Optional · alerts on this phone when something is waiting" on={push} onChange={(v) => { setPush(v); setSaved(false) }} />
          <ChannelRow icon={<MessageSquare size={18} />} label="Text message" descr="(949) ••• ••42 · Reply STOP to opt out anytime" on={sms} onChange={(v) => { setSms(v); setSaved(false) }} />
        </div>

        <div className="mt-6 eyebrow">What you receive</div>
        <div className="mt-2 card divide-y divide-sand-200">
          <div className="grid grid-cols-[1fr_48px_48px_48px] items-end gap-1.5 px-4 pt-3 pb-2 text-[10px] uppercase tracking-[0.1em] text-sand-500"><span /><span className="text-center">Email</span><span className="text-center">Text</span><span className="text-center">App</span></div>
          {kinds.map((k) => (
            <div key={k.key} className="grid grid-cols-[1fr_48px_48px_48px] items-center gap-1.5 px-4 py-3">
              <div><div className="text-[15px] font-semibold text-sand-900">{k.label}</div><div className="text-xs text-sand-500">{k.descr}{k.required ? ' · at least one channel' : ''}</div></div>
              <Toggle on={email && per[k.key].email} disabled={!email} onChange={(v) => { if (!v && k.required && !(sms && per[k.key].sms)) return; set(k.key, 'email', v) }} label={`${k.label} by email`} />
              <Toggle on={sms && per[k.key].sms} disabled={!sms} onChange={(v) => { if (!v && k.required && !(email && per[k.key].email)) return; set(k.key, 'sms', v) }} label={`${k.label} by text`} />
              <Toggle on={push && per[k.key].push} disabled={!push} onChange={(v) => set(k.key, 'push', v)} label={`${k.label} in the app`} />
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-sand-500">Messages from your care team and payment notices always reach you on at least one channel.</p>

        <button onClick={() => setSaved(true)} className="btn-primary btn-lg mt-6 w-full">{saved ? 'Saved' : 'Save preferences'}</button>
        {saved && <p className="mt-2 text-center text-xs text-sand-500">Saved just now · you can change this anytime</p>}
      </div>
    </PhoneFrame>
  )
}

function ChannelRow({ icon, label, descr, on, onChange }: { icon: React.ReactNode; label: string; descr: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="card flex items-center gap-3 p-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">{icon}</span>
      <span className="flex-1"><span className="block font-semibold text-sand-800">{label}</span><span className="block text-xs text-sand-500">{descr}</span></span>
      <Toggle on={on} onChange={onChange} label={label} />
    </div>
  )
}

function Toggle({ on, onChange, label, disabled = false }: { on: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} disabled={disabled} onClick={() => onChange(!on)}
      className={`mx-auto flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 disabled:opacity-40 ${on ? 'justify-end bg-ok-600' : 'justify-start bg-sand-300'}`}>
      <span className="block h-6 w-6 rounded-full bg-white shadow" />
    </button>
  )
}
