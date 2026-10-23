import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, HeartPulse, Mail, PhoneCall, Sparkles } from 'lucide-react'
import { PhoneFrame, Wordmark } from '../../components/PhoneFrame'
import { Choice, Field, Notice } from '../../components/ui'

type Path = 'chronic' | 'optimization'

/** Public "Become a patient" flow from helixona.com. Replaces the Typeform (meeting of Oct 20, 2026). */
export default function BecomePatient() {
  const [path, setPath] = useState<Path>()
  const [step, setStep] = useState<'choose' | 'form' | 'done'>('choose')
  const [f, setF] = useState<Record<string, string>>({})
  const set = (k: string, v: string) => setF((x) => ({ ...x, [k]: v }))

  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col">
        <div className="bg-teal-800 px-6 pt-12 pb-8 text-white">
          <Wordmark light size="md" />
          <h1 className="mt-5 font-display text-[28px] leading-[1.1] font-semibold">{step === 'done' ? 'Thank you' : 'Become a patient'}</h1>
          <p className="mt-2 text-teal-100 text-[15px]">{step === 'choose' ? 'Two ways to start. Choose the one that sounds like you.' : step === 'form' ? (path === 'chronic' ? 'Complex Chronic Program · a few questions so we can schedule your screening call.' : 'Health Optimization · a few details and you can begin right away.') : ''}</p>
        </div>
        <div className="-mt-4 flex-1 rounded-t-3xl bg-white px-5 pt-6 pb-8">
          {step === 'choose' && (
            <div className="space-y-3">
              <button onClick={() => { setPath('chronic'); setStep('form') }} className="card w-full p-4 text-left hover:border-teal-300">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-700"><HeartPulse size={20} /></span>
                <span className="mt-3 block font-display text-xl font-semibold text-sand-900">Is your health struggling and you're looking for answers?</span>
                <span className="mt-1 block text-sm text-sand-600">Our Complex Chronic Program: a nine-month, physician-led program for persistent fatigue, autoimmune challenges, Lyme, mold, long COVID and other complex conditions. Starts with a short screening call.</span>
              </button>
              <button onClick={() => { setPath('optimization'); setStep('form') }} className="card w-full p-4 text-left hover:border-teal-300">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-700"><Sparkles size={20} /></span>
                <span className="mt-3 block font-display text-xl font-semibold text-sand-900">Feeling good and looking for ways to be even better?</span>
                <span className="mt-1 block text-sm text-sand-600">Health Optimization: nurse practitioner visits, diagnostics and therapies to elevate wellness, vitality and longevity. You get your secure link right away.</span>
              </button>
              <p className="pt-2 text-center text-xs text-sand-500">Just want to book a salt room, nano bath or red light session? <Link to="/public/book" className="text-teal-700 underline">Book a treatment</Link> instead.</p>
            </div>
          )}

          {step === 'form' && path && (
            <div className="space-y-4">
              <button onClick={() => setStep('choose')} className="btn-ghost px-0 text-sm"><ArrowLeft size={15} /> Change path</button>
              <Field label="First and last name" required><input className="input text-[16px]" value={f.name ?? ''} onChange={(e) => set('name', e.target.value)} /></Field>
              <Field label="Mobile phone" required><input className="input text-[16px]" value={f.phone ?? ''} onChange={(e) => set('phone', e.target.value)} /></Field>
              <Field label="Email" required><input className="input text-[16px]" value={f.email ?? ''} onChange={(e) => set('email', e.target.value)} /></Field>
              {path === 'chronic' ? (
                <>
                  <Field label="What are the main health concerns you need help with?" required><textarea rows={3} className="input text-[16px]" value={f.reason ?? ''} onChange={(e) => set('reason', e.target.value)} /></Field>
                  <Field label="Do you have PPO insurance?" required><div className="grid grid-cols-3 gap-2">{['Yes', 'No', 'Not sure'].map((o) => <Choice key={o} label={o} selected={f.ppo === o} onClick={() => set('ppo', o)} />)}</div></Field>
                  <Field label="Are you able to come to our Irvine office on a regular basis?" required><div className="grid grid-cols-3 gap-2">{['Yes', 'Sometimes', 'No'].map((o) => <Choice key={o} label={o} selected={f.office === o} onClick={() => set('office', o)} />)}</div></Field>
                  <Field label="How did you hear about us?"><input className="input text-[16px]" value={f.source ?? ''} onChange={(e) => set('source', e.target.value)} /></Field>
                  <Notice tone="info">A patient advisor will call you for a short screening call before sending your full health questionnaire, so you only complete it if the program is a fit.</Notice>
                </>
              ) : (
                <>
                  <Field label="What are you looking for?" required><div className="space-y-2">{['Provider visit to build an optimization plan', 'Diagnostics and lab work', 'Therapies (IV, red light, nano bath, salt room…)', 'Not sure yet'].map((o) => <Choice key={o} label={o} selected={f.goal === o} onClick={() => set('goal', o)} />)}</div></Field>
                  <Field label="How did you hear about us?"><input className="input text-[16px]" value={f.source ?? ''} onChange={(e) => set('source', e.target.value)} /></Field>
                  <Notice tone="info">No waiting: we email your secure link immediately so you can complete the short Health Optimization questionnaire and book.</Notice>
                </>
              )}
              <button disabled={!f.name || !f.phone || !f.email} onClick={() => setStep('done')} className="btn-primary btn-lg w-full">{path === 'chronic' ? 'Request my screening call' : 'Send my secure link'}</button>
            </div>
          )}

          {step === 'done' && path === 'chronic' && (
            <div className="pt-4 text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-700"><PhoneCall size={28} /></span>
              <h2 className="mt-4 text-xl font-semibold text-sand-900">We'll call you within one business day</h2>
              <p className="mt-2 text-sand-600">A patient advisor will reach out to {f.phone || 'your phone'} for a short screening call. If the Complex Chronic Program is a fit, you'll receive a secure link to your health questionnaire right after.</p>
              <div className="card mt-5 p-4 text-left text-sm text-sand-600"><div className="eyebrow mb-1">In the app</div>Your inquiry appears in the advisor's queue as <strong>Inquiry received · Complex Chronic</strong>.</div>
              <Link to="/staff/inquiries" className="btn-secondary btn-lg mt-6 w-full">See the staff side (demo)</Link>
            </div>
          )}
          {step === 'done' && path === 'optimization' && (
            <div className="pt-4 text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-700"><Mail size={28} /></span>
              <h2 className="mt-4 text-xl font-semibold text-sand-900">Check your email</h2>
              <p className="mt-2 text-sand-600">We sent your secure link to <strong>{f.email || 'your email'}</strong>. It opens your Health Optimization questionnaire; your patient record is created automatically.</p>
              <Link to="/patient/invite" className="btn-primary btn-lg mt-6 w-full">Open the link (demo)</Link>
            </div>
          )}
        </div>
      </div>
    </PhoneFrame>
  )
}
