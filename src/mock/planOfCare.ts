/** Plan of Care versions for the demo patient (sample data). The newest version is first.
 *  Each version keeps the full plan as it was, a plain list of what changed, and why. */
export interface PlanVersion {
  version: number
  date: string
  stage: number
  lead: string
  focus: string
  goals: string[]
  therapies: { name: string; rhythm: string; note: string }[]
  medications: string[]
  followUp: string[]
  changes: string[]
  why: string
}

export const planVersions: PlanVersion[] = [
  {
    version: 3, date: 'Sep 21, 2026', stage: 3, lead: 'Mold',
    focus: 'Identify and begin resolving the lead actor (mold), while keeping energy and sleep stable.',
    goals: ['Lower the mold burden without triggering crashes', 'Sleep at least 6 restful hours most nights', 'Walk 15 minutes a day without a flare the next day'],
    therapies: [
      { name: 'Hydrogen nano bath', rhythm: '2 per week', note: 'At least 3 days apart' },
      { name: 'Red light therapy', rhythm: 'Up to 3 per week', note: 'At least 2 days apart' },
      { name: 'IV therapy (glutathione)', rhythm: 'Every 2 weeks', note: 'Booked by the office · insurance visit' },
      { name: 'Salt room', rhythm: 'As desired', note: 'Up to 4 per week' },
    ],
    medications: ['Low-dose naltrexone 3 mg, every night', 'Cholestyramine 4 g, once a day', 'Ketotifen 1 mg (compounded), twice a day', 'Magnesium glycinate 400 mg, every night', 'Vitamin D3 5,000 IU, every morning', 'Binder blend, 2 capsules before bed'],
    followUp: ['Mold panel and inflammatory markers before the next visit', 'Next review: Oct 19, 2026'],
    changes: ['Added cholestyramine and a binder blend for mold', 'Added compounded ketotifen', 'Hydrogen nano bath raised from 1 to 2 per week', 'Paused the Erchonia laser until the next review'],
    why: 'Lab results confirmed mold as the lead actor; two crashes in August followed laser sessions.',
  },
  {
    version: 2, date: 'Jul 13, 2026', stage: 2, lead: 'To be identified',
    focus: 'Stabilization: steadier energy and sleep before looking for root causes.',
    goals: ['Fewer than 2 crashes a month', 'A regular sleep schedule', 'Tolerate treatments without next-day flares'],
    therapies: [
      { name: 'Hydrogen nano bath', rhythm: '1 per week', note: 'At least 3 days apart' },
      { name: 'Red light therapy', rhythm: 'Up to 3 per week', note: 'At least 2 days apart' },
      { name: 'Erchonia laser', rhythm: '1 per week', note: 'Requested each time' },
      { name: 'IV therapy (hydration)', rhythm: 'Every 2 weeks', note: 'Booked by the office · insurance visit' },
    ],
    medications: ['Low-dose naltrexone 3 mg, every night', 'Magnesium glycinate 400 mg, every night', 'Vitamin D3 5,000 IU, every morning'],
    followUp: ['Mold and Lyme panels ordered', 'Review in 8 weeks'],
    changes: ['Low-dose naltrexone raised from 1.5 mg to 3 mg', 'Added the Erchonia laser, 1 per week', 'Red light therapy raised from 2 to 3 per week'],
    why: 'The first dose was well tolerated and sleep improved; energy was still low.',
  },
  {
    version: 1, date: 'Jun 15, 2026', stage: 1, lead: 'To be identified',
    focus: 'First plan after the A&P: understand your goals and start gently.',
    goals: ['Define your "why" for the program', 'Begin treatments at a pace your body tolerates'],
    therapies: [
      { name: 'Hydrogen nano bath', rhythm: '1 per week', note: 'At least 3 days apart' },
      { name: 'Red light therapy', rhythm: 'Up to 2 per week', note: 'At least 2 days apart' },
      { name: 'IV therapy (hydration)', rhythm: 'Every 2 weeks', note: 'Booked by the office · insurance visit' },
    ],
    medications: ['Low-dose naltrexone 1.5 mg, every night', 'Magnesium glycinate 400 mg, every night', 'Vitamin D3 5,000 IU, every morning'],
    followUp: ['Baseline labs', 'Review in 4 weeks'],
    changes: ['First Plan of Care, written after the A&P'],
    why: 'Starting point agreed with you at the A&P visit.',
  },
]
