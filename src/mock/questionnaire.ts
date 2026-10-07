// Placeholder clinical content. Every question is labeled in the UI as
// "Sample question — final content from Medical Director". The real
// questionnaire is implemented exactly as supplied (CLAUDE.md §2).

export type QuestionType =
  | 'short' | 'long' | 'single' | 'multi' | 'yesno' | 'date' | 'number' | 'scale' | 'medications'

export interface Question {
  id: string
  type: QuestionType
  text: string
  help?: string
  required?: boolean
  options?: string[]
  showIf?: { questionId: string; equals: string }
  min?: number
  max?: number
  minLabel?: string
  maxLabel?: string
}

export interface Section {
  id: string
  title: string
  intro?: string
  questions: Question[]
}

export const questionnaireMeta = {
  version: 3,
  publishedBy: 'Dr. D. (Medical Director)',
  publishedOn: 'Sep 15, 2026',
  status: 'Published',
  estimatedMinutes: 25,
}

export const sections: Section[] = [
  {
    id: 'about', title: 'About you',
    intro: 'A few basics so we can confirm your record. Your advisor already has most of this.',
    questions: [
      { id: 'a1', type: 'short', text: 'What name would you like us to use?', required: true },
      { id: 'a2', type: 'date', text: 'Date of birth', required: true },
      { id: 'a3', type: 'single', text: 'Preferred way for us to contact you', required: true, options: ['Phone call', 'Text message', 'Email'] },
      { id: 'a4', type: 'yesno', text: 'Do you have someone who helps manage your health care (a caregiver, partner, or family member)?' },
      { id: 'a5', type: 'short', text: 'Their name and relationship to you', showIf: { questionId: 'a4', equals: 'Yes' } },
    ],
  },
  {
    id: 'concerns', title: 'Your main concerns',
    intro: 'Tell us what brought you to Helixona, in your own words.',
    questions: [
      { id: 'c1', type: 'long', text: 'What are the main health concerns you would like help with?', required: true, help: 'There is no wrong answer. Write as much or as little as you like.' },
      { id: 'c2', type: 'number', text: 'For roughly how many years have these concerns affected you?', min: 0, max: 80 },
      { id: 'c3', type: 'scale', text: 'Overall, how much do these concerns limit your daily life right now?', required: true, min: 0, max: 10, minLabel: 'Not at all', maxLabel: 'Completely' },
      { id: 'c4', type: 'multi', text: 'Which of these have you already tried?', options: ['Conventional medications', 'Physical therapy', 'Dietary changes', 'Supplements', 'Acupuncture or bodywork', 'Counseling or therapy', 'None of these'] },
    ],
  },
  {
    id: 'history', title: 'Medical history',
    questions: [
      { id: 'h1', type: 'multi', text: 'Have you been diagnosed with any of the following?', options: ['Autoimmune condition', 'Diabetes or prediabetes', 'Heart or blood-pressure condition', 'Thyroid condition', 'Digestive condition', 'Chronic pain or fibromyalgia', 'Long COVID or post-viral illness', 'Cancer (current or past)', 'None of these'] },
      { id: 'h2', type: 'yesno', text: 'Have you had any surgeries or hospital stays in the past 5 years?', required: true },
      { id: 'h3', type: 'long', text: 'Please list them with approximate dates', showIf: { questionId: 'h2', equals: 'Yes' } },
      { id: 'h4', type: 'yesno', text: 'Do you have any known allergies to medications, foods, or materials?', required: true },
      { id: 'h5', type: 'long', text: 'Please list your allergies and what happens', showIf: { questionId: 'h4', equals: 'Yes' } },
    ],
  },
  {
    id: 'meds', title: 'Medications & supplements',
    intro: 'Include prescriptions, over-the-counter medicines, vitamins, and herbal products. You can also upload a list on the next step.',
    questions: [
      { id: 'm1', type: 'medications', text: 'Current medications and supplements', required: true },
    ],
  },
  {
    id: 'today', title: 'Symptoms today',
    intro: 'This gives your care team a starting point to compare against later.',
    questions: [
      { id: 's1', type: 'scale', text: 'Energy level today', required: true, min: 0, max: 10, minLabel: 'None', maxLabel: 'Full' },
      { id: 's2', type: 'scale', text: 'Pain level today', required: true, min: 0, max: 10, minLabel: 'No pain', maxLabel: 'Worst imaginable' },
      { id: 's3', type: 'scale', text: 'Sleep quality over the past week', required: true, min: 0, max: 10, minLabel: 'Very poor', maxLabel: 'Excellent' },
      { id: 's4', type: 'single', text: 'How often do you experience "crashes" (days where symptoms are much worse after activity)?', options: ['Never', 'A few times a year', 'Monthly', 'Weekly', 'Most days'] },
    ],
  },
  {
    id: 'lifestyle', title: 'Lifestyle',
    questions: [
      { id: 'l1', type: 'single', text: 'How would you describe your typical diet?', options: ['No particular pattern', 'Mediterranean', 'Low carbohydrate', 'Vegetarian or vegan', 'Gluten-free', 'Other'] },
      { id: 'l2', type: 'number', text: 'On average, how many hours do you sleep per night?', min: 0, max: 16 },
      { id: 'l3', type: 'yesno', text: 'Do you currently use tobacco or nicotine products?' },
      { id: 'l4', type: 'single', text: 'How often do you drink alcohol?', options: ['Never', 'Occasionally', 'A few times a week', 'Daily'] },
    ],
  },
  {
    id: 'goals', title: 'Goals for care',
    questions: [
      { id: 'g1', type: 'long', text: 'If the next nine months went well, what would be different in your life?', required: true },
      { id: 'g2', type: 'long', text: 'Is there anything else you want the Medical Director to know before your first visit?' },
    ],
  },
]

export const sampleAnswers: Record<string, unknown> = {
  a1: 'Marisol', a2: '1971-03-14', a3: 'Text message', a4: 'Yes', a5: 'Luis Andrade — husband',
  c1: 'Daily fatigue that gets worse after any activity, migraines 2–3 times a week, and widespread muscle pain. I was diagnosed with fibromyalgia in 2019 and nothing has really helped long-term.',
  c2: 7, c3: 7, c4: ['Conventional medications', 'Physical therapy', 'Supplements'],
  h1: ['Chronic pain or fibromyalgia', 'Thyroid condition'], h2: 'No', h4: 'Yes', h5: 'Sulfa antibiotics — rash. Shellfish — swelling.',
  m1: [
    { name: 'Levothyroxine', dose: '75 mcg', frequency: 'Once daily, morning', reason: 'Hypothyroidism' },
    { name: 'Duloxetine', dose: '60 mg', frequency: 'Once daily', reason: 'Fibromyalgia pain' },
    { name: 'Magnesium glycinate', dose: '400 mg', frequency: 'Nightly', reason: 'Sleep / muscle cramps' },
    { name: 'Vitamin D3', dose: '5,000 IU', frequency: 'Once daily', reason: 'Low vitamin D (lab 2025)' },
  ],
  s1: 3, s2: 6, s3: 4, s4: 'Weekly',
  l1: 'Gluten-free', l2: 6, l3: 'No', l4: 'Occasionally',
  g1: 'Being able to work a full day without crashing afterwards, and fewer migraine days so I can spend evenings with my family.',
  g2: 'I am sensitive to many medications and prefer to start low and go slow.',
}
