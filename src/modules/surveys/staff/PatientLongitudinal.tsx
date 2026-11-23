import { notify } from '../../../mock/store'
import { briefing, lastVisit, nextVisit } from '../../../mock/medications'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Award, Flame, Pill as PillIcon, Sparkles, Sun, TrendingDown, TrendingUp, Trophy, Waves, Zap, Droplets, Syringe, Wind, Activity } from 'lucide-react'
import { Breadcrumb, Card, Notice, PageHeader, Pill, Row, ToConfirm, VersionTag } from '../../../components/ui'
import { patientById } from '../../../mock/patients'
import { nameOf } from '../../../mock/names'
import { alerts, levelTone } from '../../../mock/program'
import { definitions, fmtDay, scoresFor, shiftDays, TODAY, type ScoreEvent, type ScorePoint } from '../../../mock/scores'

/** Stand-alone address (opened from the alert queue). The same panel is a tab of the patient record. */
export default function PatientLongitudinal() {
  const { id = 'P-0041' } = useParams()
  const p = patientById(id)
  return (
    <>
      <Breadcrumb items={[{ label: 'Alert queue', to: '/staff/alerts' }, { label: nameOf(id) }]} />
      <PageHeader eyebrow={`eCW ${p?.ecwId ?? '—'}`} title={nameOf(id)} description="How the patient is doing over time, with therapies, prescription changes, flares and crashes marked on the same chart."
        meta={<><VersionTag>Daily check-in v3</VersionTag><span>Physician: the provider</span>{p && <a className="text-teal-700 underline" href={`#/staff/patients/${id}?tab=scores`}>Open in patient record</a>}</>} />
      <ScoresPanel id={id} />
    </>
  )
}

const ranges = [['1W', 7], ['1M', 30], ['3M', 91], ['6M', 182], ['All', 0]] as const
const modalityIcon: Record<string, { icon: typeof Sun; color: string }> = {
  'Red light therapy': { icon: Sun, color: '#C0392B' }, 'Hydrogen nano bath': { icon: Droplets, color: '#2D6FA3' }, 'Salt room': { icon: Wind, color: '#8B9279' },
  'IV therapy': { icon: Syringe, color: '#6F4B8A' }, 'Erchonia laser': { icon: Zap, color: '#B06A12' }, 'Oxygen nano bath': { icon: Waves, color: '#3A8F8A' },
}
const LINES: { k: 'energy' | 'pain' | 'sleep' | 'digestion'; color: string; label: string; better: 'up' | 'down' }[] = [
  { k: 'energy', color: '#C4A368', label: 'Energy', better: 'up' }, { k: 'pain', color: '#B4382E', label: 'Pain', better: 'down' }, { k: 'sleep', color: '#3A5F8F', label: 'Sleep', better: 'up' }, { k: 'digestion', color: '#5E8C6A', label: 'Digestion', better: 'up' },
]

export function ScoresPanel({ id }: { id: string }) {
  const { points: all, events: allEvents } = useMemo(() => scoresFor(id), [id])
  const [range, setRange] = useState<string>('3M')
  const [from, setFrom] = useState('2026-07-10')
  const [to, setTo] = useState(TODAY)
  const [show, setShow] = useState({ crash: true, flare: true, rx: true, therapy: true })
  const modalities = [...new Set(allEvents.filter((e) => e.modality).map((e) => e.modality!))]
  const [mods, setMods] = useState<string[]>(modalities)
  const [lines, setLines] = useState<string[]>(['energy', 'pain', 'sleep', 'digestion'])

  const [start, end] = range === 'Custom' ? [from, to] : range === 'All' ? [all[0].date, TODAY] : [shiftDays(TODAY, -ranges.find((r) => r[0] === range)![1]), TODAY]
  const points = all.filter((p) => p.date >= start && p.date <= end)
  const events = allEvents.filter((e) => e.date >= start && e.date <= end)
  const pAlerts = alerts.filter((a) => a.patientId === id)

  // progress summary for the selected period
  const first = points[0], last = points[points.length - 1]
  const delta = (k: 'energy' | 'pain' | 'sleep' | 'digestion') => (first && last ? last[k] - first[k] : 0)
  const crashes = events.filter((e) => e.kind === 'crash')
  const lastCrash = [...allEvents].filter((e) => e.kind === 'crash' && e.date <= end).pop()
  const daysSinceCrash = lastCrash ? Math.round((Date.parse(end) - Date.parse(lastCrash.date)) / 864e5) : null
  const wins = (delta('energy') > 0 ? 1 : 0) + (delta('pain') < 0 ? 1 : 0) + (delta('sleep') > 0 ? 1 : 0) + (delta('digestion') > 0 ? 1 : 0)
  const momentum = wins >= 3 ? ['On a roll', 'ok'] : wins === 2 ? ['Gaining ground', 'ok'] : wins === 1 ? ['Mixed', 'warn'] : ['Needs attention', 'bad']
  const badges = [
    delta('energy') >= 2 && { icon: Sparkles, text: `Energy up ${delta('energy')} points` },
    delta('pain') <= -2 && { icon: TrendingDown, text: `Pain down ${-delta('pain')} points` },
    delta('sleep') >= 2 && { icon: Award, text: `Sleep up ${delta('sleep')} points` },
    daysSinceCrash !== null && daysSinceCrash >= 21 && { icon: Trophy, text: `${Math.floor(daysSinceCrash / 7)} weeks without a crash` },
    points.length >= 8 && { icon: Activity, text: `${points.length} check-ins in this period` },
  ].filter(Boolean) as { icon: typeof Sun; text: string }[]

  const toggle = (list: string[], v: string, set: (x: string[]) => void) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])
  const chip = (on: boolean) => `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${on ? 'border-sand-900 bg-sand-900 text-white' : 'border-sand-300 bg-white text-sand-600'}`

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <Card title="Data over time" subtitle="Energy, sleep and digestion: higher is better. Pain: lower is better. Icons mark what happened on each date.">
          {/* period */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-full border border-sand-300 bg-white p-0.5" role="group" aria-label="Period">
              {[...ranges.map((r) => r[0]), 'Custom'].map((r) => <button key={r} onClick={() => setRange(r)} aria-pressed={range === r} className={`rounded-full px-3 py-1 text-xs font-semibold ${range === r ? 'bg-sand-900 text-white' : 'text-sand-600 hover:text-sand-900'}`}>{r}</button>)}
            </div>
            {range === 'Custom' && <span className="flex items-center gap-1.5 text-xs text-sand-500"><input type="date" className="input w-auto py-1 text-sm" value={from} max={to} onChange={(e) => setFrom(e.target.value)} />to<input type="date" className="input w-auto py-1 text-sm" value={to} min={from} max={TODAY} onChange={(e) => setTo(e.target.value)} /></span>}
            <span className="ml-auto text-xs text-sand-500">{fmtDay(start, true)} – {fmtDay(end, true)} · {points.length} check-ins</span>
          </div>
          {/* how it is going */}
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-sand-50 px-3 py-2.5">
            <Pill tone={momentum[1] as 'ok'} dot={false}>{wins >= 2 ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {momentum[0]}</Pill>
            {LINES.map((l) => { const d = delta(l.k); const good = l.better === 'up' ? d > 0 : d < 0; return <span key={l.k} className="text-xs text-sand-600">{l.label} <strong className={d === 0 ? 'text-sand-700' : good ? 'text-ok-700' : 'text-bad-700'}>{d > 0 ? '+' : ''}{d}</strong></span> })}
            <span className="flex flex-wrap gap-1.5">{badges.map((b) => <span key={b.text} className="inline-flex items-center gap-1 rounded-full border border-teal-300 bg-teal-50 px-2 py-0.5 text-[11px] font-medium text-sand-800"><b.icon size={12} className="text-teal-700" />{b.text}</span>)}</span>
          </div>
          <div className="mt-3">{points.length >= 2 ? <LineChart points={points} events={events} show={show} mods={mods} lines={lines} /> : <p className="py-10 text-center text-sm text-sand-500">Not enough check-ins in this period. Choose a longer one.</p>}</div>
          {/* what to show */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-sand-500">Lines</span>
            {LINES.map((l) => <button key={l.k} onClick={() => toggle(lines, l.k, setLines)} className={chip(lines.includes(l.k))}><span className="h-2 w-2 rounded-full" style={{ background: l.color }} />{l.label}</button>)}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-sand-500">Show</span>
            <button title={definitions.crash.text} onClick={() => setShow({ ...show, crash: !show.crash })} className={chip(show.crash)}><Zap size={12} /> Crashes</button>
            <button title={definitions.flare.text} onClick={() => setShow({ ...show, flare: !show.flare })} className={chip(show.flare)}><Flame size={12} /> Flares</button>
            <DefinitionHint />
            <button onClick={() => setShow({ ...show, rx: !show.rx })} className={chip(show.rx)}><PillIcon size={12} /> Prescription changes</button>
            <button onClick={() => setShow({ ...show, therapy: !show.therapy })} className={chip(show.therapy)}><Sun size={12} /> Therapies</button>
          </div>
          {show.therapy && <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-sand-500">Therapy</span>
            {modalities.map((m) => { const I = modalityIcon[m]?.icon ?? Sun; return <button key={m} onClick={() => toggle(mods, m, setMods)} className={chip(mods.includes(m))}><I size={12} style={{ color: mods.includes(m) ? '#fff' : modalityIcon[m]?.color }} />{m}</button> })}
            <button onClick={() => setMods(mods.length === modalities.length ? [] : modalities)} className="text-xs text-teal-700 underline">{mods.length === modalities.length ? 'Clear' : 'All'}</button>
          </div>}
        </Card>

        <Card title="Check-in history" subtitle="One row per check-in in the selected period." padded={false} actions={<div className="flex gap-2"><button className="btn-secondary px-3 py-1.5 text-[11px]" onClick={() => {
          const cell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`
          const ev = (d: string, k: string) => events.filter((e) => e.date === d && e.kind === k).map((e) => (e.detail ? `${e.label}: ${e.detail}` : e.label)).join('; ')
          const lines = [['Date', 'Energy', 'Pain', 'Sleep', 'Digestion', 'Crash', 'Flare', 'Therapy', 'Prescription change'], ...[...points].reverse().map((s) => [s.date, s.energy, s.pain, s.sleep, s.digestion, ev(s.date, 'crash'), ev(s.date, 'flare'), ev(s.date, 'therapy'), ev(s.date, 'rx')])].map((r) => r.map(cell).join(','))
          const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' })); const link = document.createElement('a'); link.href = url; link.download = 'check-in-history.csv'; link.click(); URL.revokeObjectURL(url); notify('Check-in history downloaded')
        }}>Download spreadsheet</button><button className="btn-secondary px-3 py-1.5 text-[11px]" onClick={() => window.print()}>Print or save as PDF</button></div>}>
          <div className="max-h-[420px] overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-sand-50"><tr className="text-left"><th className="px-5 py-2 eyebrow">Date</th><th className="px-3 py-2 eyebrow">Energy</th><th className="px-3 py-2 eyebrow">Pain</th><th className="px-3 py-2 eyebrow">Sleep</th><th className="px-3 py-2 eyebrow">Digestion</th><th className="px-3 py-2 eyebrow">Flare or crash</th><th className="px-3 py-2 eyebrow">Therapy</th><th className="px-3 py-2 eyebrow">Prescription / Rx</th></tr></thead>
              <tbody>{[...points].reverse().map((s) => { const ev = (k: string) => events.filter((e) => e.date === s.date && e.kind === k); return (
                <tr key={s.date} className="border-t border-sand-100 align-top">
                  <td className="px-5 py-2 font-medium whitespace-nowrap">{fmtDay(s.date, true)}</td><td className="px-3 py-2">{s.energy}</td>
                  <td className="px-3 py-2">{s.pain}</td><td className="px-3 py-2">{s.sleep}</td><td className="px-3 py-2">{s.digestion}</td>
                  <td className="px-3 py-2">{ev('crash').map((e) => <div key={e.label} className="flex items-start gap-1 text-bad-700"><Zap size={13} className="mt-0.5 shrink-0" /><span><strong>Crash</strong> · {e.detail}</span></div>)}{ev('flare').map((e) => <div key={e.label} className="flex items-start gap-1 text-warn-700"><Flame size={13} className="mt-0.5 shrink-0" /><span><strong>Flare</strong> · {e.detail}</span></div>)}{!ev('crash').length && !ev('flare').length && <span className="text-sand-300">—</span>}</td>
                  <td className="px-3 py-2">{ev('therapy').map((e) => <div key={e.label}>{e.label}</div>)}{!ev('therapy').length && <span className="text-sand-300">—</span>}</td>
                  <td className="px-3 py-2">{ev('rx').map((e) => <div key={e.label}><span className="font-medium text-plum-600">{e.label}</span><div className="text-xs text-sand-500">{e.detail}</div></div>)}{!ev('rx').length && <span className="text-sand-300">—</span>}</td>
                </tr>) })}</tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="space-y-5">
        <Card title="In this period">
          <Row label="Crashes">{crashes.length}</Row>
          <Row label="Flares">{events.filter((e) => e.kind === 'flare').length}</Row>
          <Row label="Therapy sessions">{events.filter((e) => e.kind === 'therapy').length}</Row>
          <Row label="Prescription changes">{events.filter((e) => e.kind === 'rx').length}</Row>
          <Row label="Days since last crash">{daysSinceCrash ?? '—'}</Row>
        </Card>
        <Card title="Since the last visit" subtitle={`Plan vs. actual · ${lastVisit} to the next visit on ${nextVisit}`}>
          <div className="grid grid-cols-3 gap-2 text-center">{([['Recommended', briefing.recommended.length, 'text-sand-900'], ['Started', briefing.started.length, 'text-ok-700'], ['Not started', briefing.notStarted.length, 'text-bad-700']] as [string, number, string][]).map(([l, n, c]) => <div key={l} className="rounded-xl bg-sand-50 py-2"><div className={`text-2xl font-semibold ${c}`}>{n}</div><div className="text-[11px] text-sand-500">{l}</div></div>)}</div>
          <div className="eyebrow mt-4">Started</div>
          <ul className="mt-1 space-y-1 text-sm">{briefing.started.map((m) => <li key={m.id}><span className="font-medium text-sand-900">{m.name}</span> <span className="text-sand-600">· {m.status.toLowerCase()}{m.frequency ? `, ${m.frequency.toLowerCase()}` : ''} · since {m.started}</span></li>)}</ul>
          <div className="eyebrow mt-3">Not started</div>
          <ul className="mt-1 space-y-1 text-sm">{briefing.notStarted.map((m) => <li key={m.id}><span className="font-medium text-bad-700">{m.name}</span> <span className="text-sand-600">· {m.status.toLowerCase()} · {m.reason?.toLowerCase()} · {m.obtained}</span></li>)}</ul>
          <div className="eyebrow mt-3">Other changes</div>
          <ul className="mt-1 space-y-1 text-sm">{briefing.other.map((m) => <li key={m.id}><span className="font-medium text-sand-900">{m.name}</span> <span className="text-sand-600">· added by the patient {m.ordered} · not yet reviewed</span></li>)}{briefing.unconfirmed.map((m) => <li key={m.id}><span className="font-medium text-sand-900">{m.name}</span> <span className="text-warn-700">· not recently confirmed (last {m.confirmed})</span></li>)}</ul>
          <div className="eyebrow mt-3">For today's visit</div>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-sand-700">{briefing.forToday.map((t) => <li key={t}>{t}</li>)}</ul>
          <p className="help mt-3">As reported by the patient. A report never changes an order; the list is confirmed at the visit by the MA or physician.</p>
          <div className="mt-2 flex flex-wrap gap-2"><button className="btn-secondary text-xs" onClick={() => notify('List marked as reviewed at the visit')}>Mark list reviewed</button><ToConfirm>Fullscript and pharmacy fill data, interaction screening source</ToConfirm></div>
        </Card>
        <Card title="Alerts for this patient">
          {pAlerts.length === 0 && <p className="help">No alerts.</p>}
          <div className="space-y-3">{pAlerts.map((a) => <div key={a.id} className="border-b border-sand-100 pb-3 last:border-0"><div className="flex items-center justify-between gap-2"><Pill tone={levelTone[a.level]}>{a.level}</Pill><span className="text-xs text-sand-500">{a.createdAt}</span></div><div className="mt-1 text-sm text-sand-800">{a.summary}</div><div className="text-xs text-sand-500">{a.status} · {a.assignee}</div></div>)}</div>
        </Card>
        <Card title="Quality of Life questionnaire" subtitle="The SF-36, repeated every 3 months so progress is visible to patient and physician.">
          <div className="space-y-2">{([['Physical functioning', 35, 55], ['Energy / fatigue', 20, 40], ['Emotional well-being', 48, 64], ['Pain', 30, 50], ['General health', 25, 45]] as [string, number, number][]).map(([l, b, n]) => <div key={l}><div className="flex justify-between text-xs"><span className="text-sand-700">{l}</span><span className="text-sand-500">{b} → <strong className="text-sand-900">{n}</strong></span></div><div className="mt-1 h-2 rounded-full bg-sand-100"><div className="h-2 rounded-full bg-teal-300" style={{ width: `${n}%` }}><div className="h-2 rounded-full bg-teal-700" style={{ width: `${(b / n) * 100}%` }} /></div></div></div>)}</div>
          <p className="help mt-3">Dark = baseline (Jun 8) · light = Month 3 (Sep 8). Next one due Dec 8, 2026.</p>
        </Card>
        <Notice tone="plum" title="Charting">Follow-up notes can be copied to eCW from the alert.</Notice>
      </div>
    </div>
  )
}

function DefinitionHint() {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative">
      <button type="button" onClick={() => setOpen(!open)} onBlur={() => setOpen(false)} aria-expanded={open} className="text-xs text-teal-700 underline">What is a flare? A crash?</button>
      {open && <span role="tooltip" className="absolute bottom-full left-0 z-20 mb-2 block w-[340px] rounded-xl border border-sand-200 bg-white p-3 text-left shadow-lg">{(['flare', 'crash'] as const).map((k) => <span key={k} className="mb-2 block last:mb-0"><span className="block text-sm font-semibold text-sand-900">{definitions[k].title}</span><span className="block text-xs leading-relaxed text-sand-600">{definitions[k].text}</span></span>)}</span>}
    </span>
  )
}

function LineChart({ points, events, show, mods, lines }: { points: ScorePoint[]; events: ScoreEvent[]; show: { crash: boolean; flare: boolean; rx: boolean; therapy: boolean }; mods: string[]; lines: string[] }) {
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null)
  const W = 720, H = 300, padL = 28, padR = 22, padT = 34, padB = 58
  const t0 = Date.parse(points[0].date), t1 = Date.parse(points[points.length - 1].date)
  const x = (iso: string) => padL + ((Date.parse(iso) - t0) / Math.max(1, t1 - t0)) * (W - padL - padR)
  const y = (v: number) => padT + (1 - v / 10) * (H - padT - padB)
  const path = (k: 'energy' | 'pain' | 'sleep' | 'digestion') => points.map((s, i) => `${i ? 'L' : 'M'}${x(s.date).toFixed(1)},${y(s[k]).toFixed(1)}`).join(' ')
  const active = LINES.filter((l) => lines.includes(l.k))
  // label only dates that have room: walk from the newest point back, keeping at least 64px between labels
  const labelled = new Set<string>(); { let lastX = Infinity; for (let i = points.length - 1; i >= 0; i--) { const px = x(points[i].date); if (lastX - px >= 64) { labelled.add(points[i].date); lastX = px } } }
  const rx = show.rx ? events.filter((e) => e.kind === 'rx') : []
  const th = show.therapy ? events.filter((e) => e.kind === 'therapy' && mods.includes(e.modality ?? '')) : []
  const cr = show.crash ? events.filter((e) => e.kind === 'crash') : []
  const at = (iso: string) => points.find((p) => p.date === iso)
  const hover = (text: string, cx: number, cy: number) => ({ onMouseEnter: () => setTip({ x: cx, y: cy, text }), onMouseLeave: () => setTip(null) })
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Scores over time with therapies, prescription changes and crashes">
        {[0, 5, 10].map((v) => <g key={v}><line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="#e9e6e1" /><text x={padL - 6} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#7a736a">{v}</text></g>)}
        {/* prescription changes: a shaded band from each change onward would hide the lines, so a marked line with a pill */}
        {rx.map((e) => <g key={e.date + e.label} {...hover(`${fmtDay(e.date)} · ${e.label} · ${e.detail}`, x(e.date), padT)}>
          <line x1={x(e.date)} x2={x(e.date)} y1={padT - 6} y2={H - padB} stroke="#6F4B8A" strokeWidth={1.5} strokeDasharray="4 3" />
          <rect x={x(e.date) - 11} y={padT - 28} width={22} height={22} rx={11} fill="#ECE2F1" stroke="#6F4B8A" /><PillIcon x={x(e.date) - 7} y={padT - 24} width={14} height={14} color="#6F4B8A" />
        </g>)}
        {active.map((l) => <path key={l.k} d={path(l.k)} fill="none" stroke={l.color} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />)}
        {active.map((l) => points.map((s) => <circle key={l.k + s.date} cx={x(s.date)} cy={y(s[l.k])} r="3.2" fill="#fff" stroke={l.color} strokeWidth="2" {...hover(`${fmtDay(s.date)} · ${l.label} ${s[l.k]}`, x(s.date), y(s[l.k]))} />))}
        {/* pain flares */}
        {show.flare && events.filter((e) => e.kind === 'flare').map((e) => { const p = at(e.date); if (!p) return null; const cy = y(Math.max(p.pain, p.energy, p.sleep, p.digestion)) - 16; return <g key={'f' + e.date} {...hover(`${fmtDay(e.date)} · Flare · ${e.detail}`, x(e.date), cy)}><circle cx={x(e.date)} cy={cy} r={11} fill="#F9DCD9" stroke="#B4382E" /><Flame x={x(e.date) - 7} y={cy - 7} width={14} height={14} color="#B4382E" /></g> })}
        {/* crashes: marked where energy drops */}
        {cr.map((e) => { const p = at(e.date); if (!p) return null; const cy = y(Math.min(p.energy, p.sleep, p.digestion, p.pain)) + 18; return <g key={'c' + e.date} {...hover(`${fmtDay(e.date)} · Crash · ${e.detail}`, x(e.date), cy)}><circle cx={x(e.date)} cy={cy} r={11} fill="#141414" /><Zap x={x(e.date) - 7} y={cy - 7} width={14} height={14} color="#D4B77A" fill="#D4B77A" /></g> })}
        {/* therapies along the bottom */}
        <line x1={padL} x2={W - padR} y1={H - padB + 26} y2={H - padB + 26} stroke="#e9e6e1" />
        {th.map((e) => { const m = modalityIcon[e.modality ?? '']; const I = m?.icon ?? Sun; return <g key={e.date + e.label} {...hover(`${fmtDay(e.date)} · ${e.label}`, x(e.date), H - padB + 26)}><line x1={x(e.date)} x2={x(e.date)} y1={padT} y2={H - padB + 16} stroke={m?.color ?? '#a8a197'} strokeOpacity={0.25} /><circle cx={x(e.date)} cy={H - padB + 26} r={10} fill="#fff" stroke={m?.color ?? '#a8a197'} strokeWidth={1.5} /><I x={x(e.date) - 6.5} y={H - padB + 19.5} width={13} height={13} color={m?.color ?? '#7a736a'} /></g> })}
        {points.map((s) => labelled.has(s.date) && <text key={s.date} x={x(s.date)} y={H - 6} textAnchor="middle" fontSize="11" fill="#58524b">{fmtDay(s.date)}</text>)}
      </svg>
      {tip && <div className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md bg-sand-900 px-2 py-1 text-xs text-white shadow" style={{ left: `${(tip.x / W) * 100}%`, top: `${(tip.y / H) * 100}%` }}>{tip.text}</div>}
    </div>
  )
}
