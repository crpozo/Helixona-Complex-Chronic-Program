import { useState } from 'react'
import { Send } from 'lucide-react'
import { Card, Field, PageHeader, Pill, QueueTable, Tabs, Toast, VersionTag, type Column } from '../../components/ui'
import { deliveryLog, messageTemplates, type DeliveryLog, type MessageTemplate } from '../../mock/program'
import { stateTone, StateFlow } from '../config/SurveyBuilder'

export default function MessageTemplates() {
  const [tab, setTab] = useState('templates')
  const [sel, setSel] = useState<MessageTemplate>(messageTemplates[2])
  const [toast, setToast] = useState<string | null>(null)
  const show = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2200) }
  const columns: Column<MessageTemplate>[] = [
    { key: 'name', header: 'Template', render: (r) => <><div className="font-semibold text-sand-900">{r.name} <VersionTag>v{r.version}</VersionTag></div><div className="text-xs text-sand-500">{r.id} · {r.event}</div></> },
    { key: 'aud', header: 'Audience · channel', render: (r) => <><div>{r.audience}</div><div className="text-xs text-sand-500">{r.channel}</div></> },
    { key: 'timing', header: 'Timing', render: (r) => <span className="text-xs">{r.timing}</span> },
    { key: 'stop', header: 'Stop rule', render: (r) => <span className="text-xs text-sand-600">{r.stopRule}</span> },
    { key: 'state', header: 'State', render: (r) => <Pill tone={stateTone[r.state]}>{r.state}</Pill> },
  ]
  const logCols: Column<DeliveryLog>[] = [
    { key: 'when', header: 'When', render: (r) => <span className="text-xs">{r.when}</span> },
    { key: 'tpl', header: 'Template', render: (r) => r.template },
    { key: 'aud', header: 'Recipient', render: (r) => r.audience },
    { key: 'ch', header: 'Channel', render: (r) => r.channel },
    { key: 'res', header: 'Result', render: (r) => <Pill tone={r.result === 'Delivered' || r.result === 'Opened' ? 'ok' : r.result === 'Failed' ? 'bad' : r.result === 'Opted out' ? 'warn' : 'teal'}>{r.result}</Pill> },
    { key: 'detail', header: 'Detail', render: (r) => <span className="text-xs text-sand-600">{r.detail}</span> },
  ]
  const preview = sel.body.replace('{{first_name}}', 'Marisol').replace('{{secure_link}}', 'hlx.care/i/8f2k').replace('{{expiry_days}}', '14').replace('{{payment_link}}', 'hlx.care/pay/3n1a').replace('{{survey_link}}', 'hlx.care/s/7qp2').replace('{{alert_level}}', 'Nurse follow-up').replace('{{patient_id}}', 'P-0044').replace('{{queue_link}}', 'hlx.care/q').replace('{{agreement_link}}', 'hlx.care/a/9k2m').replace('{{physician}}', 'D.').replace('{{offset_days}}', '1')
  return (
    <>
      <Toast message={toast} />
      <PageHeader eyebrow="Configuration · Program admin" title="Message templates" description="Every email and text is a configuration record: event, audience, channel, timing, template with merge fields, stop rule. Patient messages carry the minimum information needed." actions={<button className="btn-primary">+ New template</button>} />
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'templates', label: 'Templates', count: messageTemplates.length }, { key: 'log', label: 'Delivery log' }]} />
      {tab === 'templates' ? (
        <div className="grid gap-5 xl:grid-cols-5">
          <div className="xl:col-span-3"><QueueTable rows={messageTemplates} columns={columns} rowKey={(r) => r.id} rowTone={(r) => stateTone[r.state]} onRowClick={setSel} /></div>
          <div className="xl:col-span-2">
            <Card title={<span className="flex items-center gap-2">{sel.name} <VersionTag>v{sel.version}</VersionTag></span>} subtitle={`${sel.event} → ${sel.audience} · ${sel.channel}`} actions={<Pill tone={stateTone[sel.state]}>{sel.state}</Pill>}>
              <div className="mb-3"><StateFlow state={sel.state} /></div>
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3"><Field label="Timing"><input className="input" defaultValue={sel.timing} /></Field><Field label="Max sends"><input className="input" defaultValue={sel.maxSends} /></Field></div>
                <Field label="Stop rule"><input className="input" defaultValue={sel.stopRule} /></Field>
                {sel.subject !== '—' && <Field label="Subject"><input className="input" defaultValue={sel.subject} /></Field>}
                <Field label="Body" hint="Merge fields: {{first_name}} {{secure_link}} {{payment_link}} {{survey_link}} {{physician}} — no diagnoses or clinical details."><textarea rows={4} className="input font-mono text-[13px]" defaultValue={sel.body} /></Field>
                <div className="grid grid-cols-2 gap-3"><Field label="Reply-to"><select className="input"><option>care@helixona.com (monitored)</option><option>No-reply</option></select></Field><Field label="Escalation on failure"><select className="input"><option>Create advisor task</option><option>None</option></select></Field></div>
                <div className="rounded-xl bg-sand-100 p-3 text-sm text-sand-700"><div className="eyebrow mb-1">Preview · {sel.channel.includes('SMS') ? 'text message' : 'email'}</div>{sel.subject !== '—' && <div className="font-semibold">{sel.subject}</div>}<div>{preview}</div></div>
                <div className="flex gap-2"><button onClick={() => show('Test message sent to ap@helixona.com')} className="btn-secondary"><Send size={14} /> Test-send to me</button><button className="btn-primary">Save as v{sel.version + 1}</button></div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <>
          <QueueTable rows={deliveryLog} columns={logCols} rowKey={(r) => r.id} rowTone={(r) => (r.result === 'Failed' ? 'bad' : r.result === 'Opted out' ? 'warn' : 'ok')} />
          <p className="help mt-3">Each entry records template version, recipient, channel, time, delivery result and originating event. Export available to program admins; exports containing patient data are logged.</p>
        </>
      )}
    </>
  )
}
