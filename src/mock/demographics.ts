/* Patient details beyond the basics: address, sex, contacts, insurance. Sample data only. */
export interface Demographics { sex: string; pronouns?: string; street: string; cityStateZip: string; language: string; prefers: string; emergency: { name: string; relation: string; phone: string }; insurance: { plan: string; memberId: string; type: string }; pcp: string; pharmacy: string; payer: 'Insurance' | 'Cash' }
const d = (sex: string, street: string, cityStateZip: string, em: [string, string, string], ins: [string, string, string], pcp: string, pharmacy: string, prefers = 'Text message', language = 'English'): Demographics =>
  ({ sex, street, cityStateZip, language, prefers, emergency: { name: em[0], relation: em[1], phone: em[2] }, insurance: { plan: ins[0], memberId: ins[1], type: ins[2] }, pcp, pharmacy, payer: /HMO/.test(ins[2]) ? 'Cash' : 'Insurance' })
const data: Record<string, Demographics> = {
  'P-0043': d('Female', '1482 Sycamore Ridge Ln, Apt 3B', 'Irvine, CA 92618', ['Rafael Andrade', 'Spouse', '(949) 555-0143'], ['Blue Shield PPO', '•••• 4471', 'PPO'], 'Dr. Helen Park · Irvine Family Medicine', 'CVS · 5425 Alton Pkwy, Irvine', 'Text message', 'English, Spanish'),
  'P-0044': d('Male', '27 Camino Verde', 'Tustin, CA 92780', ['Ngozi Okafor', 'Spouse', '(714) 555-0102'], ['Aetna PPO', '•••• 9920', 'PPO'], 'Dr. Samuel Reyes · Tustin Medical Group', 'Walgreens · 13052 Newport Ave, Tustin', 'Email'),
  'P-0041': d('Female', '908 Bayside Dr', 'Newport Beach, CA 92660', ['Arun Raman', 'Brother', '(949) 555-0166'], ['Cigna PPO', '•••• 3305', 'PPO'], 'Dr. Lila Chen · Newport Internal Medicine', 'Rite Aid · 1016 Bayside Dr, Newport Beach'),
  'P-0045': d('Male', '24551 Paseo de Valencia, Unit 12', 'Laguna Hills, CA 92653', ['Margaret Whitfield', 'Spouse', '(949) 555-0164'], ['Medicare + Anthem supplement', '•••• 1187', 'Medicare'], 'Dr. Paul Nakamura · Saddleback Primary Care', 'CVS · 24330 El Toro Rd, Laguna Woods', 'Phone call'),
  'P-0039': d('Female', '315 Fairview Rd', 'Costa Mesa, CA 92626', ['Piotr Kowalski', 'Father', '(657) 555-0190'], ['UnitedHealthcare PPO', '•••• 7754', 'PPO'], 'Dr. Aisha Malik · Coastal Family Health', 'Walgreens · 1150 Baker St, Costa Mesa'),
  'P-0046': d('Male', '66 Windchime', 'Irvine, CA 92603', ['Linh Nguyen', 'Spouse', '(949) 555-0189'], ['Blue Cross PPO', '•••• 2048', 'PPO'], 'Dr. Helen Park · Irvine Family Medicine', 'Costco Pharmacy · 115 Technology Dr, Irvine'),
  'P-0047': d('Female', '2210 Orchard Hills Way', 'Irvine, CA 92602', ['Diego Castellanos', 'Spouse', '(949) 555-0122'], ['Aetna PPO', '•••• 6612', 'PPO'], 'Dr. Samuel Reyes · Tustin Medical Group', 'CVS · 3901 Portola Pkwy, Irvine', 'Text message', 'English, Spanish'),
  'P-0048': d('Male', '14 Thornwood', 'Irvine, CA 92604', ['Erin Fitzgerald', 'Sister', '(949) 555-0177'], ['Kaiser HMO', '•••• 8830', 'HMO · out of network'], 'Kaiser Permanente · Irvine', 'Kaiser Pharmacy · 6640 Alton Pkwy, Irvine', 'Email'),
}
export const demographicsFor = (id: string): Demographics | undefined => data[id]
/** Age in whole years. The mockup's "today" is Oct 9, 2026. dob is MM/DD/YYYY. */
export function ageOf(dob: string, today = new Date(2026, 9, 9)): number {
  const [m, dd, y] = dob.split('/').map(Number)
  let a = today.getFullYear() - y
  if (today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < dd)) a--
  return a
}
