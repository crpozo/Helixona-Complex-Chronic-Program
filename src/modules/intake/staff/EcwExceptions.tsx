import { useState } from 'react'
import { Camera, CheckCheck, RotateCw } from 'lucide-react'
import { Card, Field, Notice, PageHeader, Pill, QueueTable, Row, Stat, Tabs, Toast, type Column } from '../../../components/ui'
import { ecwJobs } from '../../../mock/ecwJobs'
import type { EcwJob } from '../../../mock/types'

export default function EcwExceptions() {
  const [jobs, setJobs] = useState(ecwJobs)
  const [tab, setTab] = useState('open')
  const [sel, setSel] = useState<EcwJob | null>(jobs[0])
  const [toast, setToast] = useState<string | null>(null)
  const show = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2200) }
  const rows = jobs.filter((j) => (tab === 'open' ? j.status !== 'closed' : j.status === 'closed'))

  const columns: Column<EcwJob>[] = [
    { key: 'id', header: 'Job', render: (r) => <><div className="font-semibold text-sand-900">{r.id}</div><div className="text-xs text-sand-500">{r.queuedAt}</div></>, width: '150px' },
    { key: 'type', header: 'Job type', render: (r) => <span className="text-sand-800">{r.type}</span> },
    { key: 'p', header: 'Patient', render: (r) => <span className="font-medium">{r.patientId}</span> },
    { key: 'step', header: 'Failed step', render: (r) => r.failedStep },
    { key: 'sev', header: 'Severity', render: (r) => <Pill tone={r.severity === 'critical' ? 'bad' : 'warn'}>{r.severity === 'critical' ? 'Critical · no auto-retry' : 'Warning'}</Pill> },
    { key: 'att', header: 'Attempts', render: (r) => r.attempts },
    { key: 'st', header: 'Status', render: (r) => <Pill tone={r.status === 'closed' ? 'ok' : r.status === 'retrying' ? 'teal' : 'warn'} className="capitalize">{r.status}</Pill> },
  ]

  const act = (id: string, status: EcwJob['status'], msg: string) => { setJobs((js) => js.map((j) => (j.id === id ? { ...j, status, attempts: status === 'retrying' ? j.attempts + 1 : j.attempts } : j))); setSel((s) => (s && s.id === id ? { ...s, status } : s)); show(msg) }

  return (
    <>
      <Toast message={toast} />
      <PageHeader eyebrow="System · Chart prep & technical admin" title="eCW connector exceptions" description="Anything the connector could not complete and verify. A failure after a write is critical and is never retried automatically — a person decides." />
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Open exceptions" value={jobs.filter((j) => j.status !== 'closed').length} hint="1 critical" tone="bad" />
        <Stat label="Jobs last 24 h" value={14} hint="12 verified" tone="ok" />
        <Stat label="Connector health" value="Healthy" hint="signed in · 6:02 AM" tone="ok" />
        <Stat label="eCW client" value="Web" hint="to confirm" tone="warn" />
      </div>
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'open', label: 'Open', count: jobs.filter((j) => j.status !== 'closed').length }, { key: 'closed', label: 'Closed', count: jobs.filter((j) => j.status === 'closed').length }]} />
      <div className="grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3"><QueueTable rows={rows} columns={columns} rowKey={(r) => r.id} rowTone={(r) => (r.status === 'closed' ? 'ok' : r.severity === 'critical' ? 'bad' : 'warn')} onRowClick={setSel} /></div>
        <div className="lg:col-span-2">
          {sel ? (
            <Card title={`${sel.id} · ${sel.type}`} subtitle={`Patient ${sel.patientId} · queued ${sel.queuedAt}`}>
              <Notice tone={sel.severity === 'critical' ? 'bad' : 'warn'} title={sel.failedStep}>{sel.detail}</Notice>
              <div className="mt-4">
                <div className="eyebrow mb-1.5">Screenshot at failure</div>
                <div className="flex h-36 items-center justify-center rounded-xl border border-dashed border-sand-300 bg-sand-50 text-sand-400"><Camera size={20} className="mr-2" /> eCW screen capture (placeholder)</div>
              </div>
              <div className="mt-4 text-sm">
                <Row label="Duplicate guard">{sel.patientId.replace('P-', 'INT-')} · v2</Row>
                <Row label="Verification">{sel.type.startsWith('J2') ? 'Note verified · PDF not found' : 'Slot conflict detected before write'}</Row>
                <Row label="Patient impact">{sel.type.startsWith('J3') ? 'None — app booking stays valid; patient sees “Reserved”' : 'None — chart prep delayed'}</Row>
              </div>
              {sel.status !== 'closed' && (
                <div className="mt-4 space-y-3">
                  <Field label="Resolution note" required><textarea rows={2} className="input" placeholder="What did you check or do?" /></Field>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => act(sel.id, 'retrying', 'Retry queued · connector will re-verify before writing')} className="btn-secondary"><RotateCw size={16} /> Retry</button>
                    <button onClick={() => act(sel.id, 'closed', 'Closed · done manually by Charlene')} className="btn-primary"><CheckCheck size={16} /> Done manually · close</button>
                  </div>
                  <p className="help">Retry re-checks the chart first so nothing is duplicated. Closing records your name, time, and note.</p>
                </div>
              )}
              {sel.status === 'closed' && <div className="mt-4"><Pill tone="ok">Closed</Pill></div>}
            </Card>
          ) : <Card><p className="help">Select an exception to see details.</p></Card>}
        </div>
      </div>
    </>
  )
}
