// Questionnaire metadata + sample answers used by the demo patient and the eCW note preview.
// Content itself lives in questionnaireContent.ts (generated from the Medical Director's spreadsheet).
import { forms } from './questionnaireContent'
export { forms }
export type { Form, Q, Sec } from './questionnaireContent'

export const questionnaireMeta = {
  version: 1,
  publishedBy: 'Medical Director',
  publishedOn: 'Oct 22, 2026',
  status: 'Draft · as supplied (not yet published by Dr. D.)',
  source: 'NP - Questionnaires 2.xlsx',
}

export type Pathway = 'chronic' | 'optimization'
export const pathwayLabel: Record<Pathway, string> = { chronic: 'Complex Chronic Program', optimization: 'Health Optimization (L2/L3)' }
/** Forms assigned by pathway. Condition-specific forms (Lyme, Brain) are added by the physician. */
export const assignedByPathway: Record<Pathway, { formId: string; when?: string }[]> = {
  chronic: [{ formId: 'new-patient' }, { formId: 'sf36' }, { formId: 'metabolic' }, { formId: 'mold' }],
  optimization: [{ formId: 'l2l3-new' }, { formId: 'l2l3-fu', when: 'After your first visit' }],
}
export const getPathway = (): Pathway => { try { return (localStorage.getItem('hlx-pathway') as Pathway) || 'chronic' } catch { return 'chronic' } }
export const setPathway = (p: Pathway) => { try { localStorage.setItem('hlx-pathway', p) } catch { /* ignore */ } }
export const assignedFormIds = assignedByPathway.chronic.map((a) => a.formId)

export const sections = forms[0].sections

const byText = (formId: string, startsWith: string) => {
  for (const s of forms.find((f) => f.id === formId)!.sections) for (const q of s.questions) if (q.text.startsWith(startsWith)) return q.id
  return ''
}
export const sampleAnswers: Record<string, unknown> = {
  [byText('new-patient', 'First Name')]: 'Marisol', [byText('new-patient', 'Last Name')]: 'Andrade', [byText('new-patient', 'Date of Birth')]: '1971-03-14', [byText('new-patient', 'Sex')]: 'female', [byText('new-patient', 'Age')]: 55,
  [byText('new-patient', 'Email')]: 'm.andrade@example.com', [byText('new-patient', 'City')]: 'Irvine', [byText('new-patient', 'State')]: 'CA', [byText('new-patient', 'Phone (Cell)')]: '(949) 555-0142',
  [byText('new-patient', 'Emergency Contact Name')]: 'Luis Andrade', [byText('new-patient', 'Relationship')]: 'Husband',
  [byText('new-patient', 'How did you hear')]: 'Helixona Website', [byText('new-patient', 'Insurance Carrier')]: 'Anthem Blue Cross PPO',
  [byText('new-patient', 'Do you give permission')]: 'Yes',
  [byText('new-patient', 'What provider/facility')]: 'Rheumatology associates, Newport Beach (2024–2026)',
  [byText('new-patient', 'How many and which specialists')]: 'Four: rheumatology, neurology (migraines), endocrinology, pain management.',
  [byText('new-patient', 'My primary concerns')]: ['Daily fatigue that gets worse after any activity', 'Migraines 2–3 times a week', 'Widespread muscle pain (fibromyalgia, 2019)', 'Poor sleep', 'Brain fog in the afternoons'],
  [byText('new-patient', "Treatments you've received")]: [{ treatment: 'Physical therapy (12 weeks)', score: 4 }, { treatment: 'Duloxetine', score: 5 }, { treatment: 'Magnesium + vitamin D', score: 6 }],
  [byText('new-patient', 'In the space below')]: 'Symptoms started after a viral infection in 2018. Work stress and poor sleep make everything worse.',
  [byText('new-patient', 'Please check any conditions')]: ['Thyroid Disorder', 'Autoimmune Disorder'],
  [byText('new-patient', 'Medication')]: [{ Medication: 'Levothyroxine', Dosage: '75 mcg', 'Brand Name': 'Synthroid', Frequency: 'Once daily, morning', 'Take for': 'Hypothyroidism', 'Prescribed by': 'Dr. Patel' }, { Medication: 'Duloxetine', Dosage: '60 mg', 'Brand Name': 'Cymbalta', Frequency: 'Once daily', 'Take for': 'Fibromyalgia pain', 'Prescribed by': 'Dr. Lee' }],
  [byText('new-patient', 'Supplement')]: [{ Supplement: 'Magnesium glycinate', Dosage: '400 mg', 'Brand Name': 'Pure Encapsulations', 'Taken for': 'Sleep / muscle cramps', 'Recommended by (if applicable)': 'Self', 'Where did you purchase from?': 'Online' }, { Supplement: 'Vitamin D3', Dosage: '5,000 IU', 'Brand Name': 'Thorne', 'Taken for': 'Low vitamin D', 'Recommended by (if applicable)': 'Dr. Patel', 'Where did you purchase from?': 'Pharmacy' }],
  [byText('new-patient', 'Please list your known allergies')]: 'Sulfa antibiotics — rash (moderate). Shellfish — swelling (moderate).',
  [byText('new-patient', 'Highest Level Education')]: "Bachelor's degree", [byText('new-patient', 'Marital Status')]: 'Married',
  [byText('new-patient', 'Average hours of sleep')]: 6, [byText('new-patient', 'Do you snore')]: 'No', [byText('new-patient', 'Do you wake up feeling rested')]: 'No',
  [byText('new-patient', 'Rate your current stress')]: 7,
  [byText('new-patient', 'Chronological Timeline')]: '2018 viral infection → 2019 fibromyalgia diagnosis → 2021 hypothyroidism → 2024 migraines worsen → 2026 fatigue limits work.',
}
