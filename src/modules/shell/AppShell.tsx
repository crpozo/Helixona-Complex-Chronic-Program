import ToastHost from '../../components/ToastHost'
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, LayoutGrid, Smartphone, UserRound } from 'lucide-react'
import type { Role } from '../../mock/types'
import { nav, roles, type NavGroup } from './roles'
import { Wordmark } from '../../components/PhoneFrame'

interface ShellCtx { role: Role; setRole: (r: Role) => void }
const Ctx = createContext<ShellCtx>({ role: 'advisor', setRole: () => {} })
export const useShell = () => useContext(Ctx)

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isPatient = location.pathname.startsWith('/patient') || location.pathname.startsWith('/public')
  const [role, setRoleState] = useState<Role>(() => {
    try { return (localStorage.getItem('hlx-role') as Role) || 'advisor' } catch { return 'advisor' }
  })
  useEffect(() => { if (isPatient && role !== 'patient') setRoleState('patient') }, [isPatient, role])
  useEffect(() => { if (!isPatient && role === 'patient' && location.pathname !== '/screens') setRoleState('advisor') }, [isPatient, role, location.pathname])

  const setRole = (r: Role) => {
    setRoleState(r)
    try { localStorage.setItem('hlx-role', r) } catch { /* ignore */ }
    navigate(roles.find((x) => x.key === r)!.home)
  }
  const value = useMemo(() => ({ role, setRole }), [role]) // eslint-disable-line react-hooks/exhaustive-deps
  const def = roles.find((r) => r.key === role)!
  const items = nav.filter((n) => n.roles.includes(role))
  const groups: NavGroup[] = ['People', 'Care', 'Membership', 'Reports', 'Admin setup']
  const [collapsed, setCollapsed] = useState<string[]>([])

  return (
    <Ctx.Provider value={value}>
      {isPatient ? (
        <div className="min-h-full flex flex-col">
          <header className="sticky top-0 z-30 border-b border-teal-500/30 bg-teal-800 text-white">
            <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-2.5">
              <Link to={def.home} className="flex items-center gap-3"><Wordmark size="sm" light /></Link>
              <div className="ml-auto flex items-center gap-2">
                <Link to="/screens" aria-label="All screens" className="inline-flex items-center px-2.5 py-1.5 text-white/80 hover:text-white"><LayoutGrid size={15} /></Link>
                <RoleSwitcher role={role} setRole={setRole} />
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <ToastHost />
        </div>
      ) : (
        <div className="flex min-h-full">
          <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-teal-800 text-white md:flex">
            <Link to={def.home} className="block px-5 pb-4 pt-5"><Wordmark size="sm" light /><span className="mt-1.5 block text-[10px] uppercase tracking-[0.22em] text-white/50">Complex Chronic Program</span></Link>
            <nav className="tabs-row flex-1 overflow-y-auto px-3 pb-4" aria-label="Main">
              {groups.map((g) => { const its = items.filter((n) => n.group === g); if (!its.length) return null; const closed = collapsed.includes(g); return (
                <div key={g} className="mt-3">
                  <button onClick={() => setCollapsed(closed ? collapsed.filter((x) => x !== g) : [...collapsed, g])} aria-expanded={!closed} className="flex w-full items-center justify-between px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/45 hover:text-white/80">{g}<ChevronDown size={12} className={`transition-transform ${closed ? '-rotate-90' : ''}`} /></button>
                  {!closed && its.map((n) => (
                    <NavLink key={n.to} to={n.to} className={({ isActive }) => `mt-0.5 flex items-center rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-white/10 font-semibold text-white shadow-[inset_3px_0_0_#d4b77a]' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>{n.label}</NavLink>
                  ))}
                </div>) })}
            </nav>
            <div className="border-t border-white/10 px-5 py-3 text-xs text-white/50">Signed in as<div className="text-sm font-medium text-white">{def.person}</div><div>{def.label}</div></div>
          </aside>
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-sand-200 bg-white px-5 py-2.5">
              <nav className="flex gap-1 overflow-x-auto md:hidden">{items.map((n) => <NavLink key={n.to} to={n.to} className={({ isActive }) => `whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm ${isActive ? 'bg-sand-900 text-white' : 'text-sand-600'}`}>{n.label}</NavLink>)}</nav>
              <span className="hidden text-sm text-sand-500 md:block">{items.find((n) => location.pathname.startsWith(n.to))?.group ?? 'Helixona'}</span>
              <div className="ml-auto flex items-center gap-2">
                <Link to="/screens" className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-sand-500 hover:bg-sand-100 hover:text-sand-900"><LayoutGrid size={14} /> All screens</Link>
                <RoleSwitcher role={role} setRole={setRole} light />
              </div>
            </header>
            <main className="mx-auto w-full max-w-[1400px] flex-1 px-5 py-6">{children}</main>
            <ToastHost />
            <footer className="border-t border-sand-200 px-5 py-3 text-xs text-sand-500">Helixona · sample data only, no real patient information · signed in as <strong className="text-sand-700">{def.person}</strong></footer>
          </div>
        </div>
      )}
    </Ctx.Provider>
  )
}

function RoleSwitcher({ role, setRole, light = false }: { role: Role; setRole: (r: Role) => void; light?: boolean }) {
  const [open, setOpen] = useState(false)
  const def = roles.find((r) => r.key === role)!
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm ${light ? 'border-sand-300 text-sand-800 hover:bg-sand-100' : 'border-teal-500 text-teal-200 hover:bg-white/5'}`}>
        {def.surface === 'patient' ? <Smartphone size={15} /> : <UserRound size={15} />}
        <strong>{def.person}</strong><span className="hidden text-xs opacity-70 sm:inline">{def.label}</span> <ChevronDown size={14} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-sand-200 bg-white text-sand-800 shadow-card">
            <div className="px-3 py-2 eyebrow">Switch user</div>
            {roles.map((r) => (
              <button key={r.key} onClick={() => { setRole(r.key); setOpen(false) }}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm text-sand-900 hover:bg-sand-50 ${r.key === role ? 'bg-teal-50 font-semibold' : ''}`}>
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
