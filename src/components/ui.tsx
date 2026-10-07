import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Info, ShieldAlert } from 'lucide-react'

/* ---------- Status pill (state is text + tone, never color alone) ---------- */
export type Tone = 'neutral' | 'teal' | 'ok' | 'warn' | 'bad' | 'info' | 'plum'

const toneClass: Record<Tone, string> = {
  neutral: 'bg-sand-100 text-sand-700 border-sand-200',
  teal: 'bg-teal-50 text-teal-700 border-teal-200',
  ok: 'bg-ok-100 text-ok-700 border-ok-600/20',
  warn: 'bg-warn-100 text-warn-700 border-warn-600/20',
  bad: 'bg-bad-100 text-bad-700 border-bad-600/20',
  info: 'bg-info-100 text-info-700 border-info-600/20',
  plum: 'bg-plum-100 text-plum-600 border-plum-600/20',
}

export const stripeColor: Record<Tone, string> = {
  neutral: 'var(--color-sand-300)', teal: 'var(--color-teal-500)', ok: 'var(--color-ok-600)',
  warn: 'var(--color-warn-600)', bad: 'var(--color-bad-600)', info: 'var(--color-info-600)', plum: 'var(--color-plum-600)',
}

export function Pill({ tone = 'neutral', children, dot = true, className = '' }: { tone?: Tone; children: ReactNode; dot?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${toneClass[tone]} ${className}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />}
      {children}
    </span>
  )
}

/** Maps domain statuses to a tone, shared across every queue. */
export function toneFor(status: string): Tone {
  const s = status.toLowerCase()
  if (/(exception|denied|failed|overdue|escalated|critical|discharged|missing|expired)/.test(s)) return 'bad'
  if (/(returned|pending|awaiting|outreach|review|retry|warning|paused|fell off|partial|viewed|started|not offered|declined)/.test(s)) return 'warn'
  if (/(placed|active|accepted|signed|complete|verified|uploaded|closed|submitted|synced|delivered|graduated|resolved)/.test(s)) return 'ok'
  if (/(ready|offered|scheduled|in progress|opened|sent|reissued)/.test(s)) return 'teal'
  if (/(inquiry|received|optional|not started|maintenance)/.test(s)) return 'neutral'
  return 'info'
}

/* ---------- Page header ---------- */
export function PageHeader({ eyebrow, title, description, actions, meta }: { eyebrow?: string; title: string; description?: ReactNode; actions?: ReactNode; meta?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <div className="eyebrow mb-1">{eyebrow}</div>}
        <h1 className="font-display text-[28px] leading-tight font-semibold text-sand-900">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-[15px] text-sand-600">{description}</p>}
        {meta && <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-sand-500">{meta}</div>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

/* ---------- Cards ---------- */
export function Card({ title, subtitle, children, actions, className = '', padded = true }: { title?: ReactNode; subtitle?: ReactNode; children: ReactNode; actions?: ReactNode; className?: string; padded?: boolean }) {
  return (
    <section className={`card ${className}`}>
      {(title || actions) && (
        <header className="flex items-start justify-between gap-3 border-b border-sand-100 px-5 py-3.5">
          <div>
            {title && <h2 className="text-[15px] font-semibold text-sand-900">{title}</h2>}
            {subtitle && <p className="help mt-0.5">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className={padded ? 'p-5' : ''}>{children}</div>
    </section>
  )
}

export function Stat({ label, value, hint, tone = 'neutral', to }: { label: string; value: ReactNode; hint?: string; tone?: Tone; to?: string }) {
  const body = (
    <div className="card p-4 h-full">
      <div className="eyebrow">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <div className="text-2xl font-semibold text-sand-900">{value}</div>
        {hint && <Pill tone={tone} dot={false}>{hint}</Pill>}
      </div>
    </div>
  )
  return to ? <Link to={to} className="block hover:-translate-y-px transition-transform">{body}</Link> : body
}

/* ---------- Queue table (shared pattern across all staff queues) ---------- */
export interface Column<T> { key: string; header: ReactNode; render: (row: T) => ReactNode; className?: string; width?: string }

export function QueueTable<T>({ rows, columns, rowTone, onRowClick, rowKey, empty = 'Nothing here right now.' }: {
  rows: T[]; columns: Column<T>[]; rowTone?: (row: T) => Tone; onRowClick?: (row: T) => void; rowKey: (row: T) => string; empty?: string
}) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-sand-50 text-left">
              {columns.map((c) => (
                <th key={c.key} style={{ width: c.width }} className={`px-4 py-2.5 eyebrow font-semibold ${c.className ?? ''}`}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={columns.length} className="px-4 py-10 text-center text-sand-500">{empty}</td></tr>
            )}
            {rows.map((r) => (
              <tr
                key={rowKey(r)}
                onClick={onRowClick ? () => onRowClick(r) : undefined}
                className={`border-t border-sand-100 ${onRowClick ? 'cursor-pointer hover:bg-teal-50/50' : ''}`}
              >
                {columns.map((c, i) => (
                  <td key={c.key} style={i === 0 ? { boxShadow: `inset 4px 0 0 ${rowTone ? stripeColor[rowTone(r)] : 'transparent'}` } : undefined} className={`px-4 py-3 align-top ${i === 0 ? 'pl-5' : ''} ${c.className ?? ''}`}>{c.render(r)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ---------- Who / when / why ---------- */
export function AuditList({ entries, compact = false }: { entries: { actor: string; when: string; action: string; reason?: string }[]; compact?: boolean }) {
  if (entries.length === 0) return <p className="help">No activity yet.</p>
  return (
    <ol className="relative border-l border-sand-200 ml-1.5">
      {entries.map((e, i) => (
        <li key={i} className={`ml-4 ${compact ? 'pb-3' : 'pb-4'} last:pb-0`}>
          <span className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-teal-500" />
          <div className="text-sm text-sand-900 font-medium">{e.action}</div>
          <div className="text-xs text-sand-500">
            <span className="font-medium text-sand-600">{e.actor}</span> · {e.when}
            {e.reason && <span className="text-sand-500"> · {e.reason}</span>}
          </div>
        </li>
      ))}
    </ol>
  )
}

export function WhoWhenWhy({ actor, when, reason }: { actor: string; when: string; reason?: string }) {
  return (
    <div className="text-xs text-sand-500 leading-snug">
      <div><span className="font-medium text-sand-600">{actor}</span> · {when}</div>
      {reason && <div className="text-sand-500">{reason}</div>}
    </div>
  )
}

/* ---------- Notices ---------- */
export function Notice({ tone = 'info', title, children, icon }: { tone?: Tone; title?: string; children: ReactNode; icon?: ReactNode }) {
  return (
    <div className={`flex gap-3 rounded-xl border px-4 py-3 text-sm ${toneClass[tone]}`}>
      <div className="mt-0.5 shrink-0">{icon ?? <Info size={16} />}</div>
      <div>
        {title && <div className="font-semibold">{title}</div>}
        <div className={title ? 'mt-0.5 opacity-90' : ''}>{children}</div>
      </div>
    </div>
  )
}

/** Required on survey, crash-report and patient-home screens (CLAUDE.md §2). */
export function MonitoringNotice() {
  return (
    <Notice tone="warn" icon={<ShieldAlert size={16} />} title="Not continuously monitored">
      Your care team reviews submissions during clinic hours. This is not a substitute for 911 or emergency care. If you think you are having an emergency, call 911 now.
    </Notice>
  )
}

export function SampleBadge({ children = 'Sample question — final content from Medical Director' }: { children?: ReactNode }) {
  return <span className="inline-block rounded-md border border-dashed border-plum-600/40 bg-plum-100/60 px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-plum-600">{children}</span>
}

export function ToConfirm({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-1 rounded-md border border-dashed border-warn-600/40 bg-warn-100/70 px-1.5 py-0.5 text-[11px] font-semibold text-warn-700">To confirm · {children}</span>
}

export function VersionTag({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center rounded-md bg-sand-100 px-2 py-0.5 text-xs text-sand-600 border border-sand-200">{children}</span>
}

/* ---------- Form fields ---------- */
export function Field({ label, hint, required, children, error }: { label: ReactNode; hint?: string; required?: boolean; children: ReactNode; error?: string }) {
  return (
    <label className="block">
      <span className="label">
        {label} {required && <span className="text-bad-600" aria-label="required">*</span>}
      </span>
      {children}
      {hint && !error && <span className="help mt-1 block">{hint}</span>}
      {error && <span className="mt-1 block text-sm text-bad-700 font-medium">{error}</span>}
    </label>
  )
}

export function Choice({ label, selected, onClick, multiple = false, size = 'md' }: { label: string; selected: boolean; onClick: () => void; multiple?: boolean; size?: 'md' | 'lg' }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={selected}
      className={`flex w-full items-center gap-3 rounded-xl border text-left transition-colors ${size === 'lg' ? 'px-4 py-3.5 text-[16px]' : 'px-3.5 py-2.5 text-[15px]'} ${selected ? 'border-teal-500 bg-teal-50 text-teal-900' : 'border-sand-300 bg-white hover:bg-sand-50'}`}>
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center border ${multiple ? 'rounded-md' : 'rounded-full'} ${selected ? 'border-teal-600 bg-teal-600' : 'border-sand-400 bg-white'}`}>
        {selected && <span className={`bg-white ${multiple ? 'h-2.5 w-2.5 rounded-sm' : 'h-2 w-2 rounded-full'}`} />}
      </span>
      {label}
    </button>
  )
}

/* ---------- Tabs ---------- */
export function Tabs({ tabs, value, onChange }: { tabs: { key: string; label: ReactNode; count?: number }[]; value: string; onChange: (k: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-sand-200 mb-4">
      {tabs.map((t) => (
        <button key={t.key} onClick={() => onChange(t.key)}
          className={`-mb-px flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium ${value === t.key ? 'border-teal-600 text-teal-800' : 'border-transparent text-sand-500 hover:text-sand-800'}`}>
          {t.label}
          {t.count !== undefined && <span className={`rounded-full px-1.5 text-xs ${value === t.key ? 'bg-teal-100 text-teal-800' : 'bg-sand-100 text-sand-600'}`}>{t.count}</span>}
        </button>
      ))}
    </div>
  )
}

/* ---------- Misc ---------- */
export function Row({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-sand-100 last:border-0 text-sm">
      <div className="text-sand-500 shrink-0">{label}</div>
      <div className="text-right text-sand-900 font-medium">{children}</div>
    </div>
  )
}

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="mb-3 flex items-center gap-1 text-sm text-sand-500">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1">
          {it.to ? <Link to={it.to} className="hover:text-teal-700">{it.label}</Link> : <span className="text-sand-700">{it.label}</span>}
          {i < items.length - 1 && <ChevronRight size={14} />}
        </span>
      ))}
    </nav>
  )
}

export function Toast({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-sand-900 px-4 py-2 text-sm text-white shadow-lg">
      {message}
    </div>
  )
}
