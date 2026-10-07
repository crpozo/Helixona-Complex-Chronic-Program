import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, Check, FileText, RotateCcw, Upload } from 'lucide-react'
import { PhoneFrame, PatientTopBar } from '../../../components/PhoneFrame'
import { Pill } from '../../../components/ui'
import { currentPatient } from '../../../mock/patients'
import type { UploadItem } from '../../../mock/types'

export default function Uploads() {
  const nav = useNavigate()
  const [items, setItems] = useState<UploadItem[]>(currentPatient.uploads)
  const [active, setActive] = useState<UploadItem | null>(null)

  const required = items.filter((i) => i.required)
  const done = required.filter((i) => i.status === 'uploaded').length
  const returned = items.filter((i) => i.status === 'returned')

  const simulateUpload = (key: string) => {
    setItems((xs) => xs.map((x) => (x.key === key ? { ...x, status: 'uploaded', note: undefined, files: [...x.files, { name: `${key}-${x.files.length + 1}.jpg`, size: '1.4 MB', uploadedAt: 'Just now' }] } : x)))
    setActive(null)
  }

  return (
    <PhoneFrame>
      <PatientTopBar title="Your documents" back={<Link to="/patient/intake" className="btn-ghost px-2 py-1 text-sm"><ArrowLeft size={16} /></Link>} />
      <div className="px-5 pb-8">
        <h1 className="font-display text-2xl font-semibold text-sand-900">Upload your documents</h1>
        <p className="mt-1 text-[15px] text-sand-600">Take a photo or choose a file. Clear photos of paper documents are fine.</p>

        <div className="card mt-4 p-4">
          <div className="flex items-center justify-between"><span className="text-sm font-semibold">{done} of {required.length} required items uploaded</span></div>
          <div className="mt-2 h-2 rounded-full bg-sand-200"><div className="h-2 rounded-full bg-teal-600 transition-all" style={{ width: `${(done / required.length) * 100}%` }} /></div>
        </div>

        {returned.length > 0 && (
          <div className="mt-4 rounded-xl border border-warn-600/30 bg-warn-100 p-3.5 text-sm text-warn-700">
            <div className="flex items-center gap-2 font-semibold"><RotateCcw size={15} /> Your advisor asked for a new copy</div>
            {returned.map((r) => <p key={r.key} className="mt-1"><strong>{r.label}:</strong> {r.note}</p>)}
          </div>
        )}

        <div className="mt-5 eyebrow">Required</div>
        <ul className="mt-2 space-y-2">{items.filter((i) => i.required).map((i) => <UploadRow key={i.key} item={i} onOpen={() => setActive(i)} />)}</ul>
        <div className="mt-5 eyebrow">If you have them</div>
        <ul className="mt-2 space-y-2">{items.filter((i) => !i.required).map((i) => <UploadRow key={i.key} item={i} onOpen={() => setActive(i)} />)}</ul>

        <button onClick={() => nav('/patient/forms')} disabled={done < required.length || returned.length > 0} className="btn-primary btn-lg mt-6 w-full">
          {done < required.length || returned.length > 0 ? 'Finish required items to continue' : 'Continue to forms'}
        </button>
        <p className="mt-3 text-center text-xs text-sand-500">Accepted: photos, PDF, Word · up to 25 MB each. Files are checked for safety when uploaded.</p>
      </div>

      {active && (
        <div className="absolute inset-0 z-20 flex flex-col justify-end bg-sand-900/40 md:rounded-[2rem]" onClick={() => setActive(null)}>
          <div className="rounded-t-3xl bg-white p-5 pb-8" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-sand-300" />
            <h3 className="text-lg font-semibold text-sand-900">{active.label}</h3>
            {active.note && <p className="mt-1 text-sm text-warn-700">{active.note}</p>}
            {active.files.length > 0 && (
              <ul className="mt-3 space-y-1.5">{active.files.map((f) => <li key={f.name} className="flex items-center gap-2 rounded-lg bg-sand-50 px-3 py-2 text-sm"><FileText size={15} className="text-sand-400" /><span className="flex-1 truncate">{f.name}</span><span className="text-xs text-sand-500">{f.size}</span></li>)}</ul>
            )}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => simulateUpload(active.key)} className="btn-primary btn-lg"><Camera size={18} /> Take photo</button>
              <button onClick={() => simulateUpload(active.key)} className="btn-secondary btn-lg"><Upload size={18} /> Choose file</button>
            </div>
            <button onClick={() => setActive(null)} className="btn-ghost mt-2 w-full">Cancel</button>
          </div>
        </div>
      )}
    </PhoneFrame>
  )
}

function UploadRow({ item, onOpen }: { item: UploadItem; onOpen: () => void }) {
  const tone = item.status === 'uploaded' ? 'ok' : item.status === 'returned' ? 'warn' : item.status === 'missing' ? 'bad' : 'neutral'
  const label = item.status === 'uploaded' ? `${item.files.length} file${item.files.length > 1 ? 's' : ''}` : item.status === 'returned' ? 'Needs new copy' : item.status === 'missing' ? 'Not yet' : 'Optional'
  return (
    <li>
      <button onClick={onOpen} className="card flex w-full items-center gap-3 p-3.5 text-left hover:border-teal-300">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${item.status === 'uploaded' ? 'bg-ok-100 text-ok-700' : 'bg-sand-100 text-sand-500'}`}>{item.status === 'uploaded' ? <Check size={16} /> : <Upload size={16} />}</span>
        <span className="flex-1 min-w-0"><span className="block font-semibold text-sand-900 text-[15px]">{item.label}</span>{item.files[0] && <span className="block truncate text-xs text-sand-500">{item.files.map((f) => f.name).join(', ')}</span>}</span>
        <Pill tone={tone} dot={false}>{label}</Pill>
      </button>
    </li>
  )
}
