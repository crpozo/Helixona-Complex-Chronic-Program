import { Link } from 'react-router-dom'
import { CalendarCheck, CheckCircle2, Mail, Stethoscope, UserRoundCheck } from 'lucide-react'
import { PhoneFrame } from '../../../components/PhoneFrame'

export default function Submitted() {
  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col px-5 pt-16 pb-8">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-ok-100 text-ok-700"><CheckCircle2 size={40} /></span>
        <h1 className="mt-5 text-center font-display text-[28px] font-semibold text-sand-900">Thank you, Marisol</h1>
        <p className="mt-2 text-center text-sand-600">Your intake was submitted on <strong>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</strong>. A copy of your signed documents is on its way to your email.</p>

        <div className="mt-8 eyebrow">What happens next</div>
        <ol className="mt-2 space-y-3">
          {[
            [UserRoundCheck, 'Ana reviews your package', 'Usually within 1 business day. If anything is missing, you\'ll get a text with a link to add it.'],
            [Stethoscope, 'Your chart is prepared', 'Your answers and documents are added to your medical record before your first visit.'],
            [CalendarCheck, 'Your Month 0 assessment', 'Karina will call to schedule your assessment with the Medical Director and confirm the one-time Month 0 fee.'],
            [Mail, 'Stay in touch', 'Questions? Reply to any message from Helixona or call (949) 555-0100 during clinic hours.'],
          ].map(([Icon, t, d], i) => {
            const I = Icon as typeof Mail
            return (
              <li key={i} className="card flex gap-3 p-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700"><I size={18} /></span>
                <span><span className="block font-semibold text-sand-900">{t as string}</span><span className="block text-sm text-sand-500">{d as string}</span></span>
              </li>
            )
          })}
        </ol>
        <Link to="/patient/home" className="btn-primary btn-lg mt-8 w-full">Go to my program</Link>
      </div>
    </PhoneFrame>
  )
}
