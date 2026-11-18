import { useState } from 'react'
import { Card, MultiSelect, PageHeader, Pill, Field } from '../../components/ui'
import { packageItems, packages as seed, type Package } from '../../mock/packages'
import { notify } from '../../mock/store'

/** Admin: define the packages (questionnaires, consents, document requests) that can be assigned to a person. */
export default function Packages() {
  const [list, setList] = useState<Package[]>(seed)
  const [selId, setSelId] = useState(seed[0].id)
  const sel = list.find((p) => p.id === selId) ?? list[0]
  const upd = (patch: Partial<Package>) => setList(list.map((p) => (p.id === sel.id ? { ...p, ...patch } : p)))
  const kinds = ['Questionnaire', 'Consent', 'Document request'] as const
  return (
    <>
      <PageHeader eyebrow="Admin setup" title="Packages and documents" description="A package is a set of questionnaires, consents and document requests. Staff assign one or more packages to a person depending on the case."
        actions={<button className="btn-primary" onClick={() => { const id = `pk-${list.length + 1}`; setList([...list, { id, name: 'New package', when: 'Describe when to use it', items: [], version: 1, updated: 'just now' }]); setSelId(id) }}>+ New package</button>} />
      <div className="grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <ul className="card divide-y divide-sand-200 overflow-hidden">
            {list.map((p) => <li key={p.id}><button onClick={() => setSelId(p.id)} aria-current={p.id === sel.id} className={`w-full px-4 py-3 text-left ${p.id === sel.id ? 'bg-teal-50 shadow-[inset_3px_0_0_#141414]' : 'hover:bg-sand-50'}`}>
              <div className="flex items-center justify-between gap-2"><span className="font-semibold text-sand-900">{p.name}</span><span className="whitespace-nowrap text-xs text-sand-500">{p.items.length} items · v{p.version}</span></div>
              <div className="mt-0.5 text-xs text-sand-500">Use when: {p.when}</div>
            </button></li>)}
          </ul>
        </div>
        <div className="lg:col-span-3">
          <Card title={sel.name} subtitle={`Version ${sel.version} · last changed ${sel.updated}`} actions={<button onClick={() => { upd({ version: sel.version + 1, updated: 'just now' }); notify(`Saved as version ${sel.version + 1} · new assignments use it from now on`) }} className="btn-primary px-3 py-1.5 text-xs">Save as v{sel.version + 1}</button>}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Package name"><input className="input" value={sel.name} onChange={(e) => upd({ name: e.target.value })} /></Field>
              <Field label="Use it when"><input className="input" value={sel.when} onChange={(e) => upd({ when: e.target.value })} /></Field>
            </div>
            {kinds.map((k) => (
              <div key={k} className="mt-4"><Field label={`${k}s`}><MultiSelect placeholder={`Choose ${k.toLowerCase()}s…`} options={packageItems.filter((i) => i.kind === k).map((i) => ({ value: i.id, label: i.name }))} value={sel.items.filter((id) => packageItems.find((i) => i.id === id)?.kind === k)} onChange={(v) => upd({ items: [...sel.items.filter((id) => packageItems.find((i) => i.id === id)?.kind !== k), ...v] })} /></Field></div>
            ))}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-sand-500"><Pill dot={false}>{sel.items.length} items in this package</Pill>Changing a package does not change what was already sent to a person.</div>
          </Card>
        </div>
      </div>
    </>
  )
}
