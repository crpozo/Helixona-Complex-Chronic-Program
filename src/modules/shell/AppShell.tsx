import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, LayoutGrid, Smartphone, UserRound } from 'lucide-react'
import type { Role } from '../../mock/types'
import { nav, roles } from './roles'
import { Wordmark } from '../../components/PhoneFrame'
import { Pill } from '../../components/ui'

interface ShellCtx { role: Role; setRole: (r: Role) => void }
const Ctx = createContext<ShellCtx>({ role: 'advisor', setRole: () => {} })
export const useShell = () => useContext(Ctx)

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isPatient = location.pathname.startsWith('/patient')
  const [role, setRoleState] = useState<Role>(() => {
    try { return (localStorage.getItem('hlx-role') as Role) || 'advisor' } catch { return 'advisor' }
  })
  useEffect(() => { if (isPatient && role !== 'patient') setRoleState('patient') }, [isPatient, role])
  useEffect(() => { if (!isPatient && role === 'patient' && location.pathname !== '/') setRoleState('advisor') }, [isPatient, role, location.pathname])

  const setRole = (r: Role) => {
    setRoleState(r)
    try { localStorage.setItem('hlx-role', r) } catch { /* ignore */ }
    navigate(roles.find((x) => x.key === r)!.home)
  }
  const value = useMemo(() => ({ role, setRole }), [role]) // eslint-disable-line react-hooks/exhaustive-deps
  const def = roles.find((r) => r.key === role)!
  const items = nav.filter((n) => n.roles.includes(role))

  return (
    <Ctx.Provider value={value}>
      <div className="min-h-full flex flex-col">
        <header className="sticky top-0 z-30 border-b border-sand-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-2.5">
            <Link to="/" className="flex items-center gap-3">
              <Wordmark size="sm" />
              <span className="hidden sm:inline text-sm text-sand-500 border-l border-sand-200 pl-3">Complex Chronic Program</span>
            </Link>
            <Pill tone="plum" dot={false} className="hidden md:inline-flex">Mockup · sample data</Pill>
            <div className="ml-auto flex items-center gap-2">
              <Link to="/" className="btn-ghost px-2.5 py-1.5 text-sm"><LayoutGrid size={16} /> <span className="hidden sm:inline">All screens</span></Link>
              <RoleSwitcher role={role} setRole={setRole} />
            </div>
          </div>
          {!isPatient && items.length > 0 && (
            <nav className="mx-auto max-w-[1400px] px-4 flex gap-1 overflow-x-auto">
              {items.map((n) => (
                <NavLink key={n.to} to={n.to} className={({ isActive }) => `whitespace-nowrap -mb-px border-b-2 px-3 py-2 text-sm font-medium ${isActive ? 'border-teal-600 text-teal-800' : 'border-transparent text-sand-500 hover:text-sand-800'}`}>
                  {n.label}
                  {n.phase > 1 && <span className="ml-1.5 rounded bg-sand-100 px-1 text-[10px] text-sand-500 align-middle">P{n.phase}</span>}
                </NavLink>
              ))}
            </nav>
          )}
        </header>
        <main className={`flex-1 ${isPatient ? '' : 'mx-auto w-full max-w-[1400px] px-4 py-6'}`}>{children}</main>
        <footer className="border-t border-sand-200 bg-white/60 px-4 py-3 text-xs text-sand-500">
          <div className="mx-auto max-w-[1400px] flex flex-wrap justify-between gap-2">
            <span>Helixona · Complex Chronic Program · MVP mockups. No real patient data. Viewing as <strong className="text-sand-700">{def.label} ({def.person})</strong>.</span>
            <span>Questionnaire v3 · published by Dr. D. on Sep 15, 2026</span>
          </div>
        </footer>
      </div>
    </Ctx.Provider>
  )
}

function RoleSwitcher({ role, setRole }: { role: Role; setRole: (r: Role) => void }) {
  const [open, setOpen] = useState(false)
  const def = roles.find((r) => r.key === role)!
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="btn-secondary px-3 py-1.5 text-sm">
        {def.surface === 'patient' ? <Smartphone size={15} /> : <UserRound size={15} />}
        <span className="hidden sm:inline">Viewing as</span> <strong>{def.label}</strong> <ChevronDown size={14} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-sand-200 bg-white shadow-card">
            <div className="px-3 py-2 eyebrow">Switch role</div>
            {roles.map((r) => (
              <button key={r.key} onClick={() => { setRole(r.key); setOpen(false) }}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-sand-50 ${r.key === role ? 'bg-teal-50 text-teal-900' : ''}`}>
                <span className="flex items-center gap-2">{r.surface === 'patient' ? <Smartphone size={14} className="text-sand-400" /> : <UserRound size={14} className="text-sand-400" />}{r.label}</span>
                <span className="text-xs text-sand-500">{r.person}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
