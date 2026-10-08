import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, CreditCard, Lock, ShieldCheck } from 'lucide-react'
import { PhoneFrame, PatientTopBar } from '../../../components/PhoneFrame'
import { SignaturePad } from '../../../components/SignaturePad'
import { Notice, Pill, Row, ToConfirm, VersionTag } from '../../../components/ui'

/** Demo: the patient is in "Program offered", which is the only status that unlocks this flow. */
export default function Agreement() {
  const nav = useNavigate()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [sig, setSig] = useState<{ method: 'Typed' | 'Drawn'; value: string } | null>(null)
  const [agree, setAgree] = useState(false)
  const [method, setMethod] = useState<'card' | 'ach'>('card')

  return (
    <PhoneFrame>
      <PatientTopBar title={step === 1 ? 'Membership agreement' : step === 2 ? 'Payment setup' : 'All set'} back={<Link to="/patient/home" className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></Link>} right={<span className="text-xs text-sand-500">Step {step} of 3</span>} />
      <div className="px-5 pb-8">
        {step === 1 && (
          <>
            <div className="mb-3 flex items-center gap-2"><Pill tone="teal">Program offered · Oct 6</Pill><VersionTag>Agreement v1.4</VersionTag></div>
            <h1 className="font-display text-2xl font-semibold text-sand-900">Your nine-month membership</h1>
            <div className="card mt-4 p-4 text-sm">
              <Row label="Monthly amount">$2,000</Row>
              <Row label="Term">9 months · Nov 1, 2026 → Jul 31, 2027</Row>
              <Row label="Charged on">The 1st of each month (your start date)</Row>
              <Row label="Includes">Program modalities in your Plan of Care</Row>
              <Row label="Not included">Insurance visits, labs, IV (billed to insurance)</Row>
              <Row label="After Month 9">Continue month-to-month only if you and Dr. D. agree</Row>
            </div>
            <article className="card mt-4 max-h-72 overflow-y-auto p-4 text-sm leading-relaxed text-sand-700">
              <p className="rounded-lg bg-plum-100/60 px-3 py-2 text-xs text-plum-600"><strong>Placeholder text.</strong> The attorney-approved membership agreement and payment authorization appear here word for word.</p>
              {Array.from({ length: 5 }).map((_, i) => <p key={i} className="mt-3"><strong>{i + 1}. Section.</strong> Placeholder language describing the membership, the recurring payment authorization, cancellation and revocation instructions, refunds, and how to contact Helixona. Nothing here is binding.</p>)}
              <div className="mt-3"><ToConfirm>final agreement, retry and refund terms (Karina + attorney)</ToConfirm></div>
            </article>
            <label className="mt-4 flex items-start gap-3 rounded-xl border border-sand-300 bg-white p-3.5 text-[15px]"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-5 w-5 accent-teal-600" /><span>I have read the agreement and authorize recurring monthly payments of $2,000 as described.</span></label>
            <div className="mt-3"><SignaturePad onChange={setSig} /></div>
            <div className="mt-2 text-xs text-sand-500">Signing as Marisol Andrade · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · Agreement v1.4 · Payment authorization v1.1</div>
            <button disabled={!sig || !agree} onClick={() => setStep(2)} className="btn-primary btn-lg mt-4 w-full">Sign and continue to payment</button>
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="font-display text-2xl font-semibold text-sand-900">Set up your payment</h1>
            <p className="mt-1 text-sm text-sand-600">Handled securely by Stripe. Helixona never sees or stores your card or bank numbers.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => setMethod('card')} className={`card flex flex-col items-center gap-1 p-4 ${method === 'card' ? 'border-teal-500 bg-teal-50' : ''}`}><CreditCard size={22} className="text-teal-700" /><span className="font-semibold">Card</span></button>
              <button onClick={() => setMethod('ach')} className={`card flex flex-col items-center gap-1 p-4 ${method === 'ach' ? 'border-teal-500 bg-teal-50' : ''}`}><Building2 size={22} className="text-teal-700" /><span className="font-semibold">Bank account (ACH)</span></button>
            </div>
            <div className="card mt-4 p-4">
              <div className="mb-3 flex items-center justify-between text-xs text-sand-500"><span className="flex items-center gap-1"><Lock size={12} /> Secure form by Stripe</span><span>stripe.com</span></div>
              {method === 'card' ? (
                <div className="space-y-3"><input className="input" placeholder="Card number" /><div className="grid grid-cols-2 gap-3"><input className="input" placeholder="MM / YY" /><input className="input" placeholder="CVC" /></div><input className="input" placeholder="Name on card" /><input className="input" placeholder="ZIP" /></div>
              ) : (
                <div className="space-y-3"><input className="input" placeholder="Routing number" /><input className="input" placeholder="Account number" /><input className="input" placeholder="Account holder name" /><p className="text-xs text-sand-500">By continuing you authorize Helixona to debit this account monthly per the signed agreement. You'll get a copy of this authorization.</p></div>
              )}
            </div>
            <div className="card mt-4 p-4 text-sm"><Row label="First payment">$2,000 on Nov 1, 2026</Row><Row label="Then">$2,000 on the 1st, 8 more times</Row><Row label="Reminder">3 days before each charge</Row></div>
            <button onClick={() => setStep(3)} className="btn-primary btn-lg mt-5 w-full">Authorize recurring payments</button>
          </>
        )}
        {step === 3 && (
          <div className="pt-6 text-center">
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-ok-100 text-ok-700"><ShieldCheck size={36} /></span>
            <h1 className="mt-5 font-display text-[26px] font-semibold text-sand-900">Welcome to the program</h1>
            <p className="mt-2 text-sand-600">Your agreement and payment authorization are signed. Copies are on their way to your email.</p>
            <div className="card mt-6 p-4 text-left text-sm"><Row label="Membership starts">Nov 1, 2026</Row><Row label="Payment method">{method === 'card' ? 'Card •••• 4242' : 'Bank account •••• 6789'}</Row><Row label="Status"><Pill tone="ok">Active member</Pill></Row></div>
            <div className="mt-4 text-left"><Notice tone="info">You can now book sessions in your Plan of Care and you'll receive short check-ins after treatments.</Notice></div>
            <button onClick={() => nav('/patient/payments')} className="btn-primary btn-lg mt-6 w-full">See my payment schedule</button>
            <Link to="/patient/book" className="btn-secondary btn-lg mt-2 w-full">Book my first session</Link>
          </div>
        )}
      </div>
    </PhoneFrame>
  )
}
