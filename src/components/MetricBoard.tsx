import { useState } from 'react'
import { ArrowLeft, ArrowRight, Plus, Settings2, X } from 'lucide-react'
import { Stat } from './ui'
import { currentUser } from '../mock/store'

export interface Metric { key: string; label: string; value: React.ReactNode; hint?: string; tone?: 'neutral' | 'ok' | 'warn' | 'bad' | 'teal' | 'info' | 'plum'; to?: string }

/** A row of metric tiles each user arranges for themselves: choose which to show and in what order.
 *  The arrangement is remembered per user and per board. */
export function MetricBoard({ id, metrics, defaults }: { id: string; metrics: Metric[]; defaults: string[] }) {
  const user = currentUser()
  const storeKey = `hlx-metrics:${id}:${user.role}`
  const [keys, setKeys] = useState<string[]>(() => { try { const s = JSON.parse(localStorage.getItem(storeKey) ?? 'null'); if (Array.isArray(s)) return s.filter((k) => metrics.some((m) => m.key === k)) } catch { /* ignore */ } return defaults })
  const [editing, setEditing] = useState(false)
  const save = (next: string[]) => { setKeys(next); try { localStorage.setItem(storeKey, JSON.stringify(next)) } catch { /* ignore */ } }
  const move = (k: string, d: -1 | 1) => { const i = keys.indexOf(k), j = i + d; if (j < 0 || j >= keys.length) return; const n = [...keys]; [n[i], n[j]] = [n[j], n[i]]; save(n) }
  const shown = keys.map((k) => metrics.find((m) => m.key === k)!).filter(Boolean)
  const hidden = metrics.filter((m) => !keys.includes(m.key))
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs text-sand-500">{editing ? `Arranging the view for ${user.name}. Changes save as you go.` : `Your metrics · saved for ${user.name}`}</span>
        <div className="flex gap-2">
          {editing && <button onClick={() => save(defaults)} className="btn-ghost px-2.5 py-1 text-xs">Reset</button>}
          <button onClick={() => setEditing(!editing)} className={`${editing ? 'btn-primary' : 'btn-secondary'} px-3 py-1.5 text-[11px]`}><Settings2 size={13} /> {editing ? 'Done' : 'Customize'}</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {shown.map((m, i) => (
          <div key={m.key} className="relative">
            <Stat label={m.label} value={m.value} hint={m.hint} tone={m.tone} to={editing ? undefined : m.to} />
            {editing && (
              <div className="absolute inset-0 flex items-end justify-between rounded-2xl border-2 border-dashed border-teal-400 bg-white/70 p-1.5">
                <div className="flex gap-1">
                  <button aria-label={`Move ${m.label} left`} disabled={i === 0} onClick={() => move(m.key, -1)} className="rounded-md border border-sand-300 bg-white p-1 disabled:opacity-30"><ArrowLeft size={13} /></button>
                  <button aria-label={`Move ${m.label} right`} disabled={i === shown.length - 1} onClick={() => move(m.key, 1)} className="rounded-md border border-sand-300 bg-white p-1 disabled:opacity-30"><ArrowRight size={13} /></button>
                </div>
                <button aria-label={`Hide ${m.label}`} onClick={() => save(keys.filter((k) => k !== m.key))} className="rounded-md border border-sand-300 bg-white p-1 text-bad-700"><X size={13} /></button>
              </div>
            )}
          </div>
        ))}
        {shown.length === 0 && <p className="col-span-full rounded-xl border border-dashed border-sand-300 p-4 text-sm text-sand-500">No metrics shown. Choose Customize to add some.</p>}
      </div>
      {editing && hidden.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2"><span className="text-xs text-sand-500">Add a metric:</span>
          {hidden.map((m) => <button key={m.key} onClick={() => save([...keys, m.key])} className="inline-flex items-center gap-1 rounded-full border border-sand-300 bg-white px-2.5 py-1 text-xs text-sand-700 hover:border-teal-400"><Plus size={12} />{m.label}</button>)}
        </div>
      )}
    </div>
  )
}
