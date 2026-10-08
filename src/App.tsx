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
import Survey from './modules/surveys/patient/Survey'
import CrashReport from './modules/surveys/patient/CrashReport'
import AlertQueue from './modules/surveys/staff/AlertQueue'
import PatientLongitudinal from './modules/surveys/staff/PatientLongitudinal'
import SurveyBuilder from './modules/config/SurveyBuilder'
import ModalityConfig from './modules/config/ModalityConfig'
import AlertRules from './modules/config/AlertRules'
import MessageTemplates from './modules/notifications/MessageTemplates'
import Registry from './modules/registry/Registry'
import MemberDetail from './modules/registry/MemberDetail'
import Booking from './modules/booking/patient/Booking'
import ResourceCalendar from './modules/booking/staff/ResourceCalendar'
import Agreement from './modules/payments/patient/Agreement'
import PaymentsPatient from './modules/payments/patient/PaymentsPatient'
import FailedPayments from './modules/payments/staff/FailedPayments'
import Dashboards from './modules/dashboards/Dashboards'

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
          {/* Patient · surveys, booking, payments */}
          <Route path="/patient/survey" element={<Survey />} />
          <Route path="/patient/crash" element={<CrashReport />} />
          <Route path="/patient/book" element={<Booking />} />
          <Route path="/patient/agreement" element={<Agreement />} />
          <Route path="/patient/payments" element={<PaymentsPatient />} />
          {/* Staff · surveys & alerts, registry, booking, payments, config, dashboards */}
          <Route path="/staff/alerts" element={<AlertQueue />} />
          <Route path="/staff/alerts/patient/:id" element={<PatientLongitudinal />} />
          <Route path="/staff/registry" element={<Registry />} />
          <Route path="/staff/registry/:id" element={<MemberDetail />} />
          <Route path="/staff/calendar" element={<ResourceCalendar />} />
          <Route path="/staff/payments" element={<FailedPayments />} />
          <Route path="/staff/config/surveys" element={<SurveyBuilder />} />
          <Route path="/staff/config/modalities" element={<ModalityConfig />} />
          <Route path="/staff/config/alerts" element={<AlertRules />} />
          <Route path="/staff/config/messages" element={<MessageTemplates />} />
          <Route path="/staff/clinical-config" element={<Navigate to="/staff/config/surveys" replace />} />
          <Route path="/staff/dashboards" element={<Dashboards />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </HashRouter>
  )
}
