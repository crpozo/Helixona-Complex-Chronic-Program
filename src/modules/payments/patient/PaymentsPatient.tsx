import { Link } from 'react-router-dom'
import { ArrowLeft, Download, Receipt } from 'lucide-react'
import { PhoneFrame, PatientTopBar } from '../../../components/PhoneFrame'
import { Pill, Row } from '../../../components/ui'

export default function PaymentsPatient() {
  const schedule = [
    { n: 'Month 0 assessment', date: 'Oct 2, 2026', amount: 1500, status: 'Paid' }, { n: 'Month 1', date: 'Nov 1, 2026', amount: 2000, status: 'Scheduled' }, { n: 'Month 2', date: 'Dec 1, 2026', amount: 2000, status: 'Scheduled' }, { n: 'Month 3', date: 'Jan 1, 2027', amount: 2000, status: 'Scheduled' },
    { n: 'Month 4', date: 'Feb 1, 2027', amount: 2000, status: 'Scheduled' }, { n: 'Month 5', date: 'Mar 1, 2027', amount: 2000, status: 'Scheduled' }, { n: 'Month 6', date: 'Apr 1, 2027', amount: 2000, status: 'Scheduled' }, { n: 'Month 7', date: 'May 1, 2027', amount: 2000, status: 'Scheduled' }, { n: 'Month 8', date: 'Jun 1, 2027', amount: 2000, status: 'Scheduled' }, { n: 'Month 9', date: 'Jul 1, 2027', amount: 2000, status: 'Scheduled' },
  ]
  return (
    <PhoneFrame>
      <PatientTopBar title="Payments" back={<Link to="/patient/home" className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></Link>} />
      <div className="px-5 pb-8">
        <h1 className="font-display text-2xl font-semibold text-sand-900">Your payment schedule</h1>
        <div className="card mt-4 p-4 text-sm"><Row label="Payment method">Card •••• 4242 <button className="ml-2 text-teal-700 underline">Change</button></Row><Row label="Next charge">$2,000 on Nov 1, 2026</Row><Row label="Reminder">Email 3 days before</Row></div>
        <div className="mt-5 eyebrow">Schedule</div>
        <ul className="mt-2 card divide-y divide-sand-100">
          {schedule.map((s) => <li key={s.n} className="flex items-center justify-between px-4 py-3 text-sm"><span><span className="block font-semibold text-sand-900">{s.n}</span><span className="block text-xs text-sand-500">{s.date}{s.n.startsWith('Month 0') ? ' · one-time, separate from membership' : ''}</span></span><span className="flex items-center gap-2"><span className="font-medium">${s.amount.toLocaleString()}</span><Pill tone={s.status === 'Paid' ? 'ok' : 'neutral'} dot={false}>{s.status}</Pill></span></li>)}
        </ul>
        <div className="mt-5 eyebrow">Receipts</div>
        <ul className="mt-2 space-y-2">
          <li className="card flex items-center gap-3 p-3.5 text-sm"><Receipt size={16} className="text-sand-400" /><span className="flex-1"><span className="block font-semibold">Month 0 assessment · $1,500</span><span className="block text-xs text-sand-500">Oct 2, 2026 · Card •••• 7733 · Receipt R-10442</span></span><button className="btn-ghost px-2 py-1 text-xs"><Download size={14} /> PDF</button></li>
          <li className="card flex items-center gap-3 p-3.5 text-sm"><Receipt size={16} className="text-sand-400" /><span className="flex-1"><span className="block font-semibold">Signed agreement & payment authorization</span><span className="block text-xs text-sand-500">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · Agreement v1.4</span></span><button className="btn-ghost px-2 py-1 text-xs"><Download size={14} /> PDF</button></li>
        </ul>
        <p className="mt-5 text-xs text-sand-500">A missed payment never changes your care. If a payment fails, we'll let you know and retry a few days later. Questions: billing@helixona.com.</p>
      </div>
    </PhoneFrame>
  )
}
