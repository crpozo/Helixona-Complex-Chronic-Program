import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, Check, Clock, Mic, RotateCcw, UserPlus } from 'lucide-react'
import { nameOf } from '../../../mock/names'
import { AuditList, Card, Field, Notice, PageHeader, Pill, QueueTable, Row, Stat, Tabs, Toast, type Column, type Tone } from '../../../components/ui'
import { alerts, levelTone, type Alert, type AlertStatus } from '../../../mock/program'

/** What staff read for each status. 'Acknowledged' is kept in the data and shown as pending. */
const statusLabel: Record<AlertStatus, string> = { Unassigned: 'Unassigned', Assigned: 'Assigned', Acknowledged: 'Pending', Overdue: 'Overdue', Escalated: 'Escalated', Resolved: 'Resolved', Reopened: 'Reopened' }
const pendingActions = ['Patient callback', 'Waiting for physician', 'Visit to be scheduled', 'Waiting on lab result']
const statusTone: Record<AlertStatus, Tone> = { Unassigned: 'bad', Assigned: 'teal', Acknowledged: 'info', Overdue: 'bad', Escalated: 'bad', Resolved: 'ok', Reopened: 'warn' }

export default function AlertQueue() {
  const nav = useNavigate()
  const [tab, setTab] = useState('open')
  const [list, setList] = useState(alerts)
  const [sel, setSel] = useState<Alert | null>(alerts[0])
  const [toast, setToast] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [outcome, setOutcome] = useState<'Resolved' | 'Pending'>('Resolved')
  const [reason, setReason] = useState('RES-01 · Advised, no further action')
  const [pending, setPending] = useState<Record<string, string>>({ 'AL-3301': 'Patient callback' })
  const [action, setAction] = useState(pendingActions[0])
  const [listening, setListening] = useState(false)
  const [escalating, setEscalating] = useState(false)
  const label = (a: Alert) => (a.status === 'Acknowledged' ? `Pending · ${(pending[a.id] ?? 'Patient callback').toLowerCase()}` : statusLabel[a.status])
  const show = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2200) }
  const rows = list.filter((a) => (tab === 'open' ? a.status !== 'Resolved' : tab === 'mine' ? a.assignee.includes('Jen') : a.status === 'Resolved'))
  const update = (id: string, status: AlertStatus, note: string, reason?: string) => {
    setList((xs) => xs.map((a) => (a.id === id ? { ...a, status, history: [...a.history, { actor: 'Jen (nursing)', when: 'Just now', action: note, reason }] } : a)))
    setSel((s) => (s && s.id === id ? { ...s, status, history: [...s.history, { actor: 'Jen (nursing)', when: 'Just now', action: note, reason }] } : s))
    show(note)
  }
  const columns: Column<Alert>[] = [
    { key: 'level', header: 'Level', render: (r) => <Pill tone={levelTone[r.level]}>{r.level}</Pill>, width: '170px' },
    { key: 'id', header: 'Patient', render: (r) => <><div className="font-semibold text-sand-900">{nameOf(r.patientId)}</div><div className="text-xs text-sand-500">{r.createdAt}</div></> },
    { key: 'summary', header: 'Source · summary', render: (r) => <><div className="text-xs text-sand-500">{r.source}</div><div className="text-sand-800">{r.summary}</div></> },
    { key: 'status', header: 'Status', render: (r) => <Pill tone={statusTone[r.status]}>{label(r)}</Pill> },
    { key: 'due', header: 'Respond by', render: (r) => <span className={r.status === 'Overdue' || r.status === 'Escalated' ? 'font-semibold text-bad-700' : ''}>{r.dueBy}</span> },
    { key: 'assignee', header: 'Assigned', render: (r) => r.assignee },
  ]
  return (
    <>
      <Toast message={toast} />
      <PageHeader eyebrow="Surveys & alerts · Nursing / care team" title="Alert queue" description="Survey answers and crash reports that matched an alert rule. Follow up, then resolve it or leave it pending with the action still needed. Escalation happens automatically when a response target lapses." />
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat label="Unassigned" value={list.filter((a) => a.status === 'Unassigned').length} tone="bad" />
        <Stat label="Overdue / escalated" value={list.filter((a) => a.status === 'Overdue' || a.status === 'Escalated').length} tone="bad" />
        <Stat label="Pending action" value={list.filter((a) => a.status === 'Acknowledged').length} tone="info" />
        <Stat label="Resolved · 7 d" value={11} hint="median 2.1 h" tone="ok" />
        <Stat label="Reopened" value={list.filter((a) => a.status === 'Reopened').length} tone="warn" />
      </div>
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'open', label: 'Open', count: list.filter((a) => a.status !== 'Resolved').length }, { key: 'mine', label: 'Assigned to me (Jen)', count: list.filter((a) => a.assignee.includes('Jen')).length }, { key: 'resolved', label: 'Resolved' }]} />
      <div className="grid gap-5 xl:grid-cols-5">
        <div className="xl:col-span-3"><QueueTable rows={rows} columns={columns} rowKey={(r) => r.id} rowTone={(r) => levelTone[r.level]} onRowClick={setSel} /></div>
        <div className="xl:col-span-2">
          {sel && (
            <Card title={<span className="flex items-center gap-2">{nameOf(sel.patientId)} <Pill tone={levelTone[sel.level]}>{sel.level}</Pill></span>} subtitle={`${nameOf(sel.patientId)} · ${sel.source} · ${sel.createdAt}`}
              actions={<button onClick={() => nav(`/staff/alerts/patient/${sel.patientId}`)} className="btn-secondary px-3 py-1.5 text-xs"><ArrowUpRight size={14} /> Patient history</button>}>
              <Notice tone={levelTone[sel.level]}>{sel.summary}</Notice>
              <div className="mt-3 text-sm">
                <Row label="Rule applied">{sel.rule}</Row>
                <Row label="Respond by">{sel.dueBy}</Row>
                <Row label="Assigned">{sel.assignee}</Row>
                <Row label="Physician">{sel.physician}</Row>
                <Row label="Status"><Pill tone={statusTone[sel.status]}>{label(sel)}</Pill></Row>
              </div>
              {sel.status !== 'Resolved' && (
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {sel.status === 'Unassigned' && <button onClick={() => update(sel.id, 'Assigned', 'Assigned to Jen (nursing)')} className="btn-secondary"><UserPlus size={15} /> Take it</button>}
                    <button onClick={() => setEscalating(true)} className="btn-secondary"><ArrowUpRight size={15} /> Escalate</button>
                  </div>
                  <Field label="Follow-up note" required>
                    <div className="relative">
                      <textarea rows={3} className="input pr-12" placeholder="What you did and what the patient said. Type it, or tap the microphone and say it." value={note} onChange={(e) => setNote(e.target.value)} />
                      <button type="button" aria-label={listening ? 'Stop dictation' : 'Dictate the note'} aria-pressed={listening} onClick={() => { if (listening) { setListening(false); setNote((n) => (n ? n + ' ' : '') + 'Called the patient. Resting today, symptoms easing. Will call back tomorrow morning.') } else setListening(true) }} className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full border ${listening ? 'animate-pulse border-bad-600 bg-bad-100 text-bad-700' : 'border-sand-300 bg-white text-sand-600 hover:text-sand-900'}`}><Mic size={16} /></button>
                    </div>
                    {listening && <p className="mt-1 text-xs font-medium text-bad-700">Listening… tap the microphone again when you finish.</p>}
                  </Field>
                  <Field label="Outcome" required>
                    <div className="grid grid-cols-2 gap-2">{(['Resolved', 'Pending'] as const).map((o) => <button key={o} type="button" onClick={() => setOutcome(o)} aria-pressed={outcome === o} className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium ${outcome === o ? 'border-teal-500 bg-teal-50 text-sand-900' : 'border-sand-300 bg-white text-sand-600'}`}>{o === 'Resolved' ? <Check size={15} /> : <Clock size={15} />}{o === 'Resolved' ? 'Resolved' : 'Pending · action still needed'}</button>)}</div>
                  </Field>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {outcome === 'Resolved'
                      ? <Field label="Resolution reason"><select className="input" value={reason} onChange={(e) => setReason(e.target.value)}><option>RES-01 · Advised, no further action</option><option>RES-02 · Expected response, patient reassured</option><option>RES-03 · Visit scheduled</option><option>RES-04 · Physician reviewed</option><option>RES-05 · Referred to emergency care</option></select></Field>
                      : <Field label="Pending action"><select className="input" value={action} onChange={(e) => setAction(e.target.value)}>{pendingActions.map((a) => <option key={a}>{a}</option>)}</select></Field>}
                    <Field label="Document in eCW"><select className="input" defaultValue="AI Agent will place the note"><option>AI Agent will place the note</option><option>Copy note text to clipboard</option><option>Not needed</option></select></Field>
                  </div>
                  {outcome === 'Pending' && <Field label="Follow up on"><input type="date" className="input" defaultValue="2026-10-09" /></Field>}
                  <button disabled={!note.trim()} onClick={() => { if (outcome === 'Resolved') update(sel.id, 'Resolved', 'Resolved', reason); else { setPending({ ...pending, [sel.id]: action }); update(sel.id, 'Acknowledged', `Pending · ${action.toLowerCase()}`, note.trim()) } setNote('') }} className="btn-primary w-full">{outcome === 'Resolved' ? <><Check size={15} /> Resolve</> : <><Clock size={15} /> Save as pending</>}</button>
                  {!note.trim() && <p className="text-center text-xs text-sand-500">Write the follow-up note first.</p>}
                </div>
              )}
              {escalating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label="Escalate alert">
                  <div className="card w-full max-w-md p-5 shadow-xl">
                    <h2 className="font-display text-2xl font-semibold text-sand-900">Escalate to the physician?</h2>
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-sand-700">
                      <li>{sel.physician} is notified by text right away, with the nurse practitioner as backup.</li>
                      <li>A 30-minute response target starts. If nobody answers, it escalates again.</li>
                      <li>The message has no patient details; they open the alert here to read it.</li>
                      <li>This is recorded with your name and the time.</li>
                    </ul>
                    <p className="mt-3 rounded-lg bg-bad-100 px-3 py-2 text-sm text-bad-700">If the patient may be in danger, tell them to call 911. Escalating here is not emergency care.</p>
                    <div className="mt-5 flex justify-end gap-2"><button onClick={() => setEscalating(false)} className="btn-ghost">Cancel</button><button onClick={() => { setEscalating(false); update(sel.id, 'Escalated', 'Escalated to treating physician', 'Manual escalation') }} className="btn-primary">I understand · escalate</button></div>
                  </div>
                </div>
              )}
              {sel.status === 'Resolved' && <button onClick={() => update(sel.id, 'Reopened', 'Reopened', 'Pattern persists')} className="btn-secondary mt-4 w-full"><RotateCcw size={15} /> Reopen</button>}
              <div className="mt-5"><div className="eyebrow mb-2">History · who · when · why</div><AuditList compact entries={sel.history} /></div>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
