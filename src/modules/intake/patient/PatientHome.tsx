import { Link } from 'react-router-dom'
import { Calendar, ClipboardList, CreditCard, FileCheck2, HeartPulse, Lock } from 'lucide-react'
import { PhoneFrame, Wordmark } from '../../../components/PhoneFrame'
import { MonitoringNotice, Pill } from '../../../components/ui'

export default function PatientHome() {
  return (
    <PhoneFrame>
      <div className="px-5 pt-12 pb-8">
        <div className="flex items-center justify-between"><Wordmark size="sm" /><span className="text-xs text-sand-500">Marisol A.</span></div>
        <h1 className="mt-6 font-display text-[26px] font-semibold text-sand-900">Good evening, Marisol</h1>
        <p className="text-sand-600">You're in <strong>Month 0 — Assessment</strong>.</p>

        <div className="card mt-5 overflow-hidden">
          <div className="bg-teal-800 px-4 py-3 text-white">
            <div className="text-xs text-teal-200">Your next step</div>
            <div className="font-semibold">Add the missing pages of your lab report</div>
          </div>
          <div className="p-4 text-sm text-sand-600">Ana asked for pages 3–4 of your Quest report (lipid panel). Everything else is complete.
            <Link to="/patient/uploads" className="btn-primary mt-3 w-full">Upload now</Link>
          </div>
        </div>

        <div className="mt-6 eyebrow">Your program</div>
        <ul className="mt-2 grid grid-cols-2 gap-2">
          <Tile to="/patient/intake" icon={<ClipboardList size={20} />} label="Questionnaire" status="Submitted" tone="ok" />
          <Tile to="/patient/forms" icon={<FileCheck2 size={20} />} label="Signed forms" status="4 of 5" tone="warn" />
          <Tile icon={<Calendar size={20} />} label="Assessment visit" status="Not yet scheduled" tone="neutral" />
          <Tile icon={<CreditCard size={20} />} label="Month 0 fee" status="Due at scheduling" tone="neutral" />
        </ul>

        <div className="mt-6 eyebrow">Later in your program</div>
        <ul className="mt-2 space-y-2">
          {[['Check-in surveys', 'After each treatment session'], ['Report a crash or flare', 'Anytime, reviewed during clinic hours'], ['Book sessions', 'Once your Plan of Care is set']].map(([t, d]) => (
            <li key={t} className="card flex items-center gap-3 p-3.5 opacity-70">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand-100 text-sand-400"><Lock size={15} /></span>
              <span className="flex-1"><span className="block font-semibold text-sand-800">{t}</span><span className="block text-xs text-sand-500">{d}</span></span>
              <Pill dot={false}>Soon</Pill>
            </li>
          ))}
        </ul>
        <div className="mt-6"><MonitoringNotice /></div>
        <div className="mt-4 flex items-center justify-center gap-1 text-xs text-sand-500"><HeartPulse size={12} /> Helixona · Irvine, CA · (949) 555-0100</div>
      </div>
    </PhoneFrame>
  )
}

function Tile({ to, icon, label, status, tone }: { to?: string; icon: React.ReactNode; label: string; status: string; tone: 'ok' | 'warn' | 'neutral' }) {
  const inner = (
    <div className="card h-full p-3.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-teal-700">{icon}</span>
      <div className="mt-3 font-semibold text-sand-900 text-[15px]">{label}</div>
      <div className="mt-1"><Pill tone={tone} dot={false}>{status}</Pill></div>
    </div>
  )
  return <li>{to ? <Link to={to} className="block h-full hover:-translate-y-px transition-transform">{inner}</Link> : inner}</li>
}
