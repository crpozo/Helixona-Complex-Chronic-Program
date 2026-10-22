// GENERATED from NP - Questionnaires 2.xlsx (Medical Director). Wording, order, choices and sections are kept exactly as supplied.
// Do not edit by hand; regenerate with scripts/build_questionnaire.py.
export type QType = 'short' | 'long' | 'single' | 'multi' | 'yesno' | 'date' | 'number' | 'scale' | 'list' | 'table' | 'treatments' | 'matrix' | 'signature' | 'confirm'
export interface Q { id: string; type: QType; text: string; help?: string; required?: boolean; options?: string[]; other?: boolean; rows?: string[]; columns?: string[]; count?: number; max?: number; min?: number; minLabel?: string; maxLabel?: string; showIfPrev?: string }
export interface Sec { id: string; title: string; intro?: string; questions: Q[] }
export interface Form { id: string; title: string; short: string; source: string; program: string; sections: Sec[] }
export const forms: Form[] = [
 {
  "id": "new-patient",
  "title": "New Patient Packet",
  "short": "New Patient Packet",
  "source": "NP - Questionnaires 2.xlsx · sheet \"New Patient\"",
  "sections": [
   {
    "id": "np-demo",
    "title": "Demographics & Insurance Information",
    "questions": [
     {
      "id": "q1",
      "type": "short",
      "text": "First Name (legal)",
      "required": true
     },
     {
      "id": "q2",
      "type": "short",
      "text": "Last Name (legal)",
      "required": true
     },
     {
      "id": "q3",
      "type": "date",
      "text": "Date of Birth",
      "required": true
     },
     {
      "id": "q4",
      "type": "single",
      "text": "Sex",
      "options": [
       "male",
       "female",
       "other"
      ],
      "required": true
     },
     {
      "id": "q5",
      "type": "number",
      "text": "Age"
     },
     {
      "id": "q6",
      "type": "short",
      "text": "Email",
      "required": true
     },
     {
      "id": "q7",
      "type": "short",
      "text": "Street Address"
     },
     {
      "id": "q8",
      "type": "short",
      "text": "City"
     },
     {
      "id": "q9",
      "type": "short",
      "text": "State"
     },
     {
      "id": "q10",
      "type": "short",
      "text": "Zip Code"
     },
     {
      "id": "q11",
      "type": "short",
      "text": "Phone (Home)"
     },
     {
      "id": "q12",
      "type": "short",
      "text": "Phone (Cell)",
      "required": true
     },
     {
      "id": "q13",
      "type": "short",
      "text": "Phone (Work)"
     },
     {
      "id": "q14",
      "type": "short",
      "text": "Emergency Contact Name",
      "required": true
     },
     {
      "id": "q15",
      "type": "short",
      "text": "Relationship"
     },
     {
      "id": "q16",
      "type": "short",
      "text": "Emergency contact · Phone (Home)"
     },
     {
      "id": "q17",
      "type": "short",
      "text": "Emergency contact · Phone (Cell)"
     },
     {
      "id": "q18",
      "type": "short",
      "text": "Emergency contact · Phone (Work)"
     },
     {
      "id": "q19",
      "type": "single",
      "text": "How did you hear about us?",
      "options": [
       "Online Search (Which One?)",
       "Helixona Website",
       "Social Media (Which One?)",
       "Doctor Referral (Name?)",
       "Friend/ Family Referral (Name?)",
       "Other"
      ],
      "other": true
     },
     {
      "id": "q20",
      "type": "short",
      "text": "Insurance Carrier"
     },
     {
      "id": "q21",
      "type": "short",
      "text": "Member ID"
     },
     {
      "id": "q22",
      "type": "short",
      "text": "Group ID"
     },
     {
      "id": "q23",
      "type": "short",
      "text": "Preferred Pharmacy · Name"
     },
     {
      "id": "q24",
      "type": "short",
      "text": "Preferred Pharmacy · Phone"
     },
     {
      "id": "q25",
      "type": "short",
      "text": "Preferred Pharmacy · Address"
     },
     {
      "id": "q26",
      "type": "yesno",
      "text": "Do you give permission for Helixona to link your patient account with your SureScripts account at your pharmacy? (SureScripts is an electronic transmission of prescriptions)"
     }
    ]
   },
   {
    "id": "np-care",
    "title": "Last Healthcare Experience",
    "questions": [
     {
      "id": "q27",
      "type": "short",
      "text": "When, where and from whom did you last receive medical or health care? · Physician Name"
     },
     {
      "id": "q28",
      "type": "short",
      "text": "Facility Name"
     },
     {
      "id": "q29",
      "type": "short",
      "text": "City"
     },
     {
      "id": "q30",
      "type": "short",
      "text": "Phone"
     },
     {
      "id": "q31",
      "type": "short",
      "text": "Current Primary Care Physician (PCP) · Physician Name"
     },
     {
      "id": "q32",
      "type": "short",
      "text": "PCP · Facility Name"
     },
     {
      "id": "q33",
      "type": "short",
      "text": "PCP · City"
     },
     {
      "id": "q34",
      "type": "short",
      "text": "PCP · Phone"
     }
    ]
   },
   {
    "id": "np-story",
    "title": "Your Medical Story",
    "questions": [
     {
      "id": "q35",
      "type": "long",
      "text": "What provider/facility last treated you for your complex illness?"
     },
     {
      "id": "q36",
      "type": "long",
      "text": "How many and which specialists have you been to in order to address your illness (approx)?"
     }
    ]
   },
   {
    "id": "np-review",
    "title": "Current Health Review",
    "questions": [
     {
      "id": "q37",
      "type": "list",
      "text": "My primary concerns are:",
      "count": 5,
      "required": true,
      "help": "Primary concerns may be different than your entire health journey. Please use the last section of this packet for the entire journey."
     },
     {
      "id": "q38",
      "type": "treatments",
      "text": "Treatments you've received and scale of 1-10 how did it help?",
      "help": "Please list any treatments, therapies, or interventions you've tried in the past 12-18 months for your health concerns. These can include IV therapy, physical therapy, alternative therapies, surgeries, or other interventions. (Please list current medication and supplements in subsequent sections only.)",
      "max": 20
     },
     {
      "id": "q39",
      "type": "long",
      "text": "In the space below, please share your ideas on the root causes of your health concerns. This may include any known triggering events. All insights are welcomed!"
     }
    ],
    "intro": "Please help us understand what brought you here by sharing the primary health concerns you are currently facing. You may list symptoms, diagnosis, or conditions that affect your daily life."
   },
   {
    "id": "np-imaging",
    "title": "Imaging and Diagnostics",
    "questions": [
     {
      "id": "q40",
      "type": "long",
      "text": "Please list any significant imaging or diagnostic studies you've had, such as MRIs, CT scans, US, mammograms, colonoscopies, bone density tests, Pap smears, etc.",
      "help": "Note: You may upload diagnostic results and reports directly to your secure portal."
     }
    ]
   },
   {
    "id": "np-pmh",
    "title": "Past Medical History",
    "questions": [
     {
      "id": "q41",
      "type": "multi",
      "text": "Please check any conditions you have been diagnosed with (even if no longer active):",
      "options": [
       "Kidney Disease",
       "Liver Disease",
       "Lung disease",
       "Bleeding Disorder",
       "Eating Disorder",
       "Autoimmune Disorder",
       "Arthritis",
       "Alcohol Use Disorder",
       "Thyroid Disorder",
       "Diabetes",
       "Other Endocrine Disorders",
       "Heart Valve Disorder",
       "Heart Disease",
       "High Cholesterol",
       "Anemia",
       "Gastrointestinal Disorder",
       "Cancer",
       "Gallbladder Issues",
       "Mental Health Condition",
       "Substance Use Disorder",
       "Lyme Disease",
       "Other Vector Borne Infections",
       "HIV/AIDS",
       "POTS",
       "MCAS",
       "Mold Related Illness",
       "Heavy Metal Related Illness",
       "Hypermobility",
       "Long COVID",
       "None"
      ]
     },
     {
      "id": "q42",
      "type": "long",
      "text": "Past Surgical History · Please list past surgeries and dates, with any complications:"
     },
     {
      "id": "q43",
      "type": "long",
      "text": "Please upload or document any recent or pertinent labs:",
      "help": "You can also upload lab reports in the Documents step."
     }
    ]
   },
   {
    "id": "np-meds",
    "title": "Prescribed Medication(s) you are currently taking",
    "questions": [
     {
      "id": "q44",
      "type": "table",
      "text": "Medication",
      "columns": [
       "Medication",
       "Dosage",
       "Brand Name",
       "Frequency",
       "Take for",
       "Prescribed by"
      ],
      "max": 12
     }
    ]
   },
   {
    "id": "np-supp",
    "title": "Supplements you are currently taking",
    "questions": [
     {
      "id": "q45",
      "type": "table",
      "text": "Supplement",
      "columns": [
       "Supplement",
       "Dosage",
       "Brand Name",
       "Taken for",
       "Recommended by (if applicable)",
       "Where did you purchase from?"
      ],
      "max": 12
     },
     {
      "id": "q46",
      "type": "long",
      "text": "Please list your known allergies (drug/ supplement/ other, type of reaction; severity):",
      "required": true
     }
    ]
   },
   {
    "id": "np-social",
    "title": "Social and Family History",
    "questions": [
     {
      "id": "q47",
      "type": "short",
      "text": "Highest Level Education"
     },
     {
      "id": "q48",
      "type": "long",
      "text": "Tell us a little about your occupation"
     },
     {
      "id": "q49",
      "type": "single",
      "text": "Marital Status",
      "options": [
       "Single",
       "Married",
       "Divorced",
       "Separated",
       "Domestic Partnership",
       "It's Complicated"
      ]
     },
     {
      "id": "q50",
      "type": "long",
      "text": "Living arrangements: (house, apartment, who do you live with?)"
     },
     {
      "id": "q51",
      "type": "number",
      "text": "Number of Children"
     },
     {
      "id": "q52",
      "type": "number",
      "text": "Number of Pregnancies"
     },
     {
      "id": "q53",
      "type": "short",
      "text": "Children's Ages"
     },
     {
      "id": "q54",
      "type": "short",
      "text": "Children's Genders"
     },
     {
      "id": "q55",
      "type": "long",
      "text": "Children's Health"
     },
     {
      "id": "q56",
      "type": "yesno",
      "text": "Have you had any struggle with fertility?"
     },
     {
      "id": "q57",
      "type": "short",
      "text": "Father · Age"
     },
     {
      "id": "q58",
      "type": "short",
      "text": "Father · If deceased, age and cause"
     },
     {
      "id": "q59",
      "type": "short",
      "text": "Mother · Age"
     },
     {
      "id": "q60",
      "type": "short",
      "text": "Mother · If deceased, age and cause"
     },
     {
      "id": "q61",
      "type": "short",
      "text": "Siblings · Age"
     },
     {
      "id": "q62",
      "type": "short",
      "text": "Siblings · Health concerns"
     },
     {
      "id": "q63",
      "type": "long",
      "text": "Do you have any concerning family illnesses in your family tree?"
     },
     {
      "id": "q64",
      "type": "multi",
      "text": "Have any of your immediate family members had any of these conditions:",
      "options": [
       "High Blood Pressure",
       "Kidney Disease",
       "Mental Illness",
       "Migraines",
       "Heart Disease",
       "Allergies",
       "Cancer",
       "Abnormal Bleeding",
       "Strokes",
       "Arthritis",
       "Anemia",
       "Epilepsy",
       "Obesity",
       "Autoimmune Disease",
       "Diabetes"
      ]
     }
    ]
   },
   {
    "id": "np-lifestyle",
    "title": "Lifestyle & Digestive Health",
    "questions": [
     {
      "id": "q65",
      "type": "number",
      "text": "Gluten-Free (%)",
      "min": 0,
      "max": 100
     },
     {
      "id": "q66",
      "type": "number",
      "text": "Dairy-Free (%)",
      "min": 0,
      "max": 100
     },
     {
      "id": "q67",
      "type": "number",
      "text": "Sugar-Free (%)",
      "min": 0,
      "max": 100
     },
     {
      "id": "q68",
      "type": "number",
      "text": "On average, how many alcoholic drinks do you consume per week?"
     },
     {
      "id": "q69",
      "type": "number",
      "text": "On average, how many caffeinated drinks do you consume per week?"
     },
     {
      "id": "q70",
      "type": "long",
      "text": "Do you smoke now or have you smoked in the past? If so, substance, frequency and duration of use, and quit date if applicable:"
     },
     {
      "id": "q71",
      "type": "long",
      "text": "Do you experience specific food cravings? If so, please describe:"
     },
     {
      "id": "q72",
      "type": "long",
      "text": "What do you think are your worst food habits?"
     },
     {
      "id": "q73",
      "type": "long",
      "text": "What are your healthiest food habits?"
     },
     {
      "id": "q74",
      "type": "long",
      "text": "For relaxation or fun, I enjoy:"
     },
     {
      "id": "q75",
      "type": "number",
      "text": "How many times do you work out per week?"
     },
     {
      "id": "q76",
      "type": "short",
      "text": "What type of exercise?"
     },
     {
      "id": "q77",
      "type": "date",
      "text": "If female: Date of last menstrual cycle"
     },
     {
      "id": "q78",
      "type": "single",
      "text": "Cycle Characteristics",
      "options": [
       "Light",
       "Normal",
       "Heavy",
       "Irregular",
       "Menopausal"
      ]
     },
     {
      "id": "q79",
      "type": "long",
      "text": "How has your illness affected your day to day life?"
     },
     {
      "id": "q80",
      "type": "scale",
      "text": "Rate your current stress level on a scale of 1-10 during your average week?",
      "min": 1,
      "max": 10,
      "minLabel": "1 (being the lowest)",
      "maxLabel": "10 (being the Highest)"
     }
    ],
    "intro": "Estimate the proportion of your diet that follows the guidelines below:"
   },
   {
    "id": "np-bowel",
    "title": "Bowel Health",
    "questions": [
     {
      "id": "q81",
      "type": "number",
      "text": "Average number of bowel movements per day"
     },
     {
      "id": "q82",
      "type": "single",
      "text": "Typical consistency",
      "options": [
       "Liquid",
       "Loose",
       "Soft",
       "Formed",
       "Hard"
      ]
     },
     {
      "id": "q83",
      "type": "long",
      "text": "Do you experience bloating, constipation, or urgency?"
     }
    ]
   },
   {
    "id": "np-sleep",
    "title": "Sleep & Rest",
    "questions": [
     {
      "id": "q84",
      "type": "number",
      "text": "Average hours of sleep per night"
     },
     {
      "id": "q85",
      "type": "yesno",
      "text": "Do you snore?"
     },
     {
      "id": "q86",
      "type": "yesno",
      "text": "Do you wake up feeling rested?"
     }
    ]
   },
   {
    "id": "np-military",
    "title": "Military Service",
    "questions": [
     {
      "id": "q87",
      "type": "yesno",
      "text": "Did you or either of your parents serve the military?"
     },
     {
      "id": "q88",
      "type": "short",
      "text": "If yes, who served:",
      "showIfPrev": "Yes"
     },
     {
      "id": "q89",
      "type": "yesno",
      "text": "Active Combat/ Deployed?"
     },
     {
      "id": "q90",
      "type": "single",
      "text": "If a parent, was it before or after your conception?",
      "options": [
       "Before Conception",
       "After Conception",
       "I Dont Know",
       "Not Applicable"
      ]
     }
    ]
   },
   {
    "id": "np-env",
    "title": "Local Environment",
    "questions": [
     {
      "id": "q91",
      "type": "short",
      "text": "What country did you grow up in?"
     },
     {
      "id": "q92",
      "type": "short",
      "text": "If not the USA, what age did you come to the US?"
     },
     {
      "id": "q93",
      "type": "long",
      "text": "Have you spend extended time living outside of the US? Is so, how long and where?"
     },
     {
      "id": "q94",
      "type": "long",
      "text": "Have you ever been concerned that the area you grew up in had environmental toxicity?"
     },
     {
      "id": "q95",
      "type": "long",
      "text": "Have you experienced a significant illness, accident or hospitalization while living outside of the US?"
     }
    ]
   },
   {
    "id": "np-childhood",
    "title": "General Well-Being in Childhood",
    "questions": [
     {
      "id": "q96",
      "type": "single",
      "text": "Looking back, how would you describe your overall sense of safety and comfort during your childhood years (up to age 18)?",
      "options": [
       "Very safe and comfortable",
       "Mostly safe and comfortable",
       "Sometimes unsafe and uncomfortable",
       "Prefer not to say"
      ]
     },
     {
      "id": "q97",
      "type": "single",
      "text": "Early Life Stressors · Have there been any challenging or difficult experiences in your childhood (before age 18) that you feel might still affect you today? This could include things like family changes, moving a lot, or other rough times.",
      "options": [
       "Very safe and comfortable",
       "Mostly safe and comfortable",
       "Sometimes unsafe and uncomfortable",
       "Prefer not to say"
      ]
     },
     {
      "id": "q98",
      "type": "single",
      "text": "Impact on Current Health · Do you think any experiences from your childhood might influencing your current health challenges? For example, stress or difficult times that still come to mind.",
      "options": [
       "Very safe and comfortable",
       "Mostly safe and comfortable",
       "Sometimes unsafe and uncomfortable",
       "Prefer not to say"
      ]
     },
     {
      "id": "q99",
      "type": "single",
      "text": "Support During Childhood · When you were growing up, how supported did you feel by the people around you, like family or caregivers?",
      "options": [
       "Very safe and comfortable",
       "Mostly safe and comfortable",
       "Sometimes unsafe and uncomfortable",
       "Prefer not to say"
      ]
     }
    ]
   },
   {
    "id": "np-missing",
    "title": "What are we missing?",
    "questions": [
     {
      "id": "q100",
      "type": "long",
      "text": "Is there anything that you think we should know, that we have not already addresses?"
     },
     {
      "id": "q101",
      "type": "long",
      "text": "Chronological Timeline of Health Journey: Please list in order major health events, signs and symptoms from your childhood to present.",
      "required": true
     },
     {
      "id": "q102",
      "type": "signature",
      "text": "By typing my name below as my digital signature, I attest that all of the above information is correct to the best of my knowledge. (Parent or guardian signature if the patient is under the age of 18.)",
      "required": true
     }
    ]
   }
  ],
  "program": "Complex Chronic"
 },
 {
  "id": "sf36",
  "title": "SF-36 Questionnaire (Quality of Life)",
  "short": "SF-36 · Quality of Life",
  "source": "sheet \"SF-36\"",
  "sections": [
   {
    "id": "sf-general",
    "title": "General Health",
    "questions": [
     {
      "id": "q103",
      "type": "single",
      "text": "In General, would you say your health is:",
      "options": [
       "Excellent",
       "Very Good",
       "Good",
       "Fair",
       "Poor"
      ],
      "required": true
     },
     {
      "id": "q104",
      "type": "single",
      "text": "Compared to one year ago, how would you rate your general health now?",
      "options": [
       "Much better now than one year ago",
       "Somewhat better now than one year ago",
       "About the same",
       "Somewhat worse than one year ago",
       "Much worse than one year ago"
      ],
      "required": true
     }
    ]
   },
   {
    "id": "sf-limit",
    "title": "Limitation of Activities",
    "questions": [
     {
      "id": "q105",
      "type": "matrix",
      "text": "Does your health now limit you in these activities? If so, how much?",
      "options": [
       "Yes, Limited a Lot",
       "Yes, Limited a Little",
       "No, Not Limited at all"
      ],
      "rows": [
       "Vigorous activities, such as running, lifting heavy objects, participating in strenuous sports",
       "Moderate activities, such as moving a table, pushing a vacuum cleaner, bowling, or playing golf",
       "Lifting or carrying groceries",
       "Climbing several flights of stairs",
       "Climbing one flight of stairs",
       "Bending, kneeling, or stooping",
       "Walking more than a mile",
       "Walking several blocks",
       "Walking one block",
       "Bathing or dressing yourself"
      ]
     }
    ],
    "intro": "The following items are about activities you might do during a typical day."
   },
   {
    "id": "sf-physical",
    "title": "Physical Health Problems",
    "questions": [
     {
      "id": "q106",
      "type": "matrix",
      "text": "During the past 4 weeks, have you had any of the following problems with your work or other regular daily activities as a result of your physical health?",
      "options": [
       "Yes",
       "No"
      ],
      "rows": [
       "Cut down the amount of time you spent on work or other activities",
       "Accomplished less than you would like",
       "Were limited in the kind of work or other activities",
       "Had difficulty performing the work or other activities (for example, it took extra effort)"
      ]
     }
    ]
   },
   {
    "id": "sf-emotional",
    "title": "Emotional Health Problems",
    "questions": [
     {
      "id": "q107",
      "type": "matrix",
      "text": "During the past 4 weeks, have you had any of the following problems with your work or other regular daily activities as a result of any emotional problems (such as feeling depressed or anxious)?",
      "options": [
       "Yes",
       "No"
      ],
      "rows": [
       "Cut down the amount of time you spent on work or other activities",
       "Accomplished less than you would like",
       "Didn't do work or other activities as carefully as usual"
      ]
     }
    ]
   },
   {
    "id": "sf-social",
    "title": "Social Activities",
    "questions": [
     {
      "id": "q108",
      "type": "single",
      "text": "Emotional problems interfered with your normal social activities with family, friends, neighbors or groups?",
      "options": [
       "Not at all",
       "Slightly",
       "Moderately",
       "Severely",
       "Very Severe"
      ]
     }
    ]
   },
   {
    "id": "sf-pain",
    "title": "Pain",
    "questions": [
     {
      "id": "q109",
      "type": "single",
      "text": "How much bodily pain have you had during the past 4 weeks?",
      "options": [
       "None",
       "Very Mild",
       "Mild",
       "Moderate",
       "Severe",
       "Very Severe"
      ]
     },
     {
      "id": "q110",
      "type": "single",
      "text": "During the past 4 weeks, how much did pain interfere with your normal work (including both work outside the home and housework)?",
      "options": [
       "Not at all",
       "Slightly",
       "Moderately",
       "Severe",
       "Very Severe"
      ]
     }
    ]
   },
   {
    "id": "sf-energy",
    "title": "Energy and Emotions",
    "questions": [
     {
      "id": "q111",
      "type": "matrix",
      "text": "These questions are about how you feel and how things have been with you during the last 4 weeks. For each question, please give the answer that comes closest to the way you have been feeling.",
      "options": [
       "All of the time",
       "Most of the time",
       "A good bit of the time",
       "Some of the time",
       "A little bit of the time",
       "None of the time"
      ],
      "rows": [
       "Did you feel full of pep?",
       "Have you been a very nervous person?",
       "Have you felt so down in the dumps that nothing could cheer you up?",
       "Have you felt calm and peaceful?",
       "Did you have a lot of energy?",
       "Have you felt downhearted and blue?",
       "Did you feel worn out?",
       "Have you been a happy person?",
       "Did you feel tired?"
      ]
     }
    ]
   },
   {
    "id": "sf-social2",
    "title": "Social Activities (past 4 weeks)",
    "questions": [
     {
      "id": "q112",
      "type": "single",
      "text": "During the past 4 weeks, how much of the time has your physical health or emotional problems interfered with your social activities (like visiting with friends, relatives, etc.)?",
      "options": [
       "All of the time",
       "Most of the time",
       "A good bit of the time",
       "Some of the time",
       "A little bit of the time",
       "None of the time"
      ]
     }
    ]
   },
   {
    "id": "sf-general2",
    "title": "General Health Statements",
    "questions": [
     {
      "id": "q113",
      "type": "matrix",
      "text": "How true or false is each of the following statements for you?",
      "options": [
       "Definitely True",
       "Mostly True",
       "Don't Know",
       "Mostly False",
       "Definitely False"
      ],
      "rows": [
       "I seem to get sick a little easier than other people",
       "I am as healthy as anybody I know",
       "I expect my health to get worse",
       "My health is excellent"
      ]
     }
    ]
   }
  ],
  "program": "Complex Chronic"
 },
 {
  "id": "mold",
  "title": "Mold History Questionnaire",
  "short": "Mold History",
  "source": "sheet \"Mold\"",
  "sections": [
   {
    "id": "mold-1",
    "title": "Mold History Questionnaire",
    "questions": [
     {
      "id": "q114",
      "type": "number",
      "text": "Regardless of whether you live in a freestanding home, apartment building, or condominium, what year was it built?"
     },
     {
      "id": "q115",
      "type": "yesno",
      "text": "Does your residence smell musty?"
     },
     {
      "id": "q116",
      "type": "yesno",
      "text": "How about mold, is mold visible anywhere inside your residence?"
     },
     {
      "id": "q117",
      "type": "yesno",
      "text": "Does you home, apartment, or condominium have a crawlspace or basement?"
     },
     {
      "id": "q118",
      "type": "yesno",
      "text": "If yes, is crawlspace or basement damp or does it smell musty?"
     },
     {
      "id": "q119",
      "type": "single",
      "text": "If the building has a crawlspace, is it covered with vapor barrier?",
      "options": [
       "Yes",
       "No",
       "Do not know"
      ]
     },
     {
      "id": "q120",
      "type": "single",
      "text": "If there is a vapor barrier, is it intact?",
      "options": [
       "Yes",
       "No",
       "Do not know"
      ]
     },
     {
      "id": "q121",
      "type": "single",
      "text": "If there is a vapor barrier, is it taped together and brought up the sidewalls of the foundation?",
      "options": [
       "Yes",
       "No",
       "Do not know"
      ]
     },
     {
      "id": "q122",
      "type": "yesno",
      "text": "If your house, apartment, or condominium includes a basement:"
     },
     {
      "id": "q123",
      "type": "yesno",
      "text": "Is the basement finished?"
     },
     {
      "id": "q124",
      "type": "yesno",
      "text": "Is there carpet?"
     },
     {
      "id": "q125",
      "type": "yesno",
      "text": "Is water pooling?"
     },
     {
      "id": "q126",
      "type": "yesno",
      "text": "Is there any standing water inside or around the outside of your house, apartment, or condominium?"
     },
     {
      "id": "q127",
      "type": "single",
      "text": "Does the area your house, apartment, or condominium slope down toward your residence or away from it?",
      "options": [
       "Toward",
       "Away",
       "N/A"
      ]
     },
     {
      "id": "q128",
      "type": "yesno",
      "text": "If your house, apartment, or condominium has downspouts, are they connected to gutters?"
     },
     {
      "id": "q129",
      "type": "single",
      "text": "If your house, apartment, or condominium has gutters, do they overflow during heavy downpours?",
      "options": [
       "Yes",
       "No",
       "Do not know"
      ]
     },
     {
      "id": "q130",
      "type": "single",
      "text": "Do any of the windows in your house, apartment, or condominium leak (i.e., allow water to enter the residence when it's raining)?",
      "options": [
       "Yes",
       "No",
       "Do not know"
      ]
     },
     {
      "id": "q131",
      "type": "single",
      "text": "Does the roof of your house, apartment, or condominium have any leaks?",
      "options": [
       "Yes",
       "No",
       "Do not know"
      ]
     },
     {
      "id": "q132",
      "type": "short",
      "text": "If you know what the humidity is inside your house, apartment, or condominium, please note it here:"
     },
     {
      "id": "q133",
      "type": "yesno",
      "text": "Do any of the windows in your house, apartment, or condominium collect condensation?"
     },
     {
      "id": "q134",
      "type": "number",
      "text": "What percentage of your living space is covered by carpet?",
      "min": 0,
      "max": 100
     },
     {
      "id": "q135",
      "type": "short",
      "text": "How old is the carpeting in the residence?"
     },
     {
      "id": "q136",
      "type": "yesno",
      "text": "Are water stains present on any of the ceilings, flooring, or walls in your house, apartment, or condominium?"
     },
     {
      "id": "q137",
      "type": "yesno",
      "text": "Does the flooring sag in any of the rooms of your house, apartment, or condominium?"
     },
     {
      "id": "q138",
      "type": "yesno",
      "text": "Do you have a dryer inside your house, apartment, or condominium, does it vent to the outdoors?"
     },
     {
      "id": "q139",
      "type": "yesno",
      "text": "If your bathrooms have vents, do they vent to the outside of the residence and not into the insulation in the attic or other spaces?"
     },
     {
      "id": "q140",
      "type": "yesno",
      "text": "Are others in your house, apartment, or condominium frequently sick?"
     },
     {
      "id": "q141",
      "type": "yesno",
      "text": "Not including where you live now, have you ever lived in a house, apartment, or condominium had confirmed or suspected issues related to mold or water damage?"
     },
     {
      "id": "q142",
      "type": "long",
      "text": "If your home, apartment, or condominium has standalone air conditioning units or mini splits (heating and cooling systems that allow you to control the temperatures in individual rooms or spaces), please shine a light into the unit(s) without disassembling them and describe what's inside with respect to mold, accumulating dust, etc."
     },
     {
      "id": "q143",
      "type": "long",
      "text": "Finally, using the space below, please tell us anything else you may feel may help us understand your exposure to mold. For example, if you spend time in an office, school, restaurant, or other environment where you suspect mold is present, please tell us about that below in as much detail as possible:"
     }
    ],
    "intro": "Indoor dampness and mold (fungal growth) are common problems in California and around the world. In fact, studies reveal most residential and commercial buildings in the U.S. have experienced water damage, while many currently are water damaged. When a building has suffered water damage, the likelihood of mold is significantly increased, and if there's mold in your home, you may have mold-related illness. By answering the following questions, you'll help us understand what your mold-related exposure may be. Please answer each question as best as you can. At the end, feel free to share any additional details we may not have asked about below."
   }
  ],
  "program": "Complex Chronic · condition-specific"
 },
 {
  "id": "metabolic",
  "title": "Metabolic Assessment Form",
  "short": "Metabolic Assessment",
  "source": "sheet \"Metabolic\"",
  "sections": [
   {
    "id": "met-1",
    "title": "Part I",
    "questions": [
     {
      "id": "q144",
      "type": "scale",
      "text": "Rate your stress level on a scale of low to high during the average week? (low being the least, high being the most)",
      "min": 1,
      "max": 10,
      "minLabel": "Low",
      "maxLabel": "High"
     },
     {
      "id": "q145",
      "type": "number",
      "text": "How many alcoholic beverages do you consume per week?"
     },
     {
      "id": "q146",
      "type": "number",
      "text": "How many times do you work out per week?"
     },
     {
      "id": "q147",
      "type": "number",
      "text": "How many times do you eat out per week?"
     },
     {
      "id": "q148",
      "type": "number",
      "text": "How many times do you eat fast food per week?"
     },
     {
      "id": "q149",
      "type": "number",
      "text": "How many times do you eat raw nuts or seeds per week?"
     },
     {
      "id": "q150",
      "type": "list",
      "text": "List the three worst foods you eat during the average week:",
      "count": 3
     },
     {
      "id": "q151",
      "type": "list",
      "text": "List the three healthiest foods you eat during the average week:",
      "count": 3
     },
     {
      "id": "q152",
      "type": "table",
      "text": "Using the table below, please tell us about any medications you currently take.",
      "columns": [
       "Medication",
       "Dosage",
       "Brand Name",
       "Frequency",
       "Taken For"
      ],
      "max": 10
     },
     {
      "id": "q153",
      "type": "table",
      "text": "Using the table below, please tell us about any supplements you currently take.",
      "columns": [
       "Supplement",
       "Dosage",
       "Brand Name",
       "Frequency",
       "Taken For"
      ],
      "max": 10
     }
    ],
    "intro": "Instructions: The purpose of this questionnaire is to identify difficulties you may be experiencing. Please, answer every question, do not skip any questions."
   },
   {
    "id": "met-c0",
    "title": "Category I",
    "questions": [
     {
      "id": "q154",
      "type": "matrix",
      "text": "Please indicate the appropriate selection on the questions below.",
      "options": [
       "Never",
       "Often",
       "Frequently",
       "Always"
      ],
      "rows": [
       "Feeling that bowels do not empty completely",
       "Lower abdominal pain relieved by passing stool or gas",
       "Alternating constipation and diarrhea",
       "Diarrhea",
       "Constipation",
       "Hard, dry, or small stool",
       "Coated tongue or \"fuzzy\" debris on tongue",
       "Pass large amount of foul-smelling gas",
       "More than three bowel movements daily",
       "Use laxatives frequently"
      ]
     }
    ],
    "intro": "Part II - Instructions: The purpose of this questionnaire is to identify difficulties you may be experiencing. Please answer every questions, do not skip any questions. Follow the key, select, which best fits for all of your answers. Totals per category are calculated automatically."
   },
   {
    "id": "met-c1",
    "title": "Category III",
    "questions": [
     {
      "id": "q155",
      "type": "matrix",
      "text": "Please indicate the appropriate selection on the questions below.",
      "options": [
       "Never",
       "Often",
       "Frequently",
       "Always"
      ],
      "rows": [
       "Excessive belching, burping, or bloating",
       "Gas immediately following a meal",
       "Offensive breathe",
       "Difficult bowel movements",
       "Sense of fullness during and after meals",
       "Difficulty digesting fruits and vegetables; undigested food found in stools"
      ]
     }
    ]
   },
   {
    "id": "met-c2",
    "title": "Category IV",
    "questions": [
     {
      "id": "q156",
      "type": "matrix",
      "text": "Please indicate the appropriate selection on the questions below.",
      "options": [
       "Never",
       "Often",
       "Frequently",
       "Always"
      ],
      "rows": [
       "Use of antacids",
       "Stomach pain, burning, or aching after eating",
       "Feel hungry an hour or two after eating",
       "Heartburn when lying down or bending forward",
       "Temporary relief by using antacids, food, milk, or carbonated beverages",
       "Digestive problems subside with rest and relaxation",
       "Heartburn due to spicy foods, chocolate, citrus, peppers, alcohol, and caffeine"
      ]
     }
    ]
   },
   {
    "id": "met-c3",
    "title": "Category V",
    "questions": [
     {
      "id": "q157",
      "type": "matrix",
      "text": "Please indicate the appropriate selection on the questions below.",
      "options": [
       "Never",
       "Often",
       "Frequently",
       "Always"
      ],
      "rows": [
       "Roughage and fiber cause constipation",
       "Indigestion and fullness last after eating",
       "Pain, tenderness, soreness on the left side under rib cage",
       "Excessive passage of gas",
       "Nausea and/or vomiting",
       "Stool undigested, foul smelling, mucus-like greasy, or poorly formed",
       "Frequent urination",
       "Increased thirst and appetite"
      ]
     }
    ]
   },
   {
    "id": "met-c4",
    "title": "Category VI",
    "questions": [
     {
      "id": "q158",
      "type": "matrix",
      "text": "Please indicate the appropriate selection on the questions below.",
      "options": [
       "Never",
       "Often",
       "Frequently",
       "Always"
      ],
      "rows": [
       "Abdominal distention after consumption of fiber, starches, and sugar",
       "Lowered gastrointestinal motility, constipation",
       "Raised gastrointestinal motility, diarrhea",
       "Alternating constipation and diarrhea",
       "Suspicion of nutritional malabsorption",
       "Frequent use of antacid medication",
       "Have you been diagnosed with: Celiac Disease, Irritable Bowel Syndrome, Diverticulosis/Diverticulitis, or Leaky Gut Syndrome?"
      ]
     }
    ]
   },
   {
    "id": "met-c5",
    "title": "Category VII",
    "questions": [
     {
      "id": "q159",
      "type": "matrix",
      "text": "Please indicate the appropriate selection on the questions below.",
      "options": [
       "Never",
       "Often",
       "Frequently",
       "Always"
      ],
      "rows": [
       "Greasy or high-fat foods cause distress",
       "Lower bowel gas and/or bloating several hours after eating",
       "Bitter metallic taste in mouth, especially in the morning",
       "Burpy, fishy taste after consuming fish oils",
       "Difficulty losing weight",
       "Unexplained itchy skin",
       "Yellowish cast to eyes",
       "Stool color alternates from clay colored to normal brow",
       "Reddened skin, especially palms",
       "Dry or flaky skin and/or hair",
       "History of gallbladder attacks or stone",
       "Have you had your gallbladder removed?"
      ]
     }
    ]
   },
   {
    "id": "met-c6",
    "title": "Category VIII",
    "questions": [
     {
      "id": "q160",
      "type": "matrix",
      "text": "Please indicate the appropriate selection on the questions below.",
      "options": [
       "Never",
       "Often",
       "Frequently",
       "Always"
      ],
      "rows": [
       "Acne and unhealthy skin",
       "Excessive hair loss",
       "Overall sense of bloating",
       "Bodily swelling for no reason",
       "Hormone imbalances",
       "Weight gain",
       "Poor bowel function",
       "Excessively foul-smelling sweat"
      ]
     }
    ]
   },
   {
    "id": "met-c7",
    "title": "Category IX",
    "questions": [
     {
      "id": "q161",
      "type": "matrix",
      "text": "Please indicate the appropriate selection on the questions below.",
      "options": [
       "Never",
       "Often",
       "Frequently",
       "Always"
      ],
      "rows": [
       "Crave sweets during the day",
       "Irritable if meals are missed",
       "Depend on coffee to keep going/get started",
       "Get light-headed if meals are missed",
       "Eating relieves fatigue",
       "Feel shaky, jittery, or have tremors",
       "Agitated, easily upset, nervous",
       "Poor memory/forgetful",
       "Blurred vision"
      ]
     }
    ]
   },
   {
    "id": "met-c8",
    "title": "Category X",
    "questions": [
     {
      "id": "q162",
      "type": "matrix",
      "text": "Please indicate the appropriate selection on the questions below.",
      "options": [
       "Never",
       "Often",
       "Frequently",
       "Always"
      ],
      "rows": [
       "Fatigue after meals",
       "Crave sweets during the day",
       "Eating sweets does not relieve cravings for sugar",
       "Must have sweets after meal",
       "Waist girth is equal or larger than hip girth",
       "Frequent urination",
       "Increased thirst and appetite",
       "Difficulty losing weight"
      ]
     }
    ]
   },
   {
    "id": "met-c9",
    "title": "Category XI",
    "questions": [
     {
      "id": "q163",
      "type": "matrix",
      "text": "Please indicate the appropriate selection on the questions below.",
      "options": [
       "Never",
       "Often",
       "Frequently",
       "Always"
      ],
      "rows": [
       "Cannot stay asleep",
       "Crave salt",
       "Slow starter in the morning",
       "Afternoon fatigue",
       "Dizziness when standing up quickly",
       "Afternoon headaches",
       "Headaches with exertion or stress",
       "Weak nails"
      ]
     }
    ]
   },
   {
    "id": "met-c10",
    "title": "Category XII",
    "questions": [
     {
      "id": "q164",
      "type": "matrix",
      "text": "Please indicate the appropriate selection on the questions below.",
      "options": [
       "Never",
       "Often",
       "Frequently",
       "Always"
      ],
      "rows": [
       "Cannot fall asleep",
       "Perspire easily",
       "Under a high amount of stress",
       "Weight gain when under stress",
       "Wake up tired even after several hours of sleep",
       "Excessive perspiration or perspiration with little or no activity"
      ]
     }
    ]
   },
   {
    "id": "met-c11",
    "title": "Category XIII",
    "questions": [
     {
      "id": "q165",
      "type": "matrix",
      "text": "Please indicate the appropriate selection on the questions below.",
      "options": [
       "Never",
       "Often",
       "Frequently",
       "Always"
      ],
      "rows": [
       "Edema and swelling in ankles and wrist",
       "Muscle cramping",
       "Poor muscle endurance",
       "Frequent urination",
       "Frequent thirst",
       "Crave salt",
       "Abnormal sweating from minimal activity",
       "Alteration in bowel regularity",
       "Inability to hold breath for long periods",
       "Shallow, rapid breathing"
      ]
     }
    ]
   },
   {
    "id": "met-c12",
    "title": "Category XIV",
    "questions": [
     {
      "id": "q166",
      "type": "matrix",
      "text": "Please indicate the appropriate selection on the questions below.",
      "options": [
       "Never",
       "Often",
       "Frequently",
       "Always"
      ],
      "rows": [
       "Tired/sluggish",
       "Feel cold- hands, feet, all over",
       "Require excessive amounts of sleep to function properly",
       "Increase in weight even with low-calorie diet",
       "Gain weight easily",
       "Difficult, infrequent bowel movements",
       "Depression/lack of motivation",
       "Morning headaches that wear off as the day progresses",
       "Outer third of eyebrow thins",
       "Thinning of hair on scalp, face, or genitals, or excessive hair loss",
       "Dryness of skin and/or scalp",
       "Mental sluggishness"
      ]
     }
    ]
   },
   {
    "id": "met-c13",
    "title": "Category XV",
    "questions": [
     {
      "id": "q167",
      "type": "matrix",
      "text": "Please indicate the appropriate selection on the questions below.",
      "options": [
       "Never",
       "Often",
       "Frequently",
       "Always"
      ],
      "rows": [
       "Heart palpitations",
       "Inward trembling",
       "Increased pulse, even at rest",
       "Nervous and emotional",
       "Insomnia",
       "Night sweats"
      ]
     }
    ]
   },
   {
    "id": "met-c14",
    "title": "Category XVI (Males Only)",
    "questions": [
     {
      "id": "q168",
      "type": "matrix",
      "text": "Please indicate the appropriate selection on the questions below.",
      "options": [
       "Never",
       "Often",
       "Frequently",
       "Always"
      ],
      "rows": [
       "Difficult urination or dribbling",
       "Frequent urination",
       "Pain inside of legs or heels",
       "Feeling of incomplete bowel emptying",
       "Leg twitching at night",
       "Decreased libido",
       "Decreased number of spontaneous morning erections",
       "Decreased fullness of erection",
       "Difficulty maintaining morning erections",
       "Spells of mental fatigue",
       "Inability to concentrate",
       "Episodes of depression",
       "Decreased physical stamina",
       "Muscle soreness",
       "Unexplained weight gain",
       "Increase in fat distribution around chest and hips",
       "Sweating attacks",
       "More emotional than in the past"
      ]
     }
    ]
   },
   {
    "id": "met-c15",
    "title": "Category XVII (Menstruating Females Only)",
    "questions": [
     {
      "id": "q169",
      "type": "matrix",
      "text": "Please indicate the appropriate selection on the questions below.",
      "options": [
       "Never",
       "Often",
       "Frequently",
       "Always"
      ],
      "rows": [
       "Perimenopausal",
       "Alternating menstrual cycle lengths",
       "Extended menstrual cycle (greater than days)",
       "Shortened menstrual cycle (less than days)",
       "Pain and cramping during periods",
       "Scanty blood flow",
       "Heavy blood flow"
      ]
     }
    ]
   }
  ],
  "program": "Complex Chronic · condition-specific"
 },
 {
  "id": "lyme",
  "title": "Lyme Disease Questionnaire",
  "short": "Lyme Disease",
  "source": "sheet \"Lyme\"",
  "sections": [
   {
    "id": "lyme-1",
    "title": "Lyme Disease Questionnaire",
    "questions": [
     {
      "id": "q170",
      "type": "matrix",
      "text": "Symptoms: During the past 2 weeks, how much have you been bothered by any of the following?",
      "options": [
       "Not at all",
       "A little bit",
       "Somewhat",
       "Quite a bit",
       "Very much"
      ],
      "rows": [
       "Shortness of breath",
       "Feeling feverish",
       "Sweats and/or feverish",
       "Nausea and/or vomiting",
       "Back pain",
       "Headaches",
       "Stiff or painful neck",
       "Muscle aches or pains",
       "Joint pain or swelling",
       "Muscle weakness",
       "Feeling fatigued or having low energy",
       "Feeling worse after normal physical exertion",
       "Trouble falling or staying asleep",
       "Needing more sleep than usual",
       "Not feeling rested on awakening",
       "Numbness or tingling",
       "Shooting, stabbing or burning pains",
       "Skin or muscle twitching",
       "Discomfort with normal light or sound",
       "Balance problems or sense of room-spinning",
       "Change in visual clarity or trouble focusing",
       "Bladder discomfort or change in urination",
       "Light-headed or uncomfortable on standing",
       "Hot or cold sensations in extremities",
       "Irregular or rapid heart beats",
       "Feeling irritable, sad, or decreased pleasure",
       "Feeling panicky, anxious or worried",
       "Trouble finding words or retrieving names",
       "Trouble with memory",
       "Slower speed of thinking"
      ]
     },
     {
      "id": "q171",
      "type": "long",
      "text": "Over the last 2 week, have any of the above questions impaired your work, social or family function?"
     }
    ],
    "intro": "Instructions: Please rate the following symptoms from \"0\" to \"4\" (\"0\" = Not at all, \"4\" = Very much level of symptoms). Rate these as true as possible. Do not over exaggerate. Do not underestimate. Please do not over think."
   }
  ],
  "program": "Complex Chronic · condition-specific"
 },
 {
  "id": "brain",
  "title": "Brain Region Localization Form",
  "short": "Brain Region Localization",
  "source": "sheet \"Brain\"",
  "sections": [
   {
    "id": "brain-1",
    "title": "Autonomic Increased Sympathetic Activity",
    "questions": [
     {
      "id": "q172",
      "type": "matrix",
      "text": "Brain Region Localization Form",
      "options": [
       "Never",
       "Often",
       "Frequently",
       "Always"
      ],
      "rows": [
       "Easily startled",
       "Difficulty relaxing",
       "Sensitive to bright or flashing lights",
       "Episodes of racing heart",
       "Difficulty sleeping"
      ]
     },
     {
      "id": "q173",
      "type": "yesno",
      "text": "Have you ever been diagnosed with a seizure disorder?"
     }
    ]
   },
   {
    "id": "brain-2",
    "title": "Epileptiform Activity",
    "questions": [
     {
      "id": "q174",
      "type": "matrix",
      "text": "Please answer yes or no.",
      "options": [
       "Yes",
       "No"
      ],
      "rows": [
       "Have you ever been diagnosed with epilepsy?",
       "Have you ever been told that you seemed frozen, absent, or tuned out at times without any recollection of the event?",
       "Have you ever experienced sudden muscle stiffness and rigidity throughout your body?",
       "Have you ever experienced sudden muscle jerks throughout your body?",
       "Have you ever experienced a total loss of your muscle tone that lead to loss of control of your muscles or fall?",
       "Have you ever been told that you stare into space while you're lip smacking chewing, or fidgeting?",
       "Do you ever experience sudden emotional responses such as anxiety, sadness, cry, or laugh for no reason?",
       "Do you ever experience sudden racing heart rate, sudden loss of bladder function, intestinal spasm, respiration, sweating, or any other sudden changes of function?",
       "Do you ever experience sudden involuntary muscle contractures or jerks involving any individual parts of your limbs or face?",
       "Do you ever experience sudden involuntary head rotation with your eyes moving forcefully to one side?",
       "Do you ever experience sudden involuntary shifts in your eyes to the side or upward?",
       "Do you ever experience sudden vocalization of random words or notice a sudden inability to speak?",
       "Do you ever experience any spontaneous sensations of tingling, \"pins and needles\" numbness, coldness, burning or other random sensations in any region of your body?",
       "Do you ever experience a ringing sensation in your ears (tinnitus), sounds, or voices spontaneously?",
       "Do you ever experience spontaneous perception of smells such as burning rubber, foul smells without finding the source of the odor?",
       "Do you ever experience flashing lights, stars, or jagged lines in your visual field?"
      ]
     }
    ]
   }
  ],
  "program": "Complex Chronic · condition-specific"
 },
 {
  "id": "l2l3-new",
  "title": "Health Optimization · L2/L3 New Patient",
  "short": "Health Optimization · New Patient",
  "source": "sheet \"L2L3 New Patient\"",
  "sections": [
   {
    "id": "np-demo",
    "title": "Demographics & Insurance Information",
    "questions": [
     {
      "id": "q1",
      "type": "short",
      "text": "First Name (legal)",
      "required": true
     },
     {
      "id": "q2",
      "type": "short",
      "text": "Last Name (legal)",
      "required": true
     },
     {
      "id": "q3",
      "type": "date",
      "text": "Date of Birth",
      "required": true
     },
     {
      "id": "q4",
      "type": "single",
      "text": "Sex",
      "options": [
       "male",
       "female",
       "other"
      ],
      "required": true
     },
     {
      "id": "q5",
      "type": "number",
      "text": "Age"
     },
     {
      "id": "q6",
      "type": "short",
      "text": "Email",
      "required": true
     },
     {
      "id": "q7",
      "type": "short",
      "text": "Street Address"
     },
     {
      "id": "q8",
      "type": "short",
      "text": "City"
     },
     {
      "id": "q9",
      "type": "short",
      "text": "State"
     },
     {
      "id": "q10",
      "type": "short",
      "text": "Zip Code"
     },
     {
      "id": "q11",
      "type": "short",
      "text": "Phone (Home)"
     },
     {
      "id": "q12",
      "type": "short",
      "text": "Phone (Cell)",
      "required": true
     },
     {
      "id": "q13",
      "type": "short",
      "text": "Phone (Work)"
     },
     {
      "id": "q14",
      "type": "short",
      "text": "Emergency Contact Name",
      "required": true
     },
     {
      "id": "q15",
      "type": "short",
      "text": "Relationship"
     },
     {
      "id": "q16",
      "type": "short",
      "text": "Emergency contact · Phone (Home)"
     },
     {
      "id": "q17",
      "type": "short",
      "text": "Emergency contact · Phone (Cell)"
     },
     {
      "id": "q18",
      "type": "short",
      "text": "Emergency contact · Phone (Work)"
     },
     {
      "id": "q19",
      "type": "single",
      "text": "How did you hear about us?",
      "options": [
       "Online Search (Which One?)",
       "Helixona Website",
       "Social Media (Which One?)",
       "Doctor Referral (Name?)",
       "Friend/ Family Referral (Name?)",
       "Other"
      ],
      "other": true
     },
     {
      "id": "q20",
      "type": "short",
      "text": "Insurance Carrier"
     },
     {
      "id": "q21",
      "type": "short",
      "text": "Member ID"
     },
     {
      "id": "q22",
      "type": "short",
      "text": "Group ID"
     },
     {
      "id": "q23",
      "type": "short",
      "text": "Preferred Pharmacy · Name"
     },
     {
      "id": "q24",
      "type": "short",
      "text": "Preferred Pharmacy · Phone"
     },
     {
      "id": "q25",
      "type": "short",
      "text": "Preferred Pharmacy · Address"
     },
     {
      "id": "q26",
      "type": "yesno",
      "text": "Do you give permission for Helixona to link your patient account with your SureScripts account at your pharmacy? (SureScripts is an electronic transmission of prescriptions)"
     }
    ]
   },
   {
    "id": "l2-team",
    "title": "Your Medical Support Team",
    "questions": [
     {
      "id": "q175",
      "type": "short",
      "text": "Who is helping you with complex illness currently? · Physician Name"
     },
     {
      "id": "q176",
      "type": "short",
      "text": "Facility Name"
     },
     {
      "id": "q177",
      "type": "short",
      "text": "City"
     },
     {
      "id": "q178",
      "type": "short",
      "text": "Phone"
     },
     {
      "id": "q179",
      "type": "short",
      "text": "How long have you been working with them?"
     },
     {
      "id": "q180",
      "type": "yesno",
      "text": "Did they refer you to Helixona for therapies?"
     },
     {
      "id": "q181",
      "type": "short",
      "text": "If yes, which therapy? (IVs, EBOO, Erchonia Lazer, Other)"
     },
     {
      "id": "q182",
      "type": "short",
      "text": "Who is your current Primary Care Physician (PCP): · Physician Name",
      "help": "Option: same as previous answer"
     },
     {
      "id": "q183",
      "type": "short",
      "text": "PCP · Facility Name"
     },
     {
      "id": "q184",
      "type": "short",
      "text": "PCP · City"
     },
     {
      "id": "q185",
      "type": "short",
      "text": "PCP · Phone"
     }
    ]
   },
   {
    "id": "l2-review",
    "title": "Current Health Review",
    "questions": [
     {
      "id": "q186",
      "type": "list",
      "text": "My primary concerns are:",
      "count": 5,
      "required": true,
      "help": "Primary concerns may be different than your entire health journey. This space is to help us focus on the biggest concerns for your right now."
     },
     {
      "id": "q187",
      "type": "treatments",
      "text": "Treatments you've received and scale of 1-10 how did it help?",
      "help": "Please list any treatments, therapies, or interventions you've tried in the past 12-18 months for your health concerns. These can include medications, supplements, IV therapy, physical therapy, alternative therapies, surgeries, or other interventions. (Please list current medication and supplements in subsequent sections only.)",
      "max": 20
     },
     {
      "id": "q188",
      "type": "short",
      "text": "(For females) Are you pregnant or trying to conceive?"
     },
     {
      "id": "q189",
      "type": "long",
      "text": "In the space below, please share your ideas on the root causes of your health concerns. This may include any known triggering events. All insights are welcomed!"
     }
    ],
    "intro": "Please help us understand what brought you here by sharing the primary health concerns you are currently facing. You may list symptoms, diagnosis, or conditions that affect your daily life."
   },
   {
    "id": "l2-imaging",
    "title": "Imaging and Diagnostics",
    "questions": [
     {
      "id": "q190",
      "type": "yesno",
      "text": "Have you had a G6PD blood test?",
      "help": "Note: You may upload diagnostic results and reports directly to your secure portal."
     },
     {
      "id": "q191",
      "type": "long",
      "text": "Please upload or document any recent or pertinent labs:",
      "help": "Note: For EBOO a CBC or Hgb from the last 3 months is helpful."
     }
    ]
   },
   {
    "id": "l2-pmh",
    "title": "Past Medical History",
    "questions": [
     {
      "id": "q192",
      "type": "multi",
      "text": "Please check any conditions you have been diagnosed with (even if no longer active):",
      "options": [
       "Kidney Disease",
       "Liver Disease",
       "Lung disease",
       "Bleeding Disorder",
       "Eating Disorder",
       "Autoimmune Disorder",
       "Arthritis",
       "Alcohol Use Disorder",
       "Thyroid Disorder",
       "Diabetes",
       "Other Endocrine Disorders",
       "Heart Valve Disorder",
       "Heart Disease",
       "High Cholesterol",
       "Anemia",
       "Gastrointestinal Disorder",
       "Cancer",
       "Gallbladder Issues",
       "Mental Health Condition",
       "Substance Use Disorder",
       "Lyme Disease",
       "Other Vector Borne Infections",
       "HIV/AIDS",
       "MCAS",
       "Mold Related Illness",
       "Heavy Metal Related Illness",
       "Hypermobility",
       "POTS",
       "Long COVID",
       "Other (please specify)"
      ],
      "other": true
     },
     {
      "id": "q193",
      "type": "long",
      "text": "Past Surgical History · Please list past surgeries and dates, with any complications:"
     },
     {
      "id": "q194",
      "type": "long",
      "text": "Implanted Devices · Do you have any implanted devices like a pacemaker, nerve stimulator, pain pump, insulin pump?"
     },
     {
      "id": "q195",
      "type": "long",
      "text": "1. Has a doctor helped you find the root cause of your concern? If yes, what is the root cause."
     },
     {
      "id": "q196",
      "type": "long",
      "text": "2. What testing was done to find the root cause?"
     },
     {
      "id": "q197",
      "type": "long",
      "text": "3. What treatments, medications, supplements have you tried in the past for the root cause?"
     },
     {
      "id": "q198",
      "type": "long",
      "text": "4. What are you currently taking to help with the symptoms or cause of your concern?"
     },
     {
      "id": "q199",
      "type": "long",
      "text": "5. What other treatments are you doing right now for this concern?"
     }
    ]
   },
   {
    "id": "l2-meds",
    "title": "Prescribed Medication(s) you are currently taking",
    "questions": [
     {
      "id": "q200",
      "type": "table",
      "text": "Medication",
      "columns": [
       "Medication",
       "Take for",
       "Prescribed by"
      ],
      "max": 12
     }
    ]
   },
   {
    "id": "l2-supp",
    "title": "Supplements you are currently taking",
    "questions": [
     {
      "id": "q201",
      "type": "table",
      "text": "Supplement",
      "columns": [
       "Supplement",
       "Taken for",
       "Recommended by (if applicable)"
      ],
      "max": 12
     },
     {
      "id": "q202",
      "type": "long",
      "text": "Please list your known allergies (drug/ supplement/ other, type of reaction; severity):",
      "required": true
     },
     {
      "id": "q203",
      "type": "long",
      "text": "Do you have any allergies to heparin, lovenox or other anticoagulant? If yes, what was the reaction."
     }
    ]
   },
   {
    "id": "l2-social",
    "title": "Social and Family History",
    "questions": [
     {
      "id": "q204",
      "type": "long",
      "text": "Who is in your support network?"
     },
     {
      "id": "q205",
      "type": "long",
      "text": "Who lives at home?"
     },
     {
      "id": "q206",
      "type": "long",
      "text": "Do you have any concerning family illnesses in your family?"
     },
     {
      "id": "q207",
      "type": "multi",
      "text": "Have any of your immediate family members had any of these conditions:",
      "options": [
       "High Blood Pressure",
       "Kidney Disease",
       "Mental Illness",
       "Migraines",
       "Heart Disease",
       "Allergies",
       "Cancer",
       "Abnormal Bleeding",
       "Strokes",
       "Arthritis",
       "Anemia",
       "Epilepsy",
       "Obesity",
       "Autoimmune Disease",
       "Diabetes"
      ]
     }
    ]
   },
   {
    "id": "l2-missing",
    "title": "What are we missing?",
    "questions": [
     {
      "id": "q208",
      "type": "long",
      "text": "Is there anything that you think we should know, that we have not already addressed?"
     },
     {
      "id": "q209",
      "type": "signature",
      "text": "By typing my name below as my digital signature, I attest that all of the above information is correct to the best of my knowledge. (Parent or guardian signature if the patient is under the age of 18.)",
      "required": true
     }
    ]
   }
  ],
  "program": "Health optimization (L2/L3)"
 },
 {
  "id": "l2l3-fu",
  "title": "Health Optimization · L2/L3 Follow-Up Patient",
  "short": "Health Optimization · Follow-Up",
  "source": "sheet \"L2L3 FU Patient\"",
  "sections": [
   {
    "id": "fu-demo",
    "title": "Demographics & Insurance Information",
    "questions": [
     {
      "id": "q210",
      "type": "confirm",
      "text": "Please confirm the following information is still correct:",
      "help": "Previous answers are shown for review."
     },
     {
      "id": "q1",
      "type": "short",
      "text": "First Name (legal)",
      "required": true
     },
     {
      "id": "q2",
      "type": "short",
      "text": "Last Name (legal)",
      "required": true
     },
     {
      "id": "q3",
      "type": "date",
      "text": "Date of Birth",
      "required": true
     },
     {
      "id": "q4",
      "type": "single",
      "text": "Sex",
      "options": [
       "male",
       "female",
       "other"
      ],
      "required": true
     },
     {
      "id": "q5",
      "type": "number",
      "text": "Age"
     },
     {
      "id": "q6",
      "type": "short",
      "text": "Email",
      "required": true
     },
     {
      "id": "q7",
      "type": "short",
      "text": "Street Address"
     },
     {
      "id": "q8",
      "type": "short",
      "text": "City"
     },
     {
      "id": "q9",
      "type": "short",
      "text": "State"
     },
     {
      "id": "q10",
      "type": "short",
      "text": "Zip Code"
     },
     {
      "id": "q11",
      "type": "short",
      "text": "Phone (Home)"
     },
     {
      "id": "q12",
      "type": "short",
      "text": "Phone (Cell)",
      "required": true
     },
     {
      "id": "q13",
      "type": "short",
      "text": "Phone (Work)"
     },
     {
      "id": "q14",
      "type": "short",
      "text": "Emergency Contact Name",
      "required": true
     },
     {
      "id": "q15",
      "type": "short",
      "text": "Relationship"
     },
     {
      "id": "q16",
      "type": "short",
      "text": "Emergency contact · Phone (Home)"
     },
     {
      "id": "q17",
      "type": "short",
      "text": "Emergency contact · Phone (Cell)"
     },
     {
      "id": "q18",
      "type": "short",
      "text": "Emergency contact · Phone (Work)"
     },
     {
      "id": "q19",
      "type": "single",
      "text": "How did you hear about us?",
      "options": [
       "Online Search (Which One?)",
       "Helixona Website",
       "Social Media (Which One?)",
       "Doctor Referral (Name?)",
       "Friend/ Family Referral (Name?)",
       "Other"
      ],
      "other": true
     },
     {
      "id": "q20",
      "type": "short",
      "text": "Insurance Carrier"
     },
     {
      "id": "q21",
      "type": "short",
      "text": "Member ID"
     },
     {
      "id": "q22",
      "type": "short",
      "text": "Group ID"
     },
     {
      "id": "q23",
      "type": "short",
      "text": "Preferred Pharmacy · Name"
     },
     {
      "id": "q24",
      "type": "short",
      "text": "Preferred Pharmacy · Phone"
     },
     {
      "id": "q25",
      "type": "short",
      "text": "Preferred Pharmacy · Address"
     }
    ]
   },
   {
    "id": "fu-team",
    "title": "Your Medical Support Team",
    "questions": [
     {
      "id": "q211",
      "type": "yesno",
      "text": "Is this provider still helping you with complex illness currently?",
      "help": "Previous answer shown"
     },
     {
      "id": "q212",
      "type": "short",
      "text": "If no, who is currently helping you with complex illness? · Physician Name"
     },
     {
      "id": "q213",
      "type": "short",
      "text": "Facility Name"
     },
     {
      "id": "q214",
      "type": "short",
      "text": "City"
     },
     {
      "id": "q215",
      "type": "short",
      "text": "Phone"
     },
     {
      "id": "q216",
      "type": "yesno",
      "text": "Is this still your Primary Care Physician (PCP)?",
      "help": "Previous answer shown"
     },
     {
      "id": "q217",
      "type": "multi",
      "text": "Which therapies are you using at Helixona?",
      "options": [
       "EBOO",
       "IVs",
       "Erchonia Lazer",
       "Other"
      ],
      "other": true
     }
    ]
   },
   {
    "id": "fu-review",
    "title": "Current Health Review",
    "questions": [
     {
      "id": "q218",
      "type": "list",
      "text": "Are these still your primary concerns? If no, please list your current primary concerns 1-5.",
      "count": 5,
      "help": "Previous answers shown"
     },
     {
      "id": "q219",
      "type": "treatments",
      "text": "What treatments have you received at Helixona or elsewhere since your last visit?",
      "help": "Please list any treatments, therapies, or interventions you've received recently. These can include new medications, new supplements, IV therapy, physical therapy, alternative therapies, surgeries, or other interventions. (Please list current medication and supplements in subsequent sections only.)",
      "max": 20
     },
     {
      "id": "q220",
      "type": "short",
      "text": "(For females) Are you pregnant or trying to conceive?"
     }
    ]
   },
   {
    "id": "fu-imaging",
    "title": "Imaging and Diagnostics",
    "questions": [
     {
      "id": "q221",
      "type": "long",
      "text": "Please upload or document any recent or pertinent labs:",
      "help": "Note: For EBOO a CBC or Hgb from the last 3 months is helpful."
     },
     {
      "id": "q222",
      "type": "long",
      "text": "Implanted Devices · Do you have new implanted devices like a pacemaker, nerve stimulator, pain pump, insulin pump?"
     }
    ]
   },
   {
    "id": "fu-meds",
    "title": "Prescribed Medication(s) you are currently taking",
    "questions": [
     {
      "id": "q223",
      "type": "table",
      "text": "Medication",
      "columns": [
       "Medication",
       "Take for",
       "Prescribed by"
      ],
      "max": 12,
      "help": "Previous medications are imported for review; add new ones below."
     }
    ]
   },
   {
    "id": "fu-supp",
    "title": "Supplements you are currently taking",
    "questions": [
     {
      "id": "q224",
      "type": "table",
      "text": "Supplement",
      "columns": [
       "Supplement",
       "Taken for",
       "Recommended by (if applicable)"
      ],
      "max": 12,
      "help": "Previous supplements are imported for review."
     },
     {
      "id": "q225",
      "type": "long",
      "text": "Please list your known allergies (drug/ supplement/ other, type of reaction; severity):",
      "help": "Previous allergies are imported for review; add new ones."
     }
    ]
   },
   {
    "id": "fu-social",
    "title": "Social and Family History",
    "questions": [
     {
      "id": "q226",
      "type": "single",
      "text": "How strong is your current support network?",
      "options": [
       "I have all the support I need",
       "Sometimes I don't feel like I have the support I need",
       "I don't ever feel like I have any support that I need"
      ]
     }
    ]
   },
   {
    "id": "fu-missing",
    "title": "What are we missing?",
    "questions": [
     {
      "id": "q227",
      "type": "long",
      "text": "Is there anything that you think we should know, that we have not already addressed?"
     },
     {
      "id": "q228",
      "type": "signature",
      "text": "By typing my name below as my digital signature, I attest that all of the above information is correct to the best of my knowledge. (Parent or guardian signature if the patient is under the age of 18.)",
      "required": true
     }
    ]
   }
  ],
  "program": "Health optimization (L2/L3)"
 }
]
