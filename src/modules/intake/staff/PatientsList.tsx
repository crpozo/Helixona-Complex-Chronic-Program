import { useNavigate } from 'react-router-dom'
import { PageHeader, Pill, QueueTable, toneFor, WhoWhenWhy, type Column } from '../../../components/ui'
import { patients } from '../../../mock/patients'
import type { Patient } from '../../../mock/types'

const invTone = (s?: string) => (!s ? 'neutral' : s === 'expired' ? 'bad' : s === 'submitted' ? 'ok' : s === 'sent' || s === 'delivered' ? 'teal' : 'warn')

export default function PatientsList() {
  const nav = useNavigate()
  const columns: Column<Patient>[] = [
    { key: 'id', header: 'Patient', render: (r) => <><div className="font-semibold text-sand-900">{r.id}</div><div className="text-xs text-sand-500">eCW {r.ecwId}</div></>, width: '140px' },
    { key: 'status', header: 'Registry status', render: (r) => <Pill tone={toneFor(r.status)}>{r.status}</Pill> },
    { key: 'inv', header: 'Invitation', render: (r) => r.invitation ? <><Pill tone={invTone(r.invitation.state)} dot={false} className="capitalize">{r.invitation.state}</Pill><div className="mt-1 text-xs text-sand-500">{r.invitation.method} · expires {r.invitation.expiresAt}</div></> : <span className="text-sand-400">Not sent</span> },
    { key: 'intake', header: 'Intake', render: (r) => r.intake ? <div className="w-32"><div className="flex justify-between text-xs"><span>Questionnaire v{r.intake.version}</span><span className="font-semibold">{r.intake.progress}%</span></div><div className="mt-1 h-1.5 rounded-full bg-sand-200"><div className="h-1.5 rounded-full bg-teal-600" style={{ width: `${r.intake.progress}%` }} /></div></div> : <span className="text-sand-400">—</span> },
    { key: 'chart', header: 'Chart prep', render: (r) => <Pill tone={toneFor(r.chartPrep)}>{r.chartPrep}</Pill> },
    { key: 'adv', header: 'Advisor', render: (r) => r.advisor },
    { key: 'last', header: 'Last activity', render: (r) => { const h = r.history[r.history.length - 1]; return h ? <WhoWhenWhy actor={h.actor} when={h.when} reason={h.action} /> : '—' } },
  ]
  return (
    <>
      <PageHeader eyebrow="Intake · Patient advisor" title="Patients & invitations" description="Every patient record created by an advisor, with invitation and intake progress. Patients are listed by internal ID; open a record to see the full name."
        actions={<button className="btn-primary" onClick={() => nav('/staff/patients/new')}>+ Create patient & send invitation</button>} />
      <QueueTable rows={patients} columns={columns} rowKey={(r) => r.id} rowTone={(r) => toneFor(r.chartPrep)} onRowClick={(r) => nav(`/staff/patients/${r.id}`)} />
    </>
  )
}
