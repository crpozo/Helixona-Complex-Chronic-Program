import { useState } from 'react'
import { Card, Field, Notice, PageHeader, Pill, QueueTable, Tabs, VersionTag, type Column } from '../../components/ui'
import { alertRules, levelTone, type AlertRule } from '../../mock/program'
import { stateTone } from './SurveyBuilder'

const layers: AlertRule['layer'][] = ['Global', 'Program', 'Stage', 'Modality', 'Physician', 'Patient override']

export default function AlertRules() {
  const [tab, setTab] = useState('rules')
  const [sel, setSel] = useState<AlertRule>(alertRules[1])
  const columns: Column<AlertRule>[] = [
    { key: 'name', header: 'Rule', render: (r) => <><div className="font-semibold text-sand-900">{r.name} <VersionTag>v{r.version}</VersionTag></div><div className="text-xs text-sand-500">{r.id} · {r.layer} · {r.scope}</div></> },
    { key: 'trigger', header: 'Trigger', render: (r) => <span className="text-xs text-sand-700">{r.trigger}</span> },
    { key: 'level', header: 'Level', render: (r) => <Pill tone={levelTone[r.level]}>{r.level}</Pill> },
    { key: 'target', header: 'Respond within', render: (r) => r.responseTarget },
    { key: 'state', header: 'State', render: (r) => <Pill tone={stateTone[r.state]}>{r.state}</Pill> },
  ]
  return (
    <>
      <PageHeader eyebrow="Configuration · Physician" title="Alert rules" description="What creates an alert, how urgent it is, who is notified, and how fast a response is expected. Rules are layered; the most specific layer wins and the applied layer is always shown on the alert." actions={<button className="btn-primary">+ New rule</button>} />
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'rules', label: 'Rules', count: alertRules.length }, { key: 'precedence', label: 'Precedence view' }, { key: 'levels', label: 'Levels & labels' }]} />
      {tab === 'rules' && (
        <div className="grid gap-5 xl:grid-cols-5">
          <div className="xl:col-span-3"><QueueTable rows={alertRules} columns={columns} rowKey={(r) => r.id} rowTone={(r) => levelTone[r.level]} onRowClick={setSel} /></div>
          <div className="xl:col-span-2">
            <Card title={<span className="flex items-center gap-2">{sel.name} <VersionTag>v{sel.version}</VersionTag></span>} subtitle={`${sel.id} · layer: ${sel.layer} · scope: ${sel.scope}`} actions={<Pill tone={stateTone[sel.state]}>{sel.state}</Pill>}>
              <div className="grid gap-3">
                <Field label="Trigger"><input className="input" defaultValue={sel.trigger} /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Level"><select className="input" defaultValue={sel.level}><option>Informational</option><option>Routine review</option><option>Nurse follow-up</option><option>Urgent clinical review</option><option>Emergency instruction</option></select></Field>
                  <Field label="Response target"><input className="input" defaultValue={sel.responseTarget} /></Field>
                </div>
                <Field label="Recipients (role · named user · physician · backup)"><input className="input" defaultValue={sel.recipients} /></Field>
                <Field label="Escalation timer"><input className="input" defaultValue={sel.escalation} /></Field>
                <Field label="After-hours behavior"><input className="input" defaultValue={sel.afterHours} /></Field>
                <Field label="Patient-facing emergency language"><select className="input"><option>Show standard notice (not continuously monitored · call 911)</option><option>Show notice + call-us-now banner</option></select></Field>
                <div className="flex gap-2 pt-1"><button className="btn-secondary">Save draft</button><button className="btn-primary">Send for clinical publish</button></div>
                <p className="help">Changes to clinical alert rules require an authorized clinical publisher. Every version and every alert action is audited.</p>
              </div>
            </Card>
          </div>
        </div>
      )}
      {tab === 'precedence' && (
        <div className="grid gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <Card title="Which rule applies, and why" subtitle="Example: crash report from P-0041 (Dr. D.'s patient, Active care, after nano bath) with severity 7.">
              <ol className="space-y-2">
                {layers.map((l, i) => {
                  const rule = alertRules.find((r) => r.layer === l && (l !== 'Modality' || r.scope.includes('laser')) )
                  const applies = l === 'Patient override' || l === 'Physician'
                  const winner = l === 'Patient override'
                  return (
                    <li key={l} className={`flex items-start gap-3 rounded-xl border p-3 ${winner ? 'border-teal-500 bg-teal-50' : applies ? 'border-sand-300 bg-white' : 'border-sand-200 bg-sand-50 opacity-70'}`}>
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${winner ? 'bg-teal-600 text-white' : 'bg-sand-200 text-sand-600'}`}>{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-sand-900">{l}{winner && <Pill tone="ok" dot={false}>Applied</Pill>}{applies && !winner && <Pill tone="info" dot={false}>Inherited: recipients, escalation</Pill>}{!applies && <Pill dot={false}>Not matching</Pill>}</div>
                        <div className="text-xs text-sand-600">{rule ? `${rule.id} · ${rule.name} · ${rule.trigger}` : l === 'Modality' ? 'Nano bath has no modality-specific rule' : l === 'Stage' ? 'AR-04 applies to energy, not crash reports' : '—'}</div>
                      </div>
                    </li>
                  )
                })}
              </ol>
              <Notice tone="teal" title="Result">Urgent clinical review · threshold from the patient override (AR-06, severity ≥ 6) · routed to Dr. D. by SMS with NP as backup (AR-05) · respond within 30 minutes · after 30 minutes escalate to the Medical Director. The alert shows “Applied layer: Patient override”.</Notice>
            </Card>
          </div>
          <Card title="Order of precedence" subtitle="Most specific wins. Lower layers fill in whatever the winning layer does not set, so there are no hidden contradictions.">
            <ol className="space-y-1.5 text-sm">{layers.map((l, i) => <li key={l} className="flex items-center gap-2"><span className="w-5 text-right text-xs text-sand-400">{i + 1}</span><span className="rounded-md bg-sand-100 px-2 py-1">{l}</span>{i < layers.length - 1 && <span className="text-sand-300">→ overridden by</span>}</li>)}</ol>
            <div className="mt-4"><Field label="Try another scenario"><select className="input"><option>P-0041 · crash severity 7 · after nano bath</option><option>P-0044 · contact requested · after red light</option><option>P-0019 · pain +3 · after laser</option></select></Field></div>
          </Card>
        </div>
      )}
      {tab === 'levels' && (
        <Card title="Alert levels" subtitle="Labels and default thresholds are configurable; the order is fixed.">
          <table className="w-full text-sm"><thead><tr className="bg-sand-50 text-left"><th className="px-3 py-2 eyebrow">Level</th><th className="px-3 py-2 eyebrow">Label shown to staff</th><th className="px-3 py-2 eyebrow">Default response target</th><th className="px-3 py-2 eyebrow">Default recipients</th><th className="px-3 py-2 eyebrow">Patient sees</th></tr></thead><tbody>
            {([['Informational', '3 business days', 'Advisor', 'Nothing extra'], ['Routine review', '2 business days', 'Nursing', 'Nothing extra'], ['Nurse follow-up', '4 business hours', 'Nursing (assigned) · backup charge nurse', '“A nurse will contact you”'], ['Urgent clinical review', '1 hour', 'Treating physician · backup Medical Director', '“Your care team has been notified”'], ['Emergency instruction', 'Immediate', 'Physician on call', 'Call 911 banner']] as const).map(([l, t, r, p]) => <tr key={l} className="border-t border-sand-100"><td className="px-3 py-2"><Pill tone={levelTone[l]}>{l}</Pill></td><td className="px-3 py-2"><input className="input py-1" defaultValue={l} /></td><td className="px-3 py-2">{t}</td><td className="px-3 py-2 text-sand-600">{r}</td><td className="px-3 py-2 text-sand-600">{p}</td></tr>)}
          </tbody></table>
        </Card>
      )}
    </>
  )
}
