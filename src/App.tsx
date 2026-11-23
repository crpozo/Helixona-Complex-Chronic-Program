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
import InquiryDetail from './modules/intake/staff/InquiryDetail'
import Packages from './modules/admin/Packages'
import UsersPermissions from './modules/admin/UsersPermissions'
import PatientsList from './modules/intake/staff/PatientsList'
import CreatePatient from './modules/intake/staff/CreatePatient'
import PatientDetail from './modules/intake/staff/PatientDetail'
import ChartPrepDetail from './modules/intake/staff/ChartPrepDetail'
import EcwExceptions from './modules/intake/staff/EcwExceptions'
import { DictationLayer } from './components/Dictation'
import Tasks from './modules/tasks/Tasks'
import PlanOfCare from './modules/plan/patient/PlanOfCare'
import Sharing from './modules/sharing/patient/Sharing'
import BecomePatient from './modules/public/BecomePatient'
import ScheduleInterview from './modules/public/ScheduleInterview'
import InterviewAvailability from './modules/interviews/InterviewAvailability'
import BookTreatment from './modules/public/BookTreatment'
import Survey from './modules/surveys/patient/Survey'
import CrashReport from './modules/surveys/patient/CrashReport'
import AlertQueue from './modules/surveys/staff/AlertQueue'
import PatientLongitudinal from './modules/surveys/staff/PatientLongitudinal'
import SurveyBuilder from './modules/config/SurveyBuilder'
import ModalityConfig from './modules/config/ModalityConfig'
import AlertRules from './modules/config/AlertRules'
import MessageTemplates from './modules/notifications/MessageTemplates'
import NotificationSettings from './modules/notifications/patient/NotificationSettings'
import Assistant from './modules/messages/patient/Assistant'
import Medications from './modules/medications/patient/Medications'
import Messages from './modules/messages/patient/Messages'
import Registry from './modules/registry/Registry'
import MemberDetail from './modules/registry/MemberDetail'
import Booking from './modules/booking/patient/Booking'
import ResourceCalendar from './modules/booking/staff/ResourceCalendar'
import StaffBooking from './modules/booking/staff/StaffBooking'
import Agreement from './modules/payments/patient/Agreement'
import PaymentsPatient from './modules/payments/patient/PaymentsPatient'
import FailedPayments from './modules/payments/staff/FailedPayments'
import Reconciliation from './modules/payments/staff/Reconciliation'
import Dashboards from './modules/dashboards/Dashboards'

export default function App() {
  return (
    <HashRouter>
      <DictationLayer />
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/screens" element={<Overview />} />
          {/* Patient (phone-first) */}
          {/* Public · helixona.com entry points (no sign-in) */}
          <Route path="/public/become-a-patient" element={<BecomePatient />} />
          <Route path="/public/book" element={<BookTreatment />} />
          <Route path="/public/interview/:id" element={<ScheduleInterview />} />
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
          <Route path="/staff/interviews" element={<InterviewAvailability />} />
          <Route path="/staff/tasks" element={<Tasks />} />
          <Route path="/staff/inquiries/:id" element={<InquiryDetail />} />
          <Route path="/staff/admin/packages" element={<Packages />} />
          <Route path="/staff/admin/users" element={<UsersPermissions />} />
          <Route path="/staff/patients" element={<PatientsList />} />
          <Route path="/staff/patients/new" element={<CreatePatient />} />
          <Route path="/staff/patients/:id" element={<PatientDetail />} />
          <Route path="/staff/intake-review" element={<Navigate to="/staff/patients?view=docs" replace />} />
          <Route path="/staff/chart-prep" element={<Navigate to="/staff/patients?view=chart" replace />} />
          <Route path="/staff/chart-prep/:id" element={<ChartPrepDetail />} />
          <Route path="/staff/ecw-exceptions" element={<EcwExceptions />} />
          {/* Patient · surveys, booking, payments */}
          <Route path="/patient/survey" element={<Survey />} />
          <Route path="/patient/crash" element={<CrashReport />} />
          <Route path="/patient/book" element={<Booking />} />
          <Route path="/patient/agreement" element={<Agreement />} />
          <Route path="/patient/payments" element={<PaymentsPatient />} />
          <Route path="/patient/settings" element={<NotificationSettings />} />
          <Route path="/patient/plan" element={<PlanOfCare />} />
          <Route path="/patient/sharing" element={<Sharing />} />
          <Route path="/patient/assistant" element={<Assistant />} />
          <Route path="/patient/medications" element={<Medications />} />
          <Route path="/patient/messages" element={<Messages />} />
          {/* Staff · surveys & alerts, registry, booking, payments, config, dashboards */}
          <Route path="/staff/alerts" element={<AlertQueue />} />
          <Route path="/staff/alerts/patient/:id" element={<PatientLongitudinal />} />
          <Route path="/staff/registry" element={<Registry />} />
          <Route path="/staff/registry/:id" element={<MemberDetail />} />
          <Route path="/staff/calendar" element={<ResourceCalendar />} />
          <Route path="/staff/calendar/new" element={<StaffBooking />} />
          <Route path="/staff/payments" element={<FailedPayments />} />
          <Route path="/staff/payments/reconciliation" element={<Reconciliation />} />
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
