import type { Role } from '../../mock/types'

export interface RoleDef { key: Role; label: string; person: string; home: string; surface: 'patient' | 'staff' }

export const roles: RoleDef[] = [
  { key: 'patient', label: 'Patient', person: 'Marisol A.', home: '/patient/invite', surface: 'patient' },
  { key: 'advisor', label: 'Patient advisor', person: 'Ana', home: '/staff/inquiries', surface: 'staff' },
  { key: 'karina', label: 'Operations & finance', person: 'Karina', home: '/staff/registry', surface: 'staff' },
  { key: 'charlene', label: 'Chart prep', person: 'Charlene', home: '/staff/patients?view=chart', surface: 'staff' },
  { key: 'nursing', label: 'Nursing / care team', person: 'Nursing', home: '/staff/alerts', surface: 'staff' },
  { key: 'physician', label: 'Physician', person: 'Dr. D.', home: '/staff/config/surveys', surface: 'staff' },
  { key: 'admin', label: 'Program / technical admin', person: 'Cassandra · Carlos', home: '/staff/dashboards', surface: 'staff' },
]

export type NavGroup = 'People' | 'Care' | 'Membership' | 'Reports' | 'Admin setup'
export interface NavItem { label: string; to: string; group: NavGroup; roles: Role[]; module: 'Intake' | 'Registry' | 'Surveys & alerts' | 'Booking' | 'Payments' | 'Configuration' | 'System'; phase: 1 | 2 | 3 }

export const nav: NavItem[] = [
  { label: 'Inquiries', to: '/staff/inquiries', group: 'People', roles: ['advisor', 'karina', 'admin'], module: 'Intake', phase: 1 },
  { label: 'Interview calendar', to: '/staff/interviews', group: 'People', roles: ['advisor', 'admin'], module: 'Intake', phase: 1 },
  { label: 'Patients', to: '/staff/patients', group: 'People', roles: ['advisor', 'karina', 'charlene', 'nursing', 'physician', 'admin'], module: 'Intake', phase: 1 },
  { label: 'Registry', to: '/staff/registry', group: 'Membership', roles: ['karina', 'advisor', 'physician', 'admin'], module: 'Registry', phase: 2 },
  { label: 'Alerts', to: '/staff/alerts', group: 'Care', roles: ['nursing', 'physician', 'admin'], module: 'Surveys & alerts', phase: 2 },
  { label: 'Calendar', to: '/staff/calendar', group: 'Care', roles: ['karina', 'nursing', 'admin'], module: 'Booking', phase: 3 },
  { label: 'Payments', to: '/staff/payments', group: 'Membership', roles: ['karina', 'admin'], module: 'Payments', phase: 3 },
  { label: 'Surveys & check-ins', to: '/staff/config/surveys', group: 'Admin setup', roles: ['physician', 'admin'], module: 'Configuration', phase: 2 },
  { label: 'Modalities', to: '/staff/config/modalities', group: 'Admin setup', roles: ['physician', 'karina', 'admin'], module: 'Configuration', phase: 2 },
  { label: 'Alert rules', to: '/staff/config/alerts', group: 'Admin setup', roles: ['physician', 'admin'], module: 'Configuration', phase: 2 },
  { label: 'Messages', to: '/staff/config/messages', group: 'Admin setup', roles: ['admin', 'karina'], module: 'Configuration', phase: 3 },
  { label: 'AI Agent exceptions', to: '/staff/ecw-exceptions', group: 'Admin setup', roles: ['charlene', 'karina', 'admin'], module: 'System', phase: 1 },
  { label: 'Packages & documents', to: '/staff/admin/packages', group: 'Admin setup', roles: ['admin', 'karina'], module: 'Configuration', phase: 1 },
  { label: 'Users & permissions', to: '/staff/admin/users', group: 'Admin setup', roles: ['admin'], module: 'System', phase: 1 },
  { label: 'Dashboards', to: '/staff/dashboards', group: 'Reports', roles: ['karina', 'physician', 'admin'], module: 'System', phase: 3 },
]
