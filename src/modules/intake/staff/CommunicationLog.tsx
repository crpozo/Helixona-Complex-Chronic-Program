import { useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Mail, MessageSquareText, Phone, Plus } from 'lucide-react'
import { Card, Field, Pill } from '../../../components/ui'

/** Every contact with a patient or inquiry: text, email or call, with its topic, who handled it and when.
 *  Automatic messages (invitation, reminders) appear here too, so staff see one timeline. */
type Channel = 'Text' | 'Email' | 'Call'
interface Entry { id: string; channel: Channel; direction: 'Outgoing' | 'Incoming'; topic: string; summary: string; who: string; when: string; outcome?: string; automatic?: boolean }

const topics = ['First contact', 'Screening call', 'Insurance', 'Invitation and intake', 'Missing documents', 'Scheduling', 'Billing', 'Clinical follow-up', 'Other']
const outcomes: Record<Channel, string[]> = { Call: ['Spoke with patient', 'Left voicemail', 'No answer', 'Wrong number'], Text: ['Delivered', 'Patient replied', 'Not delivered'], Email: ['Delivered', 'Patient replied', 'Bounced'] }
const icon = (c: Channel) => (c === 'Call' ? <Phone size={15} /> : c === 'Email' ? <Mail size={15} /> : <MessageSquareText size={15} />)

const sample: Entry[] = [
  { id: 'C-5', channel: 'Call', direction: 'Outgoing', topic: 'Missing documents', summary: 'Asked for pages 3–4 of the lab report. Patient will upload tonight.', who: 'Ana', when: 'Oct 7, 2026 · 2:15 PM', outcome: 'Spoke with patient' },
  { id: 'C-4', channel: 'Text', direction: 'Incoming', topic: 'Scheduling', summary: 'Asked whether Thursday mornings are possible for the assessment visit.', who: 'Patient', when: 'Oct 6, 2026 · 9:02 AM', outcome: 'Patient replied' },
  { id: 'C-3', channel: 'Email', direction: 'Outgoing', topic: 'Invitation and intake', summary: 'Secure invitation sent (template Invitation v2).', who: 'System', when: 'Oct 2, 2026 · 10:30 AM', outcome: 'Delivered', automatic: true },
  { id: 'C-2', channel: 'Call', direction: 'Outgoing', topic: 'Screening call', summary: 'Qualification interview completed. Understands A&P fee. Prefers texting.', who: 'Ana', when: 'Sep 30, 2026 · 11:00 AM', outcome: 'Spoke with patient' },
  { id: 'C-1', channel: 'Call', direction: 'Outgoing', topic: 'First contact', summary: 'First call after website inquiry.', who: 'Marie', when: 'Sep 29, 2026 · 4:40 PM', outcome: 'Left voicemail' },
]

export default function CommunicationLog({ actor = 'Ana' }: { actor?: string }) {
  const [entries, setEntries] = useState(sample)
  const [adding, setAdding] = useState(false)
  const [filter, setFilter] = useState<'All' | Channel>('All')
  const [d, setD] = useState<{ channel: Channel; direction: Entry['direction']; topic: string; outcome: string; summary: string }>({ channel: 'Call', direction: 'Outgoing', topic: topics[0], outcome: outcomes.Call[0], summary: '' })
  const shown = entries.filter((e) => filter === 'All' || e.channel === filter)
  const save = () => {
    const when = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).replace(/, (\d{1,2}:)/, ' · $1')
    setEntries([{ id: `C-${entries.length + 1}`, ...d, who: actor, when }, ...entries]); setAdding(false); setD({ ...d, summary: '' })
  }
  return (
    <Card title="Communication log" subtitle="Every text, email and call with this patient: topic, who, when and what happened." actions={!adding && <button onClick={() => setAdding(true)} className="btn-primary px-3 py-1.5 text-xs"><Plus size={14} /> Log communication</button>}>
      {adding && (
        <div className="mb-5 rounded-xl border border-teal-300 bg-teal-50/60 p-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Channel"><div className="flex gap-1.5">{(['Call', 'Text', 'Email'] as Channel[]).map((c) => <button key={c} type="button" onClick={() => setD({ ...d, channel: c, outcome: outcomes[c][0] })} className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-sm font-medium ${d.channel === c ? 'border-teal-500 bg-white text-sand-900' : 'border-sand-300 bg-white text-sand-600'}`}>{icon(c)}{c}</button>)}</div></Field>
            <Field label="Direction"><select className="input" value={d.direction} onChange={(e) => setD({ ...d, direction: e.target.value as Entry['direction'] })}><option value="Outgoing">We contacted the patient</option><option value="Incoming">The patient contacted us</option></select></Field>
            <Field label="Topic" required><select className="input" value={d.topic} onChange={(e) => setD({ ...d, topic: e.target.value })}>{topics.map((t) => <option key={t}>{t}</option>)}</select></Field>
            <Field label="Result"><select className="input" value={d.outcome} onChange={(e) => setD({ ...d, outcome: e.target.value })}>{outcomes[d.channel].map((o) => <option key={o}>{o}</option>)}</select></Field>
          </div>
          <div className="mt-4"><Field label="What was said" required hint="Operational notes only. Clinical details belong in the chart."><textarea rows={2} className="input" value={d.summary} onChange={(e) => setD({ ...d, summary: e.target.value })} placeholder="Short summary of the conversation or message" /></Field></div>
          <div className="mt-3 flex items-center justify-between gap-3"><span className="text-xs text-sand-500">Saved as {actor} · now</span><div className="flex gap-2"><button onClick={() => setAdding(false)} className="btn-ghost px-3 py-2 text-sm">Cancel</button><button disabled={!d.summary.trim()} onClick={save} className="btn-primary px-4 py-2 text-xs">Save to log</button></div></div>
        </div>
      )}
      <div className="mb-3 flex gap-1.5">{(['All', 'Call', 'Text', 'Email'] as const).map((c) => <button key={c} onClick={() => setFilter(c)} className={`rounded-full border px-3 py-1 text-xs font-medium ${filter === c ? 'border-sand-900 bg-sand-900 text-white' : 'border-sand-300 bg-white text-sand-600'}`}>{c}{c !== 'All' && ` · ${entries.filter((e) => e.channel === c).length}`}</button>)}</div>
      <ul className="divide-y divide-sand-200">
        {shown.map((e) => (
          <li key={e.id} className="flex gap-3 py-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">{icon(e.channel)}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2"><span className="font-semibold text-sand-900">{e.topic}</span><Pill dot={false}>{e.channel}</Pill><span className="inline-flex items-center gap-1 text-xs text-sand-500">{e.direction === 'Outgoing' ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}{e.direction}</span>{e.outcome && <Pill dot={false} tone={/Spoke|replied|Delivered/.test(e.outcome) ? 'ok' : 'warn'}>{e.outcome}</Pill>}{e.automatic && <Pill dot={false} tone="info">Automatic</Pill>}</div>
              <p className="mt-0.5 text-sm text-sand-700">{e.summary}</p>
              <div className="mt-0.5 text-xs text-sand-500">{e.who} · {e.when}</div>
            </div>
          </li>
        ))}
        {shown.length === 0 && <li className="py-4 text-sm text-sand-500">Nothing logged on this channel yet.</li>}
      </ul>
    </Card>
  )
}
