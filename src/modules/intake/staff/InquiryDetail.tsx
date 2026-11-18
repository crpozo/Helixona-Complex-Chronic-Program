import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check, EyeOff, UserCheck, UserPlus } from 'lucide-react'
import { Breadcrumb, Card, Field, Notice, Pill, Row, toneFor } from '../../../components/ui'
import type { Inquiry, InquiryStatus } from '../../../mock/types'
import { addInquiry, currentUser, inquiryById, inquiryStatuses, notify, patchInquiry, useStore } from '../../../mock/store'

/** One inquiry: the data the advisor collects before admission (as listed by the clinic), the internal
 *  assessment, and the status. This is NOT a patient record; accepting it is what adds the person to the patient list. */
const heardWithName = ['Friend', 'Patient', 'Physician', 'Chat board']
const heardOptions = ['Friend', 'Patient', 'Physician', 'Chat board', 'Google search', 'Instagram', 'Facebook', 'Helixona website', 'Event or talk', 'Other']
const seg = (on: boolean) => `flex-1 whitespace-nowrap rounded-xl border px-3 py-2.5 text-sm font-medium ${on ? 'border-teal-500 bg-teal-50 text-sand-900' : 'border-sand-300 bg-white text-sand-600 hover:border-sand-400'}`
function Choice3({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return <div className="flex gap-2">{options.map((o) => <button key={o} type="button" onClick={() => onChange(o)} aria-pressed={value === o} className={seg(value === o)}>{o}</button>)}</div>
}
const Internal = () => <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-plum-100 px-2 py-0.5 text-[11px] font-medium text-plum-600"><EyeOff size={11} /> Internal use only</span>

export default function InquiryDetail() {
  useStore()
  const { id = '' } = useParams()
  const nav = useNavigate()
  const me = currentUser()
  const isNew = id === 'new'
  const inq = isNew ? undefined : inquiryById(id)
  const [f, setF] = useState<Record<string, string>>((): Record<string, string> => inq ? {
    name: inq.name, age: '52', street: '', city: `${inq.city}, ${inq.state}`, phone: '(949) 555-0100', email: `${inq.name.split(' ')[0].toLowerCase()}@example.com`,
    path: inq.pathway === 'Complex Chronic' ? 'chronic' : 'optimization', payer: 'Insurance', insurer: 'Blue Shield PPO', oonDoc: 'Not yet', dedTotal: '3,000', dedMet: '1,250', oopTotal: '8,000', oopMet: '2,400',
    heard: /Referral · Dr/.test(inq.source) ? 'Physician' : /existing patient/.test(inq.source) ? 'Patient' : /Instagram/.test(inq.source) ? 'Instagram' : /Google/.test(inq.source) ? 'Google search' : 'Helixona website', heardName: /Dr\. Patel/.test(inq.source) ? 'Dr. Patel' : '',
    struggling: inq.reason, history: '', howLong: 'More than 2 years', specialists: '4', commit: 'Yes', iv: 'Discuss', submitted: '2026-10-06', screened: '', level: '', priority: '', advisorNotes: '', teamReview: '', decisionDate: '', notified: '', denyReason: '', goal: '', goalOther: '', heardDetails: '',
  } : { path: '', payer: '', commit: '', iv: '', heard: '', submitted: '2026-10-09', oonDoc: 'Not yet' })
  const set = (k: string, v: string) => setF((x) => ({ ...x, [k]: v }))
  const status: InquiryStatus = inq?.status ?? 'Lead received'
  const owner = inq?.owner ?? me.name
  const input = (k: string, ph = '', type = 'text') => <input type={type} className="input" value={f[k] ?? ''} placeholder={ph} onChange={(e) => set(k, e.target.value)} />
  const setStatus = (st: InquiryStatus) => { if (!inq) return; patchInquiry(inq.id, { status: st }); notify(st === 'Waitlisted' ? 'Waitlisted · added to the email list' : st === 'Denied' ? 'Denied · contact stops' : `Status: ${st}`) }
  const create = () => {
    const newId = addInquiry({ name: f.name, pathway: f.path === 'optimization' ? 'Health Optimization (L2/L3)' : 'Complex Chronic', source: f.heard ? `${f.heard}${f.heardName ? ' · ' + f.heardName : ''}` : 'Phone call', city: (f.city ?? '').split(',')[0] || '—', state: 'CA', reason: f.struggling || f.goal || '—', status: 'Lead received', owner: me.name } as Omit<Inquiry, 'id' | 'receivedAt'>)
    notify(`Inquiry saved for ${f.name} · it is an inquiry, not a patient`); nav(`/staff/inquiries/${newId}`)
  }
  if (!isNew && !inq) return <Notice tone="bad">Inquiry not found.</Notice>

  return (
    <>
      <Breadcrumb items={[{ label: 'Inquiries', to: '/staff/inquiries' }, { label: isNew ? 'New inquiry' : inq!.name }]} />
      {/* A coloured band so nobody mistakes this page for a patient record */}
      <div className="mb-5 rounded-2xl border border-plum-600/25 bg-plum-100/60 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-plum-600">Inquiry · not a patient</div>
            <h1 className="font-display text-3xl font-semibold text-sand-900">{isNew ? 'New inquiry' : inq!.name}</h1>
            <p className="mt-0.5 text-sm text-sand-600">{isNew ? 'Record a call or a walk-in the same way the website form does. Nothing is sent to the person.' : `Received ${inq!.receivedAt} · no chart, no invitation and no charges until accepted.`}</p>
          </div>
          {!isNew && <div className="flex flex-wrap items-center gap-2">
            <Pill tone={toneFor(status)}>{status}</Pill>
            {owner === 'Unassigned'
              ? <button onClick={() => { patchInquiry(inq!.id, { owner: me.name }); notify('This inquiry is now yours') }} className="btn-primary"><UserCheck size={15} /> Take ownership</button>
              : <span className="inline-flex items-center gap-2 rounded-full border border-sand-300 bg-white px-3 py-1.5 text-sm"><UserCheck size={14} className="text-teal-700" />Owner: <strong>{owner}</strong>{owner !== me.name && <button onClick={() => { patchInquiry(inq!.id, { owner: me.name }); notify(`Taken over from ${owner} · recorded`) }} className="text-xs text-teal-700 underline">take over</button>}</span>}
          </div>}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card title="What brings them to Helixona?" subtitle="The same two options as the website.">
            <div className="grid gap-3 sm:grid-cols-2">
              {([['chronic', 'Chronic or Complex Chronic Recovery', 'Living with an ongoing or complex health condition; wants a deeper, treatment-focused approach.'], ['optimization', 'Health Optimization', 'Wants to improve or protect health through individual therapies, experiences or targeted programs.']] as const).map(([k, t, d]) => (
                <button key={k} type="button" onClick={() => set('path', k)} aria-pressed={f.path === k} className={`rounded-xl border p-4 text-left ${f.path === k ? 'border-teal-500 bg-teal-50' : 'border-sand-300 bg-white hover:border-sand-400'}`}><span className="block font-display text-xl font-semibold text-sand-900">{t}</span><span className="mt-1 block text-sm text-sand-600">{d}</span></button>))}
            </div>
            {f.path === 'optimization' && <div className="mt-4"><Field label="What are they looking for?" required>
              <div className="grid gap-2 sm:grid-cols-2">{['Provider visit to build an optimization plan', 'Diagnostics and lab work', 'Therapies (IV, red light, nano bath, salt room…)', 'Not sure yet', 'Other'].map((o) => <button key={o} type="button" onClick={() => set('goal', o)} aria-pressed={f.goal === o} className={`rounded-xl border px-3 py-2.5 text-left text-sm font-medium ${f.goal === o ? 'border-teal-500 bg-teal-50 text-sand-900' : 'border-sand-300 bg-white text-sand-700'}`}>{o}</button>)}</div>
              {f.goal === 'Other' && <input autoFocus className="input mt-2" placeholder="Write what they are looking for" value={f.goalOther ?? ''} onChange={(e) => set('goalOther', e.target.value)} />}
            </Field></div>}
          </Card>

          <Card title="Contact">
            <div className="grid gap-4 sm:grid-cols-6">
              <div className="sm:col-span-4"><Field label="Name" required>{input('name', 'First and last name')}</Field></div>
              <div className="sm:col-span-2"><Field label="Age">{input('age', '', 'number')}</Field></div>
              <div className="sm:col-span-4"><Field label="Address">{input('street', 'Street and number')}</Field></div>
              <div className="sm:col-span-2"><Field label="City, state">{input('city')}</Field></div>
              <div className="sm:col-span-3"><Field label="Phone" required>{input('phone')}</Field></div>
              <div className="sm:col-span-3"><Field label="Email">{input('email', '', 'email')}</Field></div>
            </div>
          </Card>

          <Card title="Insurance">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Cash or insurance patient?" required><Choice3 value={f.payer ?? ''} onChange={(v) => set('payer', v)} options={['Insurance', 'Cash']} /></Field>
              {f.payer !== 'Cash' && <Field label="Insurance company">{input('insurer')}</Field>}
            </div>
            {f.payer !== 'Cash' && <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><Field label="Out-of-network plan document submitted (if applicable)"><Choice3 value={f.oonDoc ?? ''} onChange={(v) => set('oonDoc', v)} options={['Yes', 'Not yet', 'Does not apply']} /></Field></div>
              <Field label="Out-of-network deductible · this year"><div className="flex items-center gap-2"><span className="text-sand-500">$</span>{input('dedTotal', 'Deductible')}<span className="whitespace-nowrap text-xs text-sand-500">met $</span>{input('dedMet', 'Amount met')}</div></Field>
              <Field label="Out-of-network out-of-pocket maximum · this year"><div className="flex items-center gap-2"><span className="text-sand-500">$</span>{input('oopTotal', 'Maximum')}<span className="whitespace-nowrap text-xs text-sand-500">met $</span>{input('oopMet', 'Amount met')}</div></Field>
            </div>}
          </Card>

          <Card title="How did they hear about us?">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Source"><select className="input" value={f.heard ?? ''} onChange={(e) => set('heard', e.target.value)}><option value="">Select…</option>{heardOptions.map((o) => <option key={o}>{o}</option>)}</select></Field>
              {heardWithName.includes(f.heard ?? '') && <Field label={f.heard === 'Chat board' ? 'Which chat board?' : `${f.heard}'s name`} required>{input('heardName', f.heard === 'Physician' ? 'Physician and practice' : 'Name')}</Field>}
              <div className="sm:col-span-2"><Field label="Details (optional)">{input('heardDetails', 'Anything else about how they found us')}</Field></div>
            </div>
          </Card>

          <Card title="Health">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><Field label="What they are struggling with right now" required><textarea rows={2} className="input" value={f.struggling ?? ''} onChange={(e) => set('struggling', e.target.value)} /></Field></div>
              <div className="sm:col-span-2"><Field label="Health history"><textarea rows={3} className="input" value={f.history ?? ''} onChange={(e) => set('history', e.target.value)} placeholder="Diagnoses, treatments tried, what helped" /></Field></div>
              <Field label="How long have they been struggling"><select className="input" value={f.howLong ?? ''} onChange={(e) => set('howLong', e.target.value)}><option value="">Select…</option>{['Less than 6 months', '6 to 12 months', '1 to 2 years', 'More than 2 years', 'More than 5 years'].map((o) => <option key={o}>{o}</option>)}</select></Field>
              <Field label="How many specialists they have seen">{input('specialists', '', 'number')}</Field>
              <Field label="Willing to commit time to treatment 1–3 times per week"><Choice3 value={f.commit ?? ''} onChange={(v) => set('commit', v)} options={['Yes', 'No', 'Discuss']} /></Field>
              <Field label="Willing to receive IV infusions if recommended"><Choice3 value={f.iv ?? ''} onChange={(v) => set('iv', v)} options={['Yes', 'No', 'Discuss']} /></Field>
            </div>
          </Card>

          {!isNew && <Card title={<span className="flex items-center">Assessment and admission<Internal /></span>} subtitle="Never shown to the person. Kept apart from the medical record.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Application / inquiry submitted">{input('submitted', '', 'date')}</Field>
              <Field label="Assessment / screening complete">{input('screened', '', 'date')}</Field>
              <Field label="Patient level"><Choice3 value={f.level ?? ''} onChange={(v) => set('level', v)} options={['1', '2', '3']} /></Field>
              <Field label="Patient priority"><Choice3 value={f.priority ?? ''} onChange={(v) => set('priority', v)} options={['High', 'Mid', 'Low']} /></Field>
              <div className="sm:col-span-2"><Field label="New patient advisor’s assessment notes"><textarea rows={3} className="input" value={f.advisorNotes ?? ''} onChange={(e) => set('advisorNotes', e.target.value)} /></Field></div>
              <div className="sm:col-span-2"><Field label="Admission team’s review, notes and decision"><textarea rows={3} className="input" value={f.teamReview ?? ''} onChange={(e) => set('teamReview', e.target.value)} placeholder="Who reviewed, what was discussed, the decision" /></Field></div>
              <Field label="Admission committee review date">{input('decisionDate', '', 'date')}</Field>
              <Field label="Person notified of the decision">{input('notified', '', 'date')}</Field>
            </div>
          </Card>}
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-sand-500">Saved as {me.name} · every change is recorded with who and when</span>
            {isNew ? <button disabled={!f.name?.trim() || !f.phone?.trim() || !f.path} onClick={create} className="btn-primary btn-lg">Save inquiry</button> : <button onClick={() => notify('Inquiry saved')} className="btn-primary">Save changes</button>}
          </div>
        </div>

        <div className="space-y-5">
          {isNew ? (
            <Card title="This creates an inquiry">
              <p className="text-sm leading-relaxed text-sand-700">The person is <strong>not a patient</strong> after you save. No chart, invitation or charge is created. You become the owner and the status starts at <strong>Lead received</strong>.</p>
              <p className="mt-2 text-sm leading-relaxed text-sand-700">They are added to the patient list only when the inquiry is <strong>Accepted</strong>.</p>
            </Card>
          ) : (<>
            <Card title="Status" subtitle="In order. Choose where this inquiry is now.">
              <ol className="space-y-1">
                {inquiryStatuses.map((st, i) => { const cur = inquiryStatuses.indexOf(status); const on = st === status; const done = i < cur && !['Waitlisted', 'Denied'].includes(status); return (
                  <li key={st}><button onClick={() => setStatus(st)} aria-current={on} className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm ${on ? 'bg-teal-50 font-semibold text-sand-900 shadow-[inset_3px_0_0_#141414]' : 'text-sand-700 hover:bg-sand-100'}`}>
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${on ? 'bg-sand-900 text-white' : done ? 'bg-ok-100 text-ok-700' : 'border border-sand-300 text-sand-500'}`}>{done ? <Check size={11} /> : i + 1}</span>
                    <span className="flex-1">{st}</span>
                    {st === 'Accepted' && <span className="text-[11px] font-normal text-sand-500">adds to patient list</span>}{st === 'Waitlisted' && <span className="text-[11px] font-normal text-sand-500">adds to email list</span>}{st === 'Denied' && <span className="text-[11px] font-normal text-sand-500">give reason · stop</span>}
                  </button></li>) })}
              </ol>
              {status === 'Denied' && <div className="mt-3"><Field label="Reason for denial" required><select className="input" value={f.denyReason ?? ''} onChange={(e) => set('denyReason', e.target.value)}><option value="">Select…</option>{['Better served by another kind of care', 'Cannot commit to the schedule', 'Outside the service area', 'Financial', 'Other'].map((o) => <option key={o}>{o}</option>)}</select></Field></div>}
              {status === 'Waitlisted' && <div className="mt-3"><Notice tone="warn">On the email list. They hear from us when a place opens.</Notice></div>}
            </Card>
            {status === 'Accepted' && <Card title="Now that they are accepted">
              <ul className="space-y-2.5">
                {[['Create the eCW account', 'System', inq!.patientId ? 'done' : 'queued'], ['Send new patient survey and consents', 'System', inq!.patientId ? 'done' : 'queued'], ['Schedule the A&P appointment', owner, 'to do']].map(([t, who, st]) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm"><span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${st === 'done' ? 'bg-ok-100 text-ok-700' : 'border border-sand-300 text-sand-400'}`}>{st === 'done' && <Check size={12} />}</span><span className="flex-1"><span className="block text-sand-900">{t}</span><span className="block text-xs text-sand-500">{who} · {st}</span></span></li>))}
              </ul>
              {inq!.patientId
                ? <button onClick={() => nav(`/staff/patients/${inq!.patientId}`)} className="btn-secondary mt-4 w-full">Open the patient record</button>
                : <button onClick={() => nav(`/staff/patients/new?inquiry=${inq!.id}`)} className="btn-primary mt-4 w-full"><UserPlus size={15} /> Add to patient list</button>}
              <p className="help mt-2">Adding to the patient list creates the patient record and sends the invitation.</p>
            </Card>}
            <Card title="Summary">
              <Row label="Received">{inq!.receivedAt.split(' · ')[0]}</Row>
              <Row label="Owner">{owner}</Row>
              <Row label="Pays with">{f.payer || '—'}</Row>
              <Row label="Level · priority">{f.level || '—'} · {f.priority || '—'}</Row>
              <Row label="Heard from">{f.heard || '—'}{f.heardName ? ` · ${f.heardName}` : ''}</Row>
            </Card>
          </>)}
        </div>
      </div>
    </>
  )
}
