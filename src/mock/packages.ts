/* Packages: sets of questionnaires, consents and document requests assigned to a person depending on their case.
   Managed in Admin setup. Several packages can be assigned to one patient. Sample configuration. */
export interface PackageItem { id: string; name: string; kind: 'Questionnaire' | 'Consent' | 'Document request' }
export const packageItems: PackageItem[] = [
  { id: 'q-np', name: 'New Patient Packet', kind: 'Questionnaire' }, { id: 'q-qol', name: 'Quality of Life questionnaire (SF-36)', kind: 'Questionnaire' },
  { id: 'q-met', name: 'Metabolic questionnaire', kind: 'Questionnaire' }, { id: 'q-mold', name: 'Mold questionnaire', kind: 'Questionnaire' },
  { id: 'q-lyme', name: 'Lyme questionnaire', kind: 'Questionnaire' }, { id: 'q-brain', name: 'Brain questionnaire', kind: 'Questionnaire' },
  { id: 'q-l23', name: 'L2/L3 New Patient', kind: 'Questionnaire' }, { id: 'q-l23f', name: 'L2/L3 Follow-Up', kind: 'Questionnaire' },
  { id: 'c-gen', name: 'General informed consent', kind: 'Consent' }, { id: 'c-hipaa', name: 'Notice of Privacy Practices', kind: 'Consent' },
  { id: 'c-fin', name: 'Financial policy', kind: 'Consent' }, { id: 'c-comm', name: 'Communications consent', kind: 'Consent' },
  { id: 'c-iv', name: 'IV therapy consent', kind: 'Consent' }, { id: 'c-eboo', name: 'EBOO consent', kind: 'Consent' }, { id: 'c-laser', name: 'Laser consent', kind: 'Consent' },
  { id: 'd-ins', name: 'Insurance card (front and back)', kind: 'Document request' }, { id: 'd-id', name: 'Photo ID', kind: 'Document request' },
  { id: 'd-meds', name: 'Medication and supplement list', kind: 'Document request' }, { id: 'd-labs', name: 'Recent labs', kind: 'Document request' },
  { id: 'd-oon', name: 'Out-of-network plan document', kind: 'Document request' }, { id: 'd-rec', name: 'Prior medical records', kind: 'Document request' },
]
export interface Package { id: string; name: string; when: string; items: string[]; version: number; updated: string }
export const packages: Package[] = [
  { id: 'pk-cc', name: 'Complex Chronic · full intake', when: 'Accepted for A&P · Chronic or Complex Chronic', items: ['q-np', 'q-qol', 'q-met', 'q-mold', 'q-lyme', 'q-brain', 'c-gen', 'c-hipaa', 'c-fin', 'c-comm', 'd-ins', 'd-id', 'd-meds', 'd-labs'], version: 3, updated: 'Oct 22, 2026 · Cassandra' },
  { id: 'pk-ho', name: 'Health Optimization · L2/L3', when: 'Health Optimization inquiry', items: ['q-l23', 'c-gen', 'c-hipaa', 'c-fin', 'c-comm', 'd-id'], version: 2, updated: 'Oct 22, 2026 · Cassandra' },
  { id: 'pk-oon', name: 'Insurance · out of network', when: 'Insurance patient with an out-of-network plan', items: ['d-ins', 'd-oon'], version: 1, updated: 'Nov 3, 2026 · Karina' },
  { id: 'pk-iv', name: 'IV and EBOO consents', when: 'IV infusions or EBOO are in the plan', items: ['c-iv', 'c-eboo'], version: 1, updated: 'Oct 28, 2026 · the provider' },
  { id: 'pk-alc', name: 'À la carte · standard paperwork', when: 'A&P complete · à la carte', items: ['c-gen', 'c-hipaa', 'c-fin', 'd-id'], version: 1, updated: 'Nov 10, 2026 · Cassandra' },
  { id: 'pk-fu', name: 'Follow-up visit', when: 'Returning Health Optimization visits', items: ['q-l23f'], version: 1, updated: 'Oct 22, 2026 · Cassandra' },
]
export const itemName = (id: string) => packageItems.find((i) => i.id === id)?.name ?? id
