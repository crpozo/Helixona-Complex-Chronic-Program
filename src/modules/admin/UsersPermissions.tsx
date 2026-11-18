import { useState } from 'react'
import { Check, Lock, Minus } from 'lucide-react'
import { Card, Notice, PageHeader, Pill, Tabs } from '../../components/ui'
import { Avatar } from '../../components/Avatar'
import { currentUser, notify } from '../../mock/store'

/** Admin only: who works here, which role each person has, and what each role can see and change. */
const roleNames = ['Administrator', 'Patient advisor', 'Operations & finance', 'Chart prep', 'Nursing', 'Physician', 'Front desk'] as const
type RoleName = (typeof roleNames)[number]
const areas = ['Inquiries', 'Patients', 'Health story and data', 'Chart prep', 'Alerts', 'Calendar and booking', 'Membership', 'Payments', 'Reports', 'Admin setup', 'Users and permissions']
type Level = 'none' | 'view' | 'edit'
const start: Record<RoleName, Level[]> = {
  Administrator: areas.map(() => 'edit'),
  'Patient advisor': ['edit', 'edit', 'view', 'view', 'none', 'view', 'view', 'none', 'none', 'none', 'none'],
  'Operations & finance': ['view', 'edit', 'none', 'view', 'none', 'edit', 'edit', 'edit', 'view', 'view', 'none'],
  'Chart prep': ['none', 'view', 'view', 'edit', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  Nursing: ['none', 'view', 'edit', 'view', 'edit', 'edit', 'none', 'none', 'none', 'none', 'none'],
  Physician: ['view', 'view', 'edit', 'view', 'edit', 'view', 'view', 'none', 'view', 'view', 'none'],
  'Front desk': ['view', 'view', 'none', 'none', 'none', 'edit', 'none', 'none', 'none', 'none', 'none'],
}
const people: { name: string; email: string; role: RoleName; scope: string; active: boolean; last: string }[] = [
  { name: 'Cassandra', email: 'cassandra@helixona.example', role: 'Administrator', scope: 'All patients', active: true, last: 'Today · 8:12 AM' },
  { name: 'Carlos', email: 'carlos@helixona.example', role: 'Administrator', scope: 'All patients', active: true, last: 'Today · 9:40 AM' },
  { name: 'Ana', email: 'ana@helixona.example', role: 'Patient advisor', scope: 'All patients', active: true, last: 'Today · 7:55 AM' },
  { name: 'Marie', email: 'marie@helixona.example', role: 'Patient advisor', scope: 'All patients', active: true, last: 'Yesterday · 4:30 PM' },
  { name: 'Karina', email: 'karina@helixona.example', role: 'Operations & finance', scope: 'All patients', active: true, last: 'Today · 8:30 AM' },
  { name: 'Charlene', email: 'charlene@helixona.example', role: 'Chart prep', scope: 'All patients', active: true, last: 'Today · 6:10 AM' },
  { name: 'Jen', email: 'jen@helixona.example', role: 'Nursing', scope: 'All patients', active: true, last: 'Today · 7:20 AM' },
  { name: 'Dr. D.', email: 'drd@helixona.example', role: 'Physician', scope: 'Own patients', active: true, last: 'Yesterday · 6:05 PM' },
  { name: 'Mira', email: 'mira@helixona.example', role: 'Front desk', scope: 'All patients', active: false, last: 'Invited · not signed in yet' },
]

export default function UsersPermissions() {
  const me = currentUser()
  const [tab, setTab] = useState('people')
  const [users, setUsers] = useState(people)
  const [perm, setPerm] = useState(start)
  if (me.role !== 'admin') return <Notice tone="bad" icon={<Lock size={16} />} title="Administrators only">Only administrators can see users, roles and permissions. Ask Cassandra or Carlos if you need a change.</Notice>
  const cycle = (r: RoleName, i: number) => { if (r === 'Administrator') return; const order: Level[] = ['none', 'view', 'edit']; setPerm({ ...perm, [r]: perm[r].map((l, k) => (k === i ? order[(order.indexOf(l) + 1) % 3] : l)) }) }
  return (
    <>
      <PageHeader eyebrow="Admin setup · administrators only" title="Users and permissions" description="Who works here, the role each person has, and what each role can see or change. By default everyone sees all patients; narrow it per person only when needed."
        actions={<button onClick={() => notify('Invitation sent · the person chooses a password and a second step to sign in')} className="btn-primary">+ Invite a person</button>} />
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'people', label: 'People', count: users.length }, { key: 'roles', label: 'Roles and permissions' }]} />
      {tab === 'people' && (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-sand-50 text-left"><th className="px-5 py-3 eyebrow">Person</th><th className="px-4 py-3 eyebrow">Role</th><th className="px-4 py-3 eyebrow">Sees</th><th className="px-4 py-3 eyebrow">Last signed in</th><th className="px-4 py-3 eyebrow">Access</th></tr></thead>
            <tbody>{users.map((u, i) => (
              <tr key={u.name} className="border-t border-sand-100">
                <td className="px-5 py-3"><div className="flex items-center gap-3"><Avatar name={u.name} size={34} /><div><div className="font-semibold text-sand-900">{u.name}</div><div className="text-xs text-sand-500">{u.email}</div></div></div></td>
                <td className="px-4 py-3"><select className="input w-auto py-1.5 text-sm" value={u.role} onChange={(e) => { setUsers(users.map((x, k) => (k === i ? { ...x, role: e.target.value as RoleName } : x))); notify(`${u.name} is now ${e.target.value}`) }}>{roleNames.map((r) => <option key={r}>{r}</option>)}</select></td>
                <td className="px-4 py-3"><select className="input w-auto py-1.5 text-sm" value={u.scope} onChange={(e) => setUsers(users.map((x, k) => (k === i ? { ...x, scope: e.target.value } : x)))}><option>All patients</option><option>Own patients</option><option>Assigned to them</option></select></td>
                <td className="px-4 py-3 whitespace-nowrap text-sand-600">{u.last}</td>
                <td className="px-4 py-3"><button onClick={() => { setUsers(users.map((x, k) => (k === i ? { ...x, active: !x.active } : x))); notify(u.active ? `${u.name} can no longer sign in` : `${u.name} can sign in again`) }}><Pill tone={u.active ? 'ok' : 'neutral'}>{u.active ? 'Active' : 'Off'}</Pill></button></td>
              </tr>))}</tbody>
          </table>
        </div>
      )}
      {tab === 'roles' && (
        <Card title="What each role can do" subtitle="Click a cell to change it: no access, can view, can view and change. Administrators always have everything." actions={<button onClick={() => notify('Permissions saved · they apply the next time each person opens the app')} className="btn-primary px-3 py-1.5 text-xs">Save permissions</button>} padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-sand-50 text-left"><th className="px-5 py-3 eyebrow">Area</th>{roleNames.map((r) => <th key={r} className="px-3 py-3 text-center text-xs font-semibold text-sand-700">{r}</th>)}</tr></thead>
              <tbody>{areas.map((a, i) => (
                <tr key={a} className="border-t border-sand-100"><td className="whitespace-nowrap px-5 py-2.5 font-medium text-sand-900">{a}</td>
                  {roleNames.map((r) => { const l = perm[r][i]; return <td key={r} className="px-3 py-2 text-center"><button onClick={() => cycle(r, i)} disabled={r === 'Administrator'} title={l === 'edit' ? 'Can view and change' : l === 'view' ? 'Can view' : 'No access'} className={`inline-flex min-w-[76px] items-center justify-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${l === 'edit' ? 'bg-sand-900 text-white' : l === 'view' ? 'bg-teal-100 text-sand-900' : 'bg-sand-100 text-sand-400'}`}>{l === 'none' ? <Minus size={12} /> : <Check size={12} />}{l === 'edit' ? 'Change' : l === 'view' ? 'View' : 'None'}</button></td> })}
                </tr>))}</tbody>
            </table>
          </div>
        </Card>
      )}
      <p className="help mt-3">Every change here is recorded with who made it and when.</p>
    </>
  )
}
