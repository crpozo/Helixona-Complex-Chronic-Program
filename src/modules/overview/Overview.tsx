import { Link } from 'react-router-dom'
import { ArrowRight, Smartphone, UserRound } from 'lucide-react'
import { Card, Notice, PageHeader, Pill } from '../../components/ui'
import { screens } from './screens'

export default function Overview() {
  const groups = [...new Set(screens.map((s) => s.group))]
  return (
    <>
      <PageHeader eyebrow="Mockup index" title="Complex Chronic Program · MVP mockups"
        description="Clickable mockups for the operational app that sits next to eCW. Click any screen to open it, or use the role switcher in the top bar to browse as a patient or staff member. All data is sample data."
        meta={<><Pill tone="teal" dot={false}>Priority 1 · Intake module</Pill><Link to="/staff/inquiries" className="btn-primary px-3 py-1">Open the app</Link><Pill tone="plum" dot={false}>Priority 2–3 · placeholders</Pill></>} />
      <div className="mb-6"><Notice tone="warn" title="For reviewers">Clinical questions are placeholders labeled “Sample question — final content from Medical Director”. Items marked “To confirm” are open questions listed in CLAUDE.md §8, not decisions.</Notice></div>
      <div className="grid gap-5 lg:grid-cols-2">
        {groups.map((g) => (
          <Card key={g} title={g} padded={false}>
            <ul className="divide-y divide-sand-100">
              {screens.filter((s) => s.group === g).map((s) => (
                <li key={s.path}>
                  <Link to={s.path} className="flex items-center gap-3 px-5 py-3 hover:bg-teal-50/50">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sand-100 text-sand-500">{s.surface === 'patient' ? <Smartphone size={15} /> : <UserRound size={15} />}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-sm font-semibold text-sand-900">{s.n}. {s.title}{s.phase > 1 && <Pill tone="plum" dot={false}>P{s.phase}</Pill>}</span>
                      <span className="block text-xs text-sand-500">{s.purpose}</span>
                    </span>
                    <ArrowRight size={15} className="text-sand-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </>
  )
}
