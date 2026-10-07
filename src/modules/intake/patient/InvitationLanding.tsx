import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound, Link2, ShieldCheck } from 'lucide-react'
import { PhoneFrame, Wordmark } from '../../../components/PhoneFrame'
import { Pill, ToConfirm } from '../../../components/ui'

export default function InvitationLanding() {
  const nav = useNavigate()
  const [step, setStep] = useState<'landing' | 'verify-link' | 'verify-code' | 'verified'>('landing')
  const [code, setCode] = useState(['', '', '', '', '', ''])

  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col">
        <div className="bg-teal-800 px-6 pt-14 pb-10 text-white">
          <Wordmark light size="md" />
          <h1 className="mt-6 font-display text-[30px] leading-[1.1] font-semibold">You've been invited by Helixona</h1>
          <p className="mt-3 text-teal-100 text-[15px]">Ana, your patient advisor, has set up your private intake for the Complex Chronic Program. It takes about 25 minutes and you can stop and come back anytime.</p>
        </div>

        <div className="-mt-5 flex-1 rounded-t-3xl bg-sand-50 px-5 pt-6 pb-8">
          {step === 'landing' && (
            <>
              <div className="card p-4">
                <div className="eyebrow">Invitation for</div>
                <div className="mt-0.5 text-lg font-semibold text-sand-900">Marisol A.</div>
                <div className="text-sm text-sand-500">Sent Sep 26 · expires Oct 10, 2026</div>
                <div className="mt-3 flex gap-2"><Pill tone="teal">Intake questionnaire</Pill><Pill tone="teal">5 documents to sign</Pill></div>
              </div>
              <p className="mt-6 text-sm text-sand-600 font-medium">First, let's confirm it's you. Choose one:</p>
              <button onClick={() => setStep('verify-link')} className="mt-3 card flex w-full items-center gap-4 p-4 text-left hover:border-teal-300">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Link2 size={22} /></span>
                <span className="flex-1"><span className="block font-semibold text-sand-900">Send me a secure link</span><span className="block text-sm text-sand-500">We'll email a one-tap link to m•••••@example.com</span></span>
              </button>
              <button onClick={() => setStep('verify-code')} className="mt-3 card flex w-full items-center gap-4 p-4 text-left hover:border-teal-300">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><KeyRound size={22} /></span>
                <span className="flex-1"><span className="block font-semibold text-sand-900">Text me a 6-digit code</span><span className="block text-sm text-sand-500">To the phone ending in •0142</span></span>
              </button>
              <div className="mt-6 text-xs text-sand-500 leading-relaxed">
                <ToConfirm>final sign-in method chosen by Carlos</ToConfirm>
                <p className="mt-2">Both options are shown so the team can pick. Your answers are encrypted and only visible to your Helixona care team.</p>
              </div>
            </>
          )}

          {step === 'verify-link' && (
            <div className="text-center pt-6">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-700"><Link2 size={28} /></span>
              <h2 className="mt-4 text-xl font-semibold text-sand-900">Check your email</h2>
              <p className="mt-2 text-sand-600">We sent a secure link to <strong>m•••••@example.com</strong>. Tap it on this phone to continue. The link works once and expires in 30 minutes.</p>
              <button onClick={() => setStep('verified')} className="btn-primary btn-lg mt-8 w-full">I tapped the link (demo)</button>
              <button onClick={() => setStep('landing')} className="btn-ghost mt-2 w-full">Use a code instead</button>
            </div>
          )}

          {step === 'verify-code' && (
            <div className="pt-4">
              <h2 className="text-xl font-semibold text-sand-900">Enter the code we texted you</h2>
              <p className="mt-1 text-sand-600 text-sm">Sent to the phone ending in •0142.</p>
              <div className="mt-6 flex justify-between gap-2">
                {code.map((c, i) => (
                  <input key={i} inputMode="numeric" maxLength={1} value={c}
                    onChange={(e) => { const n = [...code]; n[i] = e.target.value.replace(/\D/g, ''); setCode(n); const next = e.target.nextElementSibling as HTMLInputElement | null; if (e.target.value && next) next.focus() }}
                    className="h-14 w-12 rounded-xl border border-sand-300 bg-white text-center text-2xl font-semibold focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400" />
                ))}
              </div>
              <button onClick={() => setStep('verified')} className="btn-primary btn-lg mt-8 w-full">Continue</button>
              <button className="btn-ghost mt-2 w-full">Resend code</button>
            </div>
          )}

          {step === 'verified' && (
            <div className="text-center pt-6">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ok-100 text-ok-700"><ShieldCheck size={30} /></span>
              <h2 className="mt-4 text-xl font-semibold text-sand-900">Welcome, Marisol</h2>
              <p className="mt-2 text-sand-600">You're verified. Here's what we'll do together:</p>
              <ol className="mt-5 space-y-3 text-left">
                {[['Health questionnaire', 'About 25 minutes · save and return anytime'], ['Upload documents', 'Insurance card, ID, medication list, recent labs'], ['Review and sign 5 forms', 'Takes about 5 minutes']].map(([t, d], i) => (
                  <li key={t} className="card flex items-center gap-3 p-3.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">{i + 1}</span>
                    <span><span className="block font-semibold text-sand-900">{t}</span><span className="block text-sm text-sand-500">{d}</span></span>
                  </li>
                ))}
              </ol>
              <button onClick={() => nav('/patient/intake')} className="btn-primary btn-lg mt-8 w-full">Start the questionnaire</button>
            </div>
          )}
        </div>
      </div>
    </PhoneFrame>
  )
}
