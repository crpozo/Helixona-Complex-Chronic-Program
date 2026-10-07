import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, MessageSquareText, Send } from 'lucide-react'
import { Breadcrumb, Card, Field, Notice, PageHeader, Pill, ToConfirm } from '../../../components/ui'
import { inquiries } from '../../../mock/inquiries'

export default function CreatePatient() {
  const nav = useNavigate()
  const [sp] = useSearchParams()
  const inquiry = inquiries.find((i) => i.id === sp.get('inquiry'))
  const [first, last] = (inquiry?.name ?? ' ').split(' ')
  const [form, setForm] = useState({ first: first ?? '', last: last ?? '', dob: '', phone: '', email: '', ecwId: '', method: 'Magic link', channels: { email: true, sms: true }, expires: '14' })
  const [sent, setSent] = useState(false)
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }))

  if (sent) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Patients', to: '/staff/patients' }, { label: 'New patient' }]} />
        <div className="mx-auto max-w-xl">
          <Card>
            <div className="text-center py-4">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ok-100 text-ok-700"><Send size={24} /></span>
              <h2 className="mt-3 text-xl font-semibold">Invitation sent to P-0047</h2>
              <p className="mt-1 text-sand-600">{form.first} {form.last} will receive a secure link by {form.channels.email && form.channels.sms ? 'email and text' : form.channels.email ? 'email' : 'text'}. It expires in {form.expires} days. You'll see each step here: sent → delivered → opened → started → submitted.</p>
              <div className="mt-4 flex justify-center gap-2"><Pill tone="teal">Sent · just now</Pill><Pill tone="neutral">Registry: Accepted for Month 0</Pill></div>
              <div className="mt-6 flex justify-center gap-2"><Link to="/staff/patients" className="btn-secondary">Back to patients</Link><button onClick={() => nav('/staff/patients/P-0045')} className="btn-primary">Open a sample record</button></div>
            </div>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Patients', to: '/staff/patients' }, { label: 'Create patient record' }]} />
      <PageHeader eyebrow="Intake · Patient advisor" title="Create patient record & send invitation" description="Patients never self-enroll. Create the record after the qualification interview and admissions decision, then send a secure invitation." />
      {inquiry && <div className="mb-4"><Notice tone="teal" title={`Pre-filled from inquiry ${inquiry.id}`}>{inquiry.pathway} · {inquiry.source} · received {inquiry.receivedAt}. Source and pathway are kept on the patient record.</Notice></div>}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <Card title="Patient" subtitle="Identity details used to match the eCW chart and confirm the patient during intake.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" required><input className="input" value={form.first} onChange={(e) => set('first', e.target.value)} /></Field>
              <Field label="Last name" required><input className="input" value={form.last} onChange={(e) => set('last', e.target.value)} /></Field>
              <Field label="Date of birth" required><input type="date" className="input" value={form.dob} onChange={(e) => set('dob', e.target.value)} /></Field>
              <Field label="eCW chart number" hint="Leave blank if the chart doesn't exist yet; Charlene will add it."><input className="input" placeholder="ECW-…" value={form.ecwId} onChange={(e) => set('ecwId', e.target.value)} /></Field>
              <Field label="Mobile phone" required><input className="input" placeholder="(949) 555-0100" value={form.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
              <Field label="Email" required><input className="input" placeholder="name@example.com" value={form.email} onChange={(e) => set('email', e.target.value)} /></Field>
            </div>
          </Card>
          <Card title="Invitation" subtitle="How the patient confirms their identity and opens their intake.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Verification method">
                <div className="flex gap-2">{['Magic link', 'Code'].map((m) => <button key={m} onClick={() => set('method', m)} className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium ${form.method === m ? 'border-teal-500 bg-teal-50 text-teal-900' : 'border-sand-300 bg-white'}`}>{m === 'Magic link' ? 'Secure email link' : 'Texted 6-digit code'}</button>)}</div>
                <div className="mt-2"><ToConfirm>final method recommended by Carlos</ToConfirm></div>
              </Field>
              <Field label="Expires after">
                <select className="input" value={form.expires} onChange={(e) => set('expires', e.target.value)}><option value="7">7 days</option><option value="14">14 days</option><option value="30">30 days</option></select>
              </Field>
              <Field label="Send by">
                <div className="flex gap-2">
                  <label className={`flex flex-1 items-center gap-2 rounded-xl border px-3 py-2.5 text-sm ${form.channels.email ? 'border-teal-500 bg-teal-50' : 'border-sand-300'}`}><input type="checkbox" className="accent-teal-600" checked={form.channels.email} onChange={(e) => set('channels', { ...form.channels, email: e.target.checked })} /><Mail size={15} /> Email</label>
                  <label className={`flex flex-1 items-center gap-2 rounded-xl border px-3 py-2.5 text-sm ${form.channels.sms ? 'border-teal-500 bg-teal-50' : 'border-sand-300'}`}><input type="checkbox" className="accent-teal-600" checked={form.channels.sms} onChange={(e) => set('channels', { ...form.channels, sms: e.target.checked })} /><MessageSquareText size={15} /> Text</label>
                </div>
              </Field>
              <Field label="Assigned package" hint="Set by the program configuration; shown for transparency.">
                <div className="flex flex-wrap gap-1.5 pt-1"><Pill tone="teal" dot={false}>Questionnaire v3</Pill><Pill tone="teal" dot={false}>Document uploads</Pill><Pill tone="teal" dot={false}>5 forms</Pill></div>
              </Field>
            </div>
          </Card>
        </div>
        <div className="space-y-5">
          <Card title="Message preview" subtitle="Nothing patient-identifying appears in the text or email.">
            <div className="rounded-xl bg-sand-100 p-3 text-sm text-sand-700">
              <div className="eyebrow mb-1">Text message</div>
              Helixona: You've been invited to begin your intake. Open your secure link: hlx.care/i/8f2k. Expires in {form.expires} days. Reply STOP to opt out.
            </div>
            <div className="mt-3 rounded-xl bg-sand-100 p-3 text-sm text-sand-700">
              <div className="eyebrow mb-1">Email · subject</div>
              Your Helixona intake is ready
            </div>
            <p className="help mt-3">Template “Invitation · v2” · edited in Message templates (Priority 3).</p>
          </Card>
          <Card title="Before you send">
            <ul className="space-y-2 text-sm text-sand-700">
              <li className="flex gap-2"><span className="text-ok-600">✓</span> Advisor interview recorded</li>
              <li className="flex gap-2"><span className="text-ok-600">✓</span> Admissions outcome: Accepted for Month 0</li>
              <li className="flex gap-2"><span className="text-warn-600">•</span> Insurance review summary (Karina) — optional before invitation</li>
            </ul>
            <button onClick={() => setSent(true)} className="btn-primary mt-4 w-full"><Send size={16} /> Create record & send invitation</button>
            <button onClick={() => nav('/staff/patients')} className="btn-ghost mt-1 w-full">Cancel</button>
          </Card>
        </div>
      </div>
    </>
  )
}
