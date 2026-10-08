import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, Check, RotateCcw, UserPlus } from 'lucide-react'
import { AuditList, Card, Field, Notice, PageHeader, Pill, QueueTable, Row, Stat, Tabs, Toast, type Column, type Tone } from '../../../components/ui'
import { alerts, levelTone, type Alert, type AlertStatus } from '../../../mock/program'

const statusTone: Record<AlertStatus, Tone> = { Unassigned: 'bad', Assigned: 'teal', Acknowledged: 'info', Overdue: 'bad', Escalated: 'bad', Resolved: 'ok', Reopened: 'warn' }

export default function AlertQueue() {
  const nav = useNavigate()
  const [tab, setTab] = useState('open')
  const [list, setList] = useState(alerts)
  const [sel, setSel] = useState<Alert | null>(alerts[0])
  const [toast, setToast] = useState<string | null>(null)
  const show = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2200) }
  const rows = list.filter((a) => (tab === 'open' ? a.status !== 'Resolved' : tab === 'mine' ? a.assignee.includes('Jen') : a.status === 'Resolved'))
  const update = (id: string, status: AlertStatus, note: string, reason?: string) => {
    setList((xs) => xs.map((a) => (a.id === id ? { ...a, status, history: [...a.history, { actor: 'Jen (nursing)', when: 'Just now', action: note, reason }] } : a)))
    setSel((s) => (s && s.id === id ? { ...s, status, history: [...s.history, { actor: 'Jen (nursing)', when: 'Just now', action: note, reason }] } : s))
    show(note)
  }
  const columns: Column<Alert>[] = [
    { key: 'level', header: 'Level', render: (r) => <Pill tone={levelTone[r.level]}>{r.level}</Pill>, width: '170px' },
    { key: 'id', header: 'Alert · patient', render: (r) => <><div className="font-semibold text-sand-900">{r.patientId}</div><div className="text-xs text-sand-500">{r.id} · {r.createdAt}</div></> },
    { key: 'summary', header: 'Source · summary', render: (r) => <><div className="text-xs text-sand-500">{r.source}</div><div className="text-sand-800">{r.summary}</div></> },
    { key: 'status', header: 'Status', render: (r) => <Pill tone={statusTone[r.status]}>{r.status}</Pill> },
    { key: 'due', header: 'Respond by', render: (r) => <span className={r.status === 'Overdue' || r.status === 'Escalated' ? 'font-semibold text-bad-700' : ''}>{r.dueBy}</span> },
    { key: 'assignee', header: 'Assigned', render: (r) => r.assignee },
  ]
  return (
    <>
      <Toast message={toast} />
      <PageHeader eyebrow="Surveys & alerts · Nursing / care team" title="Alert queue" description="Survey answers and crash reports that matched an alert rule. Acknowledge, follow up, and resolve with a reason. Escalation happens automatically when a response target lapses." />
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat label="Unassigned" value={list.filter((a) => a.status === 'Unassigned').length} tone="bad" />
        <Stat label="Overdue / escalated" value={list.filter((a) => a.status === 'Overdue' || a.status === 'Escalated').length} tone="bad" />
        <Stat label="Acknowledged" value={list.filter((a) => a.status === 'Acknowledged').length} tone="info" />
        <Stat label="Resolved · 7 d" value={11} hint="median 2.1 h" tone="ok" />
        <Stat label="Reopened" value={list.filter((a) => a.status === 'Reopened').length} tone="warn" />
      </div>
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'open', label: 'Open', count: list.filter((a) => a.status !== 'Resolved').length }, { key: 'mine', label: 'Assigned to me (Jen)', count: list.filter((a) => a.assignee.includes('Jen')).length }, { key: 'resolved', label: 'Resolved' }]} />
      <div className="grid gap-5 xl:grid-cols-5">
        <div className="xl:col-span-3"><QueueTable rows={rows} columns={columns} rowKey={(r) => r.id} rowTone={(r) => levelTone[r.level]} onRowClick={setSel} /></div>
        <div className="xl:col-span-2">
          {sel && (
            <Card title={<span className="flex items-center gap-2">{sel.id} <Pill tone={levelTone[sel.level]}>{sel.level}</Pill></span>} subtitle={`${sel.patientId} · ${sel.source} · ${sel.createdAt}`}
              actions={<button onClick={() => nav(`/staff/alerts/patient/${sel.patientId}`)} className="btn-secondary px-3 py-1.5 text-xs"><ArrowUpRight size={14} /> Patient history</button>}>
              <Notice tone={levelTone[sel.level]}>{sel.summary}</Notice>
              <div className="mt-3 text-sm">
                <Row label="Rule applied">{sel.rule}</Row>
                <Row label="Respond by">{sel.dueBy}</Row>
                <Row label="Assigned">{sel.assignee}</Row>
                <Row label="Physician">{sel.physician}</Row>
                <Row label="Status"><Pill tone={statusTone[sel.status]}>{sel.status}</Pill></Row>
              </div>
              {sel.status !== 'Resolved' && (
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {sel.status === 'Unassigned' && <button onClick={() => update(sel.id, 'Assigned', 'Assigned to Jen (nursing)')} className="btn-secondary"><UserPlus size={15} /> Take it</button>}
                    {(sel.status === 'Assigned' || sel.status === 'Unassigned' || sel.status === 'Overdue' || sel.status === 'Escalated' || sel.status === 'Reopened') && <button onClick={() => update(sel.id, 'Acknowledged', 'Acknowledged')} className="btn-secondary"><Check size={15} /> Acknowledge</button>}
                    <button onClick={() => update(sel.id, 'Escalated', 'Escalated to treating physician', 'Manual escalation')} className="btn-secondary"><ArrowUpRight size={15} /> Escalate</button>
                  </div>
                  <Field label="Follow-up note" required><textarea rows={3} className="input" placeholder="What you did and what the patient said. This note can be copied into eCW." /></Field>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Field label="Resolution reason"><select className="input"><option>RES-01 · Advised, no further action</option><option>RES-02 · Expected response, patient reassured</option><option>RES-03 · Visit scheduled</option><option>RES-04 · Physician reviewed</option><option>RES-05 · Referred to emergency care</option></select></Field>
                    <Field label="Document in eCW"><select className="input"><option>Copy note text to clipboard</option><option>Connector will place note</option><option>Not needed</option></select></Field>
                  </div>
                  <button onClick={() => update(sel.id, 'Resolved', 'Resolved', 'RES-02 · Expected response, patient reassured')} className="btn-primary w-full"><Check size={15} /> Resolve</button>
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
