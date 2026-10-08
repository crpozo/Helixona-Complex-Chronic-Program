import type { Role } from '../../mock/types'

export interface RoleDef { key: Role; label: string; person: string; home: string; surface: 'patient' | 'staff' }

export const roles: RoleDef[] = [
  { key: 'patient', label: 'Patient', person: 'Marisol A.', home: '/patient/invite', surface: 'patient' },
  { key: 'advisor', label: 'Patient advisor', person: 'Ana', home: '/staff/inquiries', surface: 'staff' },
  { key: 'karina', label: 'Operations & finance', person: 'Karina', home: '/staff/registry', surface: 'staff' },
  { key: 'charlene', label: 'Chart prep', person: 'Charlene', home: '/staff/chart-prep', surface: 'staff' },
  { key: 'nursing', label: 'Nursing / care team', person: 'Nursing', home: '/staff/alerts', surface: 'staff' },
  { key: 'physician', label: 'Physician', person: 'Dr. D.', home: '/staff/config/surveys', surface: 'staff' },
  { key: 'admin', label: 'Program / technical admin', person: 'Cassandra · Carlos', home: '/staff/dashboards', surface: 'staff' },
]

export interface NavItem { label: string; to: string; roles: Role[]; module: 'Intake' | 'Registry' | 'Surveys & alerts' | 'Booking' | 'Payments' | 'Configuration' | 'System'; phase: 1 | 2 | 3 }

export const nav: NavItem[] = [
  { label: 'Inquiries', to: '/staff/inquiries', roles: ['advisor', 'karina', 'admin'], module: 'Intake', phase: 1 },
  { label: 'Patients', to: '/staff/patients', roles: ['advisor', 'karina', 'charlene', 'nursing', 'physician', 'admin'], module: 'Intake', phase: 1 },
  { label: 'Intake review', to: '/staff/intake-review', roles: ['advisor', 'karina', 'admin'], module: 'Intake', phase: 1 },
  { label: 'Chart prep', to: '/staff/chart-prep', roles: ['charlene', 'karina', 'admin'], module: 'Intake', phase: 1 },
  { label: 'Registry', to: '/staff/registry', roles: ['karina', 'advisor', 'physician', 'admin'], module: 'Registry', phase: 2 },
  { label: 'Alerts', to: '/staff/alerts', roles: ['nursing', 'physician', 'admin'], module: 'Surveys & alerts', phase: 2 },
  { label: 'Calendar', to: '/staff/calendar', roles: ['karina', 'nursing', 'admin'], module: 'Booking', phase: 3 },
  { label: 'Payments', to: '/staff/payments', roles: ['karina', 'admin'], module: 'Payments', phase: 3 },
  { label: 'Surveys', to: '/staff/config/surveys', roles: ['physician', 'admin'], module: 'Configuration', phase: 2 },
  { label: 'Modalities', to: '/staff/config/modalities', roles: ['physician', 'karina', 'admin'], module: 'Configuration', phase: 2 },
  { label: 'Alert rules', to: '/staff/config/alerts', roles: ['physician', 'admin'], module: 'Configuration', phase: 2 },
  { label: 'Messages', to: '/staff/config/messages', roles: ['admin', 'karina'], module: 'Configuration', phase: 3 },
  { label: 'eCW exceptions', to: '/staff/ecw-exceptions', roles: ['charlene', 'karina', 'admin'], module: 'System', phase: 1 },
  { label: 'Dashboards', to: '/staff/dashboards', roles: ['karina', 'physician', 'admin'], module: 'System', phase: 3 },
]
