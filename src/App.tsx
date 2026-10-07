import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './modules/shell/AppShell'
import Overview from './modules/overview/Overview'
import { roles } from './modules/shell/roles'

/** Land directly in the app for the last-used role (index of screens lives at /screens). */
function Home() {
  let role = 'advisor'
  try { role = localStorage.getItem('hlx-role') || 'advisor' } catch { /* ignore */ }
  const def = roles.find((r) => r.key === role) ?? roles[1]
  return <Navigate to={def.home} replace />
}
import Roadmap from './modules/overview/Roadmap'
import InvitationLanding from './modules/intake/patient/InvitationLanding'
import Questionnaire from './modules/intake/patient/Questionnaire'
import Uploads from './modules/intake/patient/Uploads'
import Forms from './modules/intake/patient/Forms'
import Submitted from './modules/intake/patient/Submitted'
import PatientHome from './modules/intake/patient/PatientHome'
import InquiryList from './modules/intake/staff/InquiryList'
import PatientsList from './modules/intake/staff/PatientsList'
import CreatePatient from './modules/intake/staff/CreatePatient'
import PatientDetail from './modules/intake/staff/PatientDetail'
import IntakeReviewQueue from './modules/intake/staff/IntakeReviewQueue'
import ChartPrepQueue from './modules/intake/staff/ChartPrepQueue'
import ChartPrepDetail from './modules/intake/staff/ChartPrepDetail'
import EcwExceptions from './modules/intake/staff/EcwExceptions'

export default function App() {
  return (
    <HashRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/screens" element={<Overview />} />
          {/* Patient (phone-first) */}
          <Route path="/patient" element={<Navigate to="/patient/invite" replace />} />
          <Route path="/patient/invite" element={<InvitationLanding />} />
          <Route path="/patient/intake" element={<Questionnaire />} />
          <Route path="/patient/uploads" element={<Uploads />} />
          <Route path="/patient/forms" element={<Forms />} />
          <Route path="/patient/submitted" element={<Submitted />} />
          <Route path="/patient/home" element={<PatientHome />} />
          {/* Staff · Intake module */}
          <Route path="/staff" element={<Navigate to="/staff/inquiries" replace />} />
          <Route path="/staff/inquiries" element={<InquiryList />} />
          <Route path="/staff/patients" element={<PatientsList />} />
          <Route path="/staff/patients/new" element={<CreatePatient />} />
          <Route path="/staff/patients/:id" element={<PatientDetail />} />
          <Route path="/staff/intake-review" element={<IntakeReviewQueue />} />
          <Route path="/staff/chart-prep" element={<ChartPrepQueue />} />
          <Route path="/staff/chart-prep/:id" element={<ChartPrepDetail />} />
          <Route path="/staff/ecw-exceptions" element={<EcwExceptions />} />
          {/* Priority 2–3 placeholders */}
          <Route path="/staff/registry" element={<Roadmap />} />
          <Route path="/staff/alerts" element={<Roadmap />} />
          <Route path="/staff/clinical-config" element={<Roadmap />} />
          <Route path="/staff/calendar" element={<Roadmap />} />
          <Route path="/staff/payments" element={<Roadmap />} />
          <Route path="/staff/dashboards" element={<Roadmap />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </HashRouter>
  )
}
