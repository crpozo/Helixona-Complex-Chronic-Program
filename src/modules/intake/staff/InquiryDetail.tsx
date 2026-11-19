import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check, EyeOff, FileText, Sparkles, Upload, UserCheck, UserPlus } from 'lucide-react'
import { Breadcrumb, Card, Field, Notice, Pill, Row, toneFor } from '../../../components/ui'
import { ageOf } from '../../../mock/demographics'
import type { Inquiry, InquiryStatus } from '../../../mock/types'
import { addInquiry, currentUser, inquiryById, inquiryStatuses, notify, patchInquiry, useStore, insuranceOf, inquiryAge, preferredName } from '../../../mock/store'

/** One inquiry: the data the advisor collects before admission (as listed by the clinic), the internal
 *  assessment, and the status. This is NOT a patient record; accepting it is what adds the person to the patient list. */
const heardWithName = ['Friend', 'Patient', 'Physician', 'Chat board']
const heardOptions = ['Friend', 'Patient', 'Physician', 'Chat board', 'Google search', 'Instagram', 'Facebook', 'Helixona website', 'Event or talk', 'Other']
const seg = (on: boolean) => `flex-1 whitespace-nowrap rounded-xl border px-3 py-2.5 text-sm font-medium ${on ? 'border-teal-500 bg-teal-50 text-sand-900' : 'border-sand-300 bg-white text-sand-600 hover:border-sand-400'}`
const zips: Record<string, [string, string]> = { '92618': ['Irvine', 'CA'], '92660': ['Newport Beach', 'CA'], '92691': ['Mission Viejo', 'CA'], '92651': ['Laguna Beach', 'CA'], '92653': ['Laguna Hills', 'CA'], '92626': ['Costa Mesa', 'CA'], '92705': ['Santa Ana', 'CA'], '92648': ['Huntington Beach', 'CA'], '92782': ['Tustin', 'CA'], '92677': ['Laguna Niguel', 'CA'], '89101': ['Las Vegas', 'NV'], '85001': ['Phoenix', 'AZ'] }

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
    first: inq.name.split(' ')[0], last: inq.name.split(' ').slice(1).join(' '), preferred: preferredName(inq) ?? '', dob: `${2026 - inquiryAge(inq)}-03-14`, sex: '', street: '', zip: Object.keys(zips).find((z) => zips[z][0] === inq.city) ?? '', city: inq.city, state: inq.state, phone: '(949) 555-0100', email: `${inq.name.split(' ')[0].toLowerCase()}@example.com`,
    path: inq.pathway === 'Complex Chronic' ? 'chronic' : 'optimization', payer: insuranceOf(inq) === 'Cash' ? 'Cash' : 'Insurance', insurer: insuranceOf(inq) === 'Cash' ? '' : insuranceOf(inq), oonDoc: 'Not yet', dedTotal: '3,000', dedMet: '1,250', oopTotal: '8,000', oopMet: '2,400',
    heard: /Referral · Dr/.test(inq.source) ? 'Physician' : /existing patient/.test(inq.source) ? 'Patient' : /Instagram/.test(inq.source) ? 'Instagram' : /Google/.test(inq.source) ? 'Google search' : 'Helixona website', heardName: /Dr\. Patel/.test(inq.source) ? 'Dr. Patel' : '',
    struggling: inq.reason, history: '', howLong: 'More than 2 years', specialists: '4', commit: 'Yes', iv: 'Discuss', submitted: '2026-10-06', screened: '', level: '', priority: '', advisorNotes: '', teamReview: '', decisionDate: '', notified: '', denyReason: '', goal: '', goalOther: '', heardDetails: '',
  } : { path: '', payer: '', commit: '', iv: '', heard: '', submitted: '2026-10-09', oonDoc: 'Not yet' })
  const set = (k: string, v: string) => setF((x) => ({ ...x, [k]: v }))
  const setZip = (v: string) => setF((x) => ({ ...x, zip: v, ...(zips[v] ? { city: zips[v][0], state: zips[v][1] } : {}) }))
  const fullName = `${f.first ?? ''} ${f.last ?? ''}`.trim()
  const age = /^\d{4}-\d{2}-\d{2}$/.test(f.dob ?? '') ? ageOf(`${f.dob.slice(5, 7)}/${f.dob.slice(8, 10)}/${f.dob.slice(0, 4)}`) : undefined
  const [docs, setDocs] = useState<string[]>(inq ? ['Lab results · Sep 2026.pdf', 'Records from previous specialist.pdf'] : [])
  const [analysis, setAnalysis] = useState<'none' | 'reading' | 'done'>('none')
  const status: InquiryStatus = inq?.status ?? 'Lead received'
  const owner = inq?.owner ?? me.name
  const input = (k: string, ph = '', type = 'text') => <input type={type} className="input" value={f[k] ?? ''} placeholder={ph} onChange={(e) => set(k, e.target.value)} />
  const setStatus = (st: InquiryStatus) => { if (!inq) return; patchInquiry(inq.id, { status: st }); notify(st === 'Waitlisted' ? 'Waitlisted · added to the email list' : st === 'Denied' ? 'Denied · contact stops' : `Status: ${st}`) }
  const create = () => {
    const newId = addInquiry({ name: fullName, pathway: f.path === 'optimization' ? 'Health Optimization (L2/L3)' : 'Complex Chronic', source: f.heard ? `${f.heard}${f.heardName ? ' · ' + f.heardName : ''}` : 'Phone call', city: f.city || '—', state: f.state || 'CA', reason: f.struggling || f.goal || '—', status: 'Lead received', owner: me.name } as Omit<Inquiry, 'id' | 'receivedAt'>)
    notify(`Inquiry saved for ${fullName} · it is an inquiry, not a patient`); nav(`/staff/inquiries/${newId}`)
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
              <div className="sm:col-span-2"><Field label="First name" required>{input('first')}</Field></div>
              <div className="sm:col-span-2"><Field label="Last name" required>{input('last')}</Field></div>
              <div className="sm:col-span-2"><Field label="Preferred name / nickname">{input('preferred', 'What they like to be called')}</Field></div>
              <div className="sm:col-span-2"><Field label="Date of birth">{input('dob', '', 'date')}</Field></div>
              <div className="sm:col-span-1"><Field label="Age"><div className="input bg-sand-100 text-sand-700" aria-live="polite">{age !== undefined && age >= 0 ? age : '—'}</div></Field></div>
              <div className="sm:col-span-3"><Field label="Biological sex"><Choice3 value={f.sex ?? ''} onChange={(v) => set('sex', v)} options={['Female', 'Male', 'Intersex']} /></Field></div>
              <div className="sm:col-span-6"><Field label="Address">{input('street', 'Street and number')}</Field></div>
              <div className="sm:col-span-2"><Field label="ZIP code" hint="Fills in the city and state"><input className="input" inputMode="numeric" maxLength={5} value={f.zip ?? ''} placeholder="92618" onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))} /></Field></div>
              <div className="sm:col-span-3"><Field label="City">{input('city')}</Field></div>
              <div className="sm:col-span-1"><Field label="State">{input('state')}</Field></div>
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

          <Card title="Documents and AI analysis" subtitle="Upload what the person sends (records, labs, insurance plan). The AI Agent reads them and drafts a summary for the advisor.">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-sand-300 bg-sand-50 px-4 py-4 text-sm text-sand-700 hover:bg-sand-100"><Upload size={18} /><span><strong>Upload documents</strong> · PDF, photo or scan</span><input type="file" multiple className="hidden" onChange={(e) => { const names = Array.from(e.target.files ?? []).map((x) => x.name); if (names.length) { setDocs([...docs, ...names]); setAnalysis('none') } }} /></label>
            {docs.length > 0 && <ul className="mt-3 divide-y divide-sand-100 rounded-xl border border-sand-200">{docs.map((d) => <li key={d} className="flex items-center justify-between gap-3 px-3 py-2 text-sm"><span className="flex items-center gap-2 text-sand-800"><FileText size={15} className="text-sand-500" />{d}</span><span className="text-xs text-sand-500">Uploaded by {me.name}</span></li>)}</ul>}
            <button disabled={docs.length === 0 || analysis === 'reading'} onClick={() => { setAnalysis('reading'); setTimeout(() => setAnalysis('done'), 1200) }} className="btn-secondary mt-3"><Sparkles size={15} /> {analysis === 'reading' ? 'Reading the documents…' : analysis === 'done' ? 'Analyze again' : 'Analyze with the AI Agent'}</button>
            {analysis === 'done' && <div className="mt-3 rounded-xl border border-plum-600/30 bg-plum-100/50 p-4 text-sm text-sand-800">
              <div className="flex items-center gap-2 font-semibold text-sand-900"><Sparkles size={15} /> AI Agent summary · draft <span className="rounded-md border border-dashed border-plum-600/40 px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-plum-600">Sample</span></div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li><strong>Reported conditions:</strong> long-standing fatigue and joint pain; prior work-up by 4 specialists.</li>
                <li><strong>Labs found:</strong> one panel from Sep 2026; inflammatory markers above the lab's range, thyroid within range.</li>
                <li><strong>Current medications listed:</strong> 3 prescriptions, 2 supplements.</li>
                <li><strong>Insurance:</strong> out-of-network plan document not found in the uploads.</li>
                <li><strong>Missing:</strong> imaging reports mentioned in the records, photo ID.</li>
              </ul>
              <p className="mt-2 text-xs text-sand-600">Read from {docs.length} document{docs.length === 1 ? '' : 's'} · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}. A draft to save reading time, not a clinical opinion. Check it against the documents before the admission review.</p>
            </div>}
          </Card>

          {!isNew && <Card title={<span className="flex items-center">Assessment and admission<Internal /></span>} subtitle="Never shown to the person. Kept apart from the medical record.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Application / inquiry submitted">{input('submitted', '', 'date')}</Field>
              <Field label="Assessment / screening complete">{input('screened', '', 'date')}</Field>
              <Field label="Patient level"><Choice3 value={f.level ?? ''} onChange={(v) => set('level', v)} options={['1', '2', '3']} /></Field>
              <Field label="Patient priority"><Choice3 value={f.priority ?? ''} onChange={(v) => set('priority', v)} options={['High', 'Mid', 'Low']} /></Field>
              <div className="sm:col-span-2"><Field label="New patient advisor’s assessment notes"><textarea rows={3} className="input" value={f.advisorNotes ?? ''} onChange={(e) => set('advisorNotes', e.target.value)} /></Field></div>
              <div className="sm:col-span-2"><Field label="Admission team’s review, notes and decision"><textarea rows={3} className="input" value={f.teamReview ?? ''} onChange={(e) => set('teamReview', e.target.value)} placeholder="Who reviewed, what was discussed, the decision" /></Field></div>
              <div className="sm:col-span-2 rounded-2xl border border-sand-200 bg-sand-50 p-4">
                <div className="label">Admission decision</div>
                <div className="mt-2 grid grid-cols-2 gap-2 lg:grid-cols-4">{([['Accept patient', 'Accepted', 'Adds to the patient list'], ['Discuss / review', 'Waiting for admission review', 'Goes to the admission team'], ['Declined', 'Denied', 'Give a reason · contact stops'], ['Waitlist', 'Waitlisted', 'Adds to the email list']] as [string, InquiryStatus, string][]).map(([label, st, hint]) => { const on = f.decision === st; return (
                  <button key={st} type="button" aria-pressed={on} onClick={() => { set('decision', st); setStatus(st) }} className={`rounded-xl border px-3 py-3 text-left ${on ? 'border-sand-900 bg-white shadow-[0_0_0_1px_#141414]' : 'border-sand-300 bg-white hover:bg-sand-100'}`}><span className={`block text-sm font-semibold ${st === 'Denied' ? 'text-bad-700' : 'text-sand-900'}`}>{label}</span><span className="mt-0.5 block text-xs text-sand-500">{hint}</span></button>) })}</div>
                {f.decision === 'Denied' && <div className="mt-3"><div className="text-sm font-medium text-sand-800">Reason for declining <span className="text-bad-600">*</span></div><div className="mt-2 flex flex-wrap gap-2">{['Distance', 'Not sick enough', 'Finances', 'Cannot commit to the schedule', 'Better served by another kind of care', 'Other'].map((r) => <button key={r} type="button" aria-pressed={f.denyReason === r} onClick={() => set('denyReason', r)} className={`rounded-full border px-3 py-1.5 text-sm ${f.denyReason === r ? 'border-sand-900 bg-sand-900 text-white' : 'border-sand-300 bg-white text-sand-700'}`}>{r}</button>)}</div>{f.denyReason === 'Other' && <input className="input mt-2" placeholder="Write the reason" value={f.denyOther ?? ''} onChange={(e) => set('denyOther', e.target.value)} />}</div>}
                {f.decision && <p className="help mt-2">Recorded by {me.name} · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>}
              </div>
              <Field label="Admission committee review date">{input('decisionDate', '', 'date')}</Field>
              <Field label="Person notified of the decision">{input('notified', '', 'date')}</Field>
            </div>
          </Card>}
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-sand-500">Saved as {me.name} · every change is recorded with who and when</span>
            {isNew ? <button disabled={!f.first?.trim() || !f.last?.trim() || !f.phone?.trim() || !f.path} onClick={create} className="btn-primary btn-lg">Save inquiry</button> : <button onClick={() => notify('Inquiry saved')} className="btn-primary">Save changes</button>}
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
              {status === 'Denied' && <div className="mt-3"><Field label="Reason for denial" required><select className="input" value={f.denyReason ?? ''} onChange={(e) => set('denyReason', e.target.value)}><option value="">Select…</option>{['Distance', 'Not sick enough', 'Finances', 'Cannot commit to the schedule', 'Better served by another kind of care', 'Other'].map((o) => <option key={o}>{o}</option>)}</select></Field></div>}
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
