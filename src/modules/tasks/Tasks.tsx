import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Plus, Trash2 } from 'lucide-react'
import { Card, PageHeader, Pill } from '../../components/ui'
import { addTask, allTasks, currentUser, notify, patchTask, removeTask, useStore } from '../../mock/store'

/** Tasks and reminders. A reminder is created from a note on an inquiry (or added here) and can be edited:
 *  what to do, when it is due, and whether it is done. */
const TODAY = '2026-10-09'
const fmt = (iso: string) => (iso ? new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'No date')

export default function Tasks() {
  useStore()
  const me = currentUser()
  const [scope, setScope] = useState<'Mine' | 'Everyone'>('Mine')
  const [showDone, setShowDone] = useState(false)
  const [draft, setDraft] = useState({ title: '', due: '' })
  const list = allTasks().filter((t) => (scope === 'Everyone' || t.owner === me.name) && (showDone || !t.done)).sort((a, b) => Number(a.done) - Number(b.done) || a.due.localeCompare(b.due))
  return (
    <>
      <PageHeader eyebrow="People" title="Tasks & reminders" description="What you need to do, grouped by person. Reminders come from the notes you save on an inquiry, or you add them here. Each one can be changed, moved to another day or marked done." />
      <div className="grid gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card title="Open reminders" actions={<div className="flex items-center gap-2"><div className="flex rounded-full border border-sand-300 p-0.5 text-xs">{(['Mine', 'Everyone'] as const).map((s) => <button key={s} onClick={() => setScope(s)} className={`rounded-full px-3 py-1 font-medium ${scope === s ? 'bg-sand-900 text-white' : 'text-sand-600'}`}>{s}</button>)}</div><label className="flex items-center gap-1.5 text-xs text-sand-600"><input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} /> Show done</label></div>}>
            {list.length === 0 && <p className="help">Nothing to do right now.</p>}
            {[...new Set(list.map((t) => t.about))].map((person) => <div key={person} className="mb-4 last:mb-0">
              <div className="flex items-center justify-between border-b border-sand-200 pb-1.5"><span className="text-sm font-semibold text-sand-900">{person}</span><span className="text-xs text-sand-500">{list.filter((t) => t.about === person && !t.done).length} open</span></div>
              <ul className="divide-y divide-sand-100">{list.filter((t) => t.about === person).map((t) => { const late = !t.done && t.due && t.due < TODAY; return (
              <li key={t.id} className="flex flex-wrap items-center gap-3 py-3">
                <button aria-label={t.done ? 'Mark as not done' : 'Mark as done'} onClick={() => { patchTask(t.id, { done: !t.done }); notify(t.done ? 'Reopened' : 'Marked done') }} className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${t.done ? 'border-ok-600 bg-ok-600 text-white' : 'border-sand-400'}`}>{t.done && <Check size={13} />}</button>
                <div className="min-w-[220px] flex-1">
                  <input aria-label="What to do" className={`w-full rounded-md border border-transparent bg-transparent px-1 py-0.5 text-[15px] font-semibold text-sand-900 hover:border-sand-300 focus:border-teal-400 focus:outline-none ${t.done ? 'line-through opacity-60' : ''}`} value={t.title} onChange={(e) => patchTask(t.id, { title: e.target.value })} />
                  <div className="px-1 text-xs text-sand-500"><Link to={t.link} className="font-medium text-sand-700 hover:underline">{t.about}</Link> · {t.owner} · created {t.created}</div>
                </div>
                {late ? <Pill tone="bad">Overdue</Pill> : t.due === TODAY ? <Pill tone="warn">Today</Pill> : null}
                <label className="flex items-center gap-2 text-xs text-sand-500">Due<input type="date" className="input w-auto py-1.5 text-sm" value={t.due} onChange={(e) => patchTask(t.id, { due: e.target.value })} /></label>
                <span className="hidden w-24 text-right text-xs text-sand-500 lg:block">{fmt(t.due)}</span>
                <button aria-label="Delete reminder" className="btn-ghost px-2 py-1 text-sand-500" onClick={() => { removeTask(t.id); notify('Reminder deleted') }}><Trash2 size={15} /></button>
              </li>) })}</ul>
            </div>)}
          </Card>
        </div>
        <Card title="Add a reminder">
          <label className="block text-sm font-medium text-sand-800">What to do<input className="input mt-1" placeholder="For example call back about the plan document" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
          <label className="mt-3 block text-sm font-medium text-sand-800">Due<input type="date" className="input mt-1" value={draft.due} onChange={(e) => setDraft({ ...draft, due: e.target.value })} /></label>
          <button disabled={!draft.title.trim() || !draft.due} className="btn-primary mt-3 w-full" onClick={() => { addTask({ title: draft.title.trim(), due: draft.due, about: 'General', link: '/staff/tasks' }); setDraft({ title: '', due: '' }); notify('Reminder added') }}><Plus size={15} /> Add reminder</button>
          <p className="help mt-3">To attach a reminder to a person, save a note on their inquiry and tick "Remind me about this".</p>
        </Card>
      </div>
    </>
  )
}
