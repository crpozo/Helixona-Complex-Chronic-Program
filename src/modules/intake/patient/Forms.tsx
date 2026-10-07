import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, FileSignature, Lock } from 'lucide-react'
import { PhoneFrame, PatientTopBar } from '../../../components/PhoneFrame'
import { SignaturePad } from '../../../components/SignaturePad'
import { Pill, ToConfirm, VersionTag } from '../../../components/ui'
import { currentPatient } from '../../../mock/patients'
import type { FormItem } from '../../../mock/types'

export default function Forms() {
  const nav = useNavigate()
  const [forms, setForms] = useState<FormItem[]>(currentPatient.forms)
  const [open, setOpen] = useState<FormItem | null>(null)
  const signedCount = forms.filter((f) => f.status === 'signed').length

  const sign = (key: string, method: 'Typed' | 'Drawn') => {
    const now = new Date()
    setForms((fs) => fs.map((f) => (f.key === key ? { ...f, status: 'signed', method, signedAt: now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).replace(',', ' ·') } : f)))
    setOpen(null)
  }

  if (open) return <FormViewer form={open} onBack={() => setOpen(null)} onSign={(m) => sign(open.key, m)} />

  return (
    <PhoneFrame>
      <PatientTopBar title="Forms & consents" back={<Link to="/patient/uploads" className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></Link>} />
      <div className="px-5 pb-8">
        <h1 className="font-display text-2xl font-semibold text-sand-900">Review and sign</h1>
        <p className="mt-1 text-[15px] text-sand-600">{signedCount} of {forms.length} signed. Each document opens fully before you sign. You'll receive a copy of everything by email.</p>
        <div className="mt-3"><ToConfirm>final form list and signers from Shibani</ToConfirm></div>
        <ul className="mt-4 space-y-2">
          {forms.map((f) => (
            <li key={f.key}>
              <button onClick={() => setOpen(f)} className="card flex w-full items-center gap-3 p-3.5 text-left hover:border-teal-300">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${f.status === 'signed' ? 'bg-ok-100 text-ok-700' : 'bg-teal-50 text-teal-700'}`}>{f.status === 'signed' ? <Check size={16} /> : <FileSignature size={16} />}</span>
                <span className="flex-1 min-w-0">
                  <span className="block font-semibold text-sand-900 text-[15px] leading-snug">{f.title}</span>
                  <span className="block text-xs text-sand-500">{f.status === 'signed' ? `Signed ${f.signedAt} · ${f.method}` : `${f.version} · ${f.signer}`}</span>
                </span>
                <Pill tone={f.status === 'signed' ? 'ok' : f.status === 'viewed' ? 'warn' : 'neutral'} dot={false}>{f.status === 'signed' ? 'Signed' : f.status === 'viewed' ? 'Viewed' : 'To sign'}</Pill>
              </button>
            </li>
          ))}
        </ul>
        <button onClick={() => nav('/patient/submitted')} disabled={signedCount < forms.length} className="btn-primary btn-lg mt-6 w-full">{signedCount < forms.length ? `Sign ${forms.length - signedCount} more to submit` : 'Submit my intake'}</button>
        <p className="mt-3 flex items-center justify-center gap-1 text-xs text-sand-500"><Lock size={12} /> Signatures are recorded with your name, the document version, and the time.</p>
      </div>
    </PhoneFrame>
  )
}

function FormViewer({ form, onBack, onSign }: { form: FormItem; onBack: () => void; onSign: (m: 'Typed' | 'Drawn') => void }) {
  const [reachedEnd, setReachedEnd] = useState(false)
  const [sig, setSig] = useState<{ method: 'Typed' | 'Drawn'; value: string } | null>(null)
  const [agree, setAgree] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = endRef.current; if (!el) return
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) setReachedEnd(true) }, { threshold: 0.5 })
    io.observe(el); return () => io.disconnect()
  }, [])

  return (
    <PhoneFrame>
      <PatientTopBar title={form.title} back={<button onClick={onBack} className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></button>} right={<VersionTag>{form.version}</VersionTag>} />
      <div className="px-5 pb-8">
        <article className="card p-4 text-[14px] leading-relaxed text-sand-700">
          <h2 className="font-display text-xl font-semibold text-sand-900">{form.title}</h2>
          <p className="mt-1 text-xs text-sand-500">Helixona · Irvine, California · Document {form.version} · Effective Aug 1, 2026</p>
          <p className="mt-3 rounded-lg bg-plum-100/60 px-3 py-2 text-xs text-plum-600"><strong>Placeholder text.</strong> The approved document supplied by Shibani and reviewed by counsel will appear here, word for word.</p>
          {Array.from({ length: 6 }).map((_, i) => (
            <p key={i} className="mt-3"><strong>{i + 1}. Section heading.</strong> This paragraph stands in for the approved language of this document. It describes the purpose of the form, what the patient is agreeing to, how information is used and protected, and how the patient may ask questions or withdraw consent where applicable. Nothing in this placeholder is binding.</p>
          ))}
          <div ref={endRef} className="mt-4 border-t border-sand-200 pt-3 text-xs text-sand-500">End of document.</div>
        </article>

        <div className={`mt-4 transition-opacity ${reachedEnd ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          {!reachedEnd && <p className="mb-2 text-center text-sm text-sand-500">Scroll to the end of the document to sign.</p>}
          <label className="flex items-start gap-3 rounded-xl border border-sand-300 bg-white p-3.5 text-[15px]">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-5 w-5 accent-teal-600" />
            <span>I have read this document and agree to its terms.</span>
          </label>
          <div className="mt-3"><SignaturePad onChange={setSig} /></div>
          <div className="mt-2 text-xs text-sand-500">Signing as <strong>Marisol Andrade</strong> · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · Document {form.version}{form.signer.includes('staff') ? ' · Helixona will countersign' : ''}</div>
          <button disabled={!sig || !agree} onClick={() => sig && onSign(sig.method)} className="btn-primary btn-lg mt-4 w-full">Sign document</button>
        </div>
      </div>
    </PhoneFrame>
  )
}
