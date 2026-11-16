import { useState } from 'react'
import { Pill } from './ui'
import { addNote, currentUser, noteCategories, notesFor, useStore, type NoteCategory } from '../mock/store'

const catTone: Record<NoteCategory, 'teal' | 'info' | 'warn' | 'plum' | 'ok' | 'neutral'> = { 'Chart prep': 'teal', Intake: 'info', Admission: 'plum', Billing: 'warn', Scheduling: 'ok', General: 'neutral' }

/** Notes for one patient, shared by every tab of the record. A saved note appears in the list straight away. */
export function NotesPanel({ patientId, defaultCategory = 'General', limit, showFilter = true }: { patientId: string; defaultCategory?: NoteCategory; limit?: number; showFilter?: boolean }) {
  useStore()
  const [text, setText] = useState('')
  const [cat, setCat] = useState<NoteCategory>(defaultCategory)
  const [filter, setFilter] = useState<'All' | NoteCategory>('All')
  const all = notesFor(patientId)
  const list = all.filter((n) => filter === 'All' || n.category === filter).slice(0, limit)
  const save = () => { if (!text.trim()) return; addNote(patientId, cat, text); setText(''); setFilter('All') }
  return (
    <div>
      <div className="rounded-xl border border-sand-200 bg-sand-50/60 p-3">
        <div className="flex flex-wrap gap-1.5">{noteCategories.map((c) => <button key={c} type="button" onClick={() => setCat(c)} aria-pressed={cat === c} className={`rounded-full border px-2.5 py-1 text-xs font-medium ${cat === c ? 'border-sand-900 bg-sand-900 text-white' : 'border-sand-300 bg-white text-sand-600'}`}>{c} note</button>)}</div>
        <textarea rows={2} className="input mt-2" placeholder={`Write a ${cat.toLowerCase()} note…`} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) save() }} />
        <div className="mt-2 flex items-center justify-between gap-3"><span className="text-xs text-sand-500">Saved as {currentUser().name} · operational notes only, never part of the medical record</span><button onClick={save} disabled={!text.trim()} className="btn-primary px-4 py-2 text-[11px]">Save note</button></div>
      </div>
      {showFilter && all.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{(['All', ...noteCategories] as const).filter((c) => c === 'All' || all.some((n) => n.category === c)).map((c) => <button key={c} onClick={() => setFilter(c)} className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${filter === c ? 'border-teal-500 bg-teal-50 text-sand-900' : 'border-sand-200 bg-white text-sand-500'}`}>{c}{c !== 'All' && ` · ${all.filter((n) => n.category === c).length}`}</button>)}</div>}
      <ul className="mt-3 divide-y divide-sand-200">
        {list.map((n) => <NoteRow key={n.id} n={n} />)}
        {list.length === 0 && <li className="py-3 text-sm text-sand-500">No notes yet.</li>}
      </ul>
    </div>
  )
}

export function NoteRow({ n }: { n: { category: NoteCategory; text: string; author: string; when: string } }) {
  return (
    <li className="py-2.5 list-none">
      <div className="flex flex-wrap items-center gap-2"><Pill tone={catTone[n.category]} dot={false}>{n.category}</Pill><span className="text-xs text-sand-500">{n.author} · {n.when}</span></div>
      <p className="mt-1 text-sm text-sand-800">{n.text}</p>
    </li>
  )
}
