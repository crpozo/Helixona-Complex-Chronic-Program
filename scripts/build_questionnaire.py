import openpyxl, json, re, sys
wb=openpyxl.load_workbook(sys.argv[1], data_only=True)
def rows(name):
    ws=wb[name]; out={}
    for i,r in enumerate(ws.iter_rows(values_only=True),1):
        cells=[str(c).strip() for c in r if c is not None and str(c).strip()!='']
        if cells: out[i]=cells
    return out

qid=[0]
def q(text, type, **kw):
    qid[0]+=1
    d={'id':f'q{qid[0]}','type':type,'text':text}; d.update(kw); return d
def sec(id,title,questions,intro=None):
    d={'id':id,'title':title,'questions':questions}
    if intro: d['intro']=intro
    return d

YN=['Yes','No']; YNDK=['Yes','No','Do not know']
FREQ=['Never','Often','Frequently','Always']

def matrix(prefix, items, options=FREQ, text=None):
    return q(text or '', 'matrix', options=options, rows=items)

# ---------------- New Patient Packet ----------------
R=rows('New Patient')
NP=[]
NP.append(sec('np-demo','Demographics & Insurance Information',[
  q('First Name (legal)','short',required=True), q('Last Name (legal)','short',required=True), q('Date of Birth','date',required=True),
  q('Sex','single',options=['male','female','other'],required=True), q('Age','number'), q('Email','short',required=True),
  q('Street Address','short'), q('City','short'), q('State','short'), q('Zip Code','short'),
  q('Phone (Home)','short'), q('Phone (Cell)','short',required=True), q('Phone (Work)','short'),
  q('Emergency Contact Name','short',required=True), q('Relationship','short'), q('Emergency contact · Phone (Home)','short'), q('Emergency contact · Phone (Cell)','short'), q('Emergency contact · Phone (Work)','short'),
  q('How did you hear about us?','single',options=['Online Search (Which One?)','Helixona Website','Social Media (Which One?)','Doctor Referral (Name?)','Friend/ Family Referral (Name?)','Other'],other=True),
  q('Insurance Carrier','short'), q('Member ID','short'), q('Group ID','short'),
  q('Preferred Pharmacy · Name','short'), q('Preferred Pharmacy · Phone','short'), q('Preferred Pharmacy · Address','short'),
  q('Do you give permission for Helixona to link your patient account with your SureScripts account at your pharmacy? (SureScripts is an electronic transmission of prescriptions)','yesno'),
]))
NP.append(sec('np-care','Last Healthcare Experience',[
  q('When, where and from whom did you last receive medical or health care? · Physician Name','short'), q('Facility Name','short'), q('City','short'), q('Phone','short'),
  q('Current Primary Care Physician (PCP) · Physician Name','short'), q('PCP · Facility Name','short'), q('PCP · City','short'), q('PCP · Phone','short'),
]))
NP.append(sec('np-story','Your Medical Story',[
  q('What provider/facility last treated you for your complex illness?','long'),
  q('How many and which specialists have you been to in order to address your illness (approx)?','long'),
]))
NP.append(sec('np-review','Current Health Review',[
  q('My primary concerns are:','list',count=5,required=True,help='Primary concerns may be different than your entire health journey. Please use the last section of this packet for the entire journey.'),
  q("Treatments you've received and scale of 1-10 how did it help?",'treatments',help="Please list any treatments, therapies, or interventions you've tried in the past 12-18 months for your health concerns. These can include IV therapy, physical therapy, alternative therapies, surgeries, or other interventions. (Please list current medication and supplements in subsequent sections only.)",max=20),
  q('In the space below, please share your ideas on the root causes of your health concerns. This may include any known triggering events. All insights are welcomed!','long'),
], intro='Please help us understand what brought you here by sharing the primary health concerns you are currently facing. You may list symptoms, diagnosis, or conditions that affect your daily life.'))
NP.append(sec('np-imaging','Imaging and Diagnostics',[
  q("Please list any significant imaging or diagnostic studies you've had, such as MRIs, CT scans, US, mammograms, colonoscopies, bone density tests, Pap smears, etc.",'long',help='Note: You may upload diagnostic results and reports directly to your secure portal.'),
]))
conds=['Kidney Disease','Liver Disease','Lung disease','Bleeding Disorder','Eating Disorder','Autoimmune Disorder','Arthritis','Alcohol Use Disorder','Thyroid Disorder','Diabetes','Other Endocrine Disorders','Heart Valve Disorder','Heart Disease','High Cholesterol','Anemia','Gastrointestinal Disorder','Cancer','Gallbladder Issues','Mental Health Condition','Substance Use Disorder','Lyme Disease','Other Vector Borne Infections','HIV/AIDS','POTS','MCAS','Mold Related Illness','Heavy Metal Related Illness','Hypermobility','Long COVID','None']
NP.append(sec('np-pmh','Past Medical History',[
  q('Please check any conditions you have been diagnosed with (even if no longer active):','multi',options=conds),
  q('Past Surgical History · Please list past surgeries and dates, with any complications:','long'),
  q('Please upload or document any recent or pertinent labs:','long',help='You can also upload lab reports in the Documents step.'),
]))
NP.append(sec('np-meds','Prescribed Medication(s) you are currently taking',[
  q('Medication','table',columns=['Medication','Dosage','Brand Name','Frequency','Take for','Prescribed by'],max=12),
]))
NP.append(sec('np-supp','Supplements you are currently taking',[
  q('Supplement','table',columns=['Supplement','Dosage','Brand Name','Taken for','Recommended by (if applicable)','Where did you purchase from?'],max=12),
  q('Please list your known allergies (drug/ supplement/ other, type of reaction; severity):','long',required=True),
]))
NP.append(sec('np-social','Social and Family History',[
  q('Highest Level Education','short'), q('Tell us a little about your occupation','long'),
  q('Marital Status','single',options=['Single','Married','Divorced','Separated','Domestic Partnership',"It's Complicated"]),
  q('Living arrangements: (house, apartment, who do you live with?)','long'),
  q('Number of Children','number'), q('Number of Pregnancies','number'), q("Children's Ages",'short'), q("Children's Genders",'short'), q("Children's Health",'long'),
  q('Have you had any struggle with fertility?','yesno'),
  q('Father · Age','short'), q('Father · If deceased, age and cause','short'),
  q('Mother · Age','short'), q('Mother · If deceased, age and cause','short'),
  q('Siblings · Age','short'), q('Siblings · Health concerns','short'),
  q('Do you have any concerning family illnesses in your family tree?','long'),
  q('Have any of your immediate family members had any of these conditions:','multi',options=['High Blood Pressure','Kidney Disease','Mental Illness','Migraines','Heart Disease','Allergies','Cancer','Abnormal Bleeding','Strokes','Arthritis','Anemia','Epilepsy','Obesity','Autoimmune Disease','Diabetes']),
]))
NP.append(sec('np-lifestyle','Lifestyle & Digestive Health',[
  q('Gluten-Free (%)','number',min=0,max=100), q('Dairy-Free (%)','number',min=0,max=100), q('Sugar-Free (%)','number',min=0,max=100),
  # Added by Dr. D. in the Oct 20, 2026 review (not in the spreadsheet): more diet styles patients follow.
  q('Low FODMAP (%)','number',min=0,max=100), q('Low histamine (%)','number',min=0,max=100), q('Mediterranean / anti-inflammatory (%)','number',min=0,max=100), q('Kidney-friendly (CKD) (%)','number',min=0,max=100), q('Acid reflux / GERD-friendly (%)','number',min=0,max=100), q('Low carb (%)','number',min=0,max=100),
  q('On average, how many alcoholic drinks do you consume per week?','number'),
  q('On average, how many caffeinated drinks do you consume per week?','number'),
  q('Do you smoke now or have you smoked in the past? If so, substance, frequency and duration of use, and quit date if applicable:','long'),
  q('Do you experience specific food cravings? If so, please describe:','long'),
  q('What do you think are your worst food habits?','long'), q('What are your healthiest food habits?','long'),
  q('For relaxation or fun, I enjoy:','long'),
  q('How many times do you work out per week?','number'), q('What type of exercise?','short'),
  q('If female: Date of last menstrual cycle','date'),
  q('Cycle Characteristics','single',options=['Light','Normal','Heavy','Irregular','Menopausal']),
  q('How has your illness affected your day to day life?','long'),
  q('Rate your current stress level on a scale of 1-10 during your average week?','scale',min=1,max=10,minLabel='1 (being the lowest)',maxLabel='10 (being the Highest)'),
], intro='Estimate the proportion of your diet that follows the guidelines below:'))
NP.append(sec('np-bowel','Bowel Health',[
  q('Average number of bowel movements per day','number'),
  q('Typical consistency','single',options=['Liquid','Loose','Soft','Formed','Hard']),
  q('Do you experience bloating, constipation, or urgency?','long'),
]))
NP.append(sec('np-sleep','Sleep & Rest',[
  q('Average hours of sleep per night','number'), q('Do you snore?','yesno'), q('Do you wake up feeling rested?','yesno'),
]))
NP.append(sec('np-military','Military Service',[
  q('Did you or either of your parents serve the military?','yesno'),
  q('If yes, who served:','short',showIfPrev='Yes'),
  q('Active Combat/ Deployed?','yesno'),
  q('If a parent, was it before or after your conception?','single',options=['Before Conception','After Conception',"I Dont Know",'Not Applicable']),
]))
NP.append(sec('np-env','Local Environment',[
  q('What country did you grow up in?','short'), q('If not the USA, what age did you come to the US?','short'),
  q('Have you spend extended time living outside of the US? Is so, how long and where?','long'),
  q('Have you ever been concerned that the area you grew up in had environmental toxicity?','long'),
  q('Have you experienced a significant illness, accident or hospitalization while living outside of the US?','long'),
]))
CH=['Very safe and comfortable','Mostly safe and comfortable','Sometimes unsafe and uncomfortable','Prefer not to say']
NP.append(sec('np-childhood','General Well-Being in Childhood',[
  q('Looking back, how would you describe your overall sense of safety and comfort during your childhood years (up to age 18)?','single',options=CH),
  q('Early Life Stressors · Have there been any challenging or difficult experiences in your childhood (before age 18) that you feel might still affect you today? This could include things like family changes, moving a lot, or other rough times.','single',options=CH),
  q('Impact on Current Health · Do you think any experiences from your childhood might influencing your current health challenges? For example, stress or difficult times that still come to mind.','single',options=CH),
  q('Support During Childhood · When you were growing up, how supported did you feel by the people around you, like family or caregivers?','single',options=CH),
]))
NP.append(sec('np-missing','What are we missing?',[
  q('Is there anything that you think we should know, that we have not already addresses?','long'),
  q('Chronological Timeline of Health Journey: Please list in order major health events, signs and symptoms from your childhood to present.','long',required=True),
  q('By typing my name below as my digital signature, I attest that all of the above information is correct to the best of my knowledge. (Parent or guardian signature if the patient is under the age of 18.)','signature',required=True),
]))

# ---------------- SF-36 ----------------
LIM=['Yes, Limited a Lot','Yes, Limited a Little','No, Not Limited at all']
TIME=['All of the time','Most of the time','A good bit of the time','Some of the time','A little bit of the time','None of the time']
TF=['Definitely True','Mostly True',"Don't Know",'Mostly False','Definitely False']
SF=[
 sec('sf-general','General Health',[
  q('In General, would you say your health is:','single',options=['Excellent','Very Good','Good','Fair','Poor'],required=True),
  q('Compared to one year ago, how would you rate your general health now?','single',options=['Much better now than one year ago','Somewhat better now than one year ago','About the same','Somewhat worse than one year ago','Much worse than one year ago'],required=True)]),
 sec('sf-limit','Limitation of Activities',[matrix('sf',['Vigorous activities, such as running, lifting heavy objects, participating in strenuous sports','Moderate activities, such as moving a table, pushing a vacuum cleaner, bowling, or playing golf','Lifting or carrying groceries','Climbing several flights of stairs','Climbing one flight of stairs','Bending, kneeling, or stooping','Walking more than a mile','Walking several blocks','Walking one block','Bathing or dressing yourself'],LIM,'Does your health now limit you in these activities? If so, how much?')],intro='The following items are about activities you might do during a typical day.'),
 sec('sf-physical','Physical Health Problems',[matrix('sf',['Cut down the amount of time you spent on work or other activities','Accomplished less than you would like','Were limited in the kind of work or other activities','Had difficulty performing the work or other activities (for example, it took extra effort)'],YN,'During the past 4 weeks, have you had any of the following problems with your work or other regular daily activities as a result of your physical health?')]),
 sec('sf-emotional','Emotional Health Problems',[matrix('sf',['Cut down the amount of time you spent on work or other activities','Accomplished less than you would like',"Didn't do work or other activities as carefully as usual"],YN,'During the past 4 weeks, have you had any of the following problems with your work or other regular daily activities as a result of any emotional problems (such as feeling depressed or anxious)?')]),
 sec('sf-social','Social Activities',[q('Emotional problems interfered with your normal social activities with family, friends, neighbors or groups?','single',options=['Not at all','Slightly','Moderately','Severely','Very Severe'])]),
 sec('sf-pain','Pain',[q('How much bodily pain have you had during the past 4 weeks?','single',options=['None','Very Mild','Mild','Moderate','Severe','Very Severe']),q('During the past 4 weeks, how much did pain interfere with your normal work (including both work outside the home and housework)?','single',options=['Not at all','Slightly','Moderately','Severe','Very Severe'])]),
 sec('sf-energy','Energy and Emotions',[matrix('sf',['Did you feel full of pep?','Have you been a very nervous person?','Have you felt so down in the dumps that nothing could cheer you up?','Have you felt calm and peaceful?','Did you have a lot of energy?','Have you felt downhearted and blue?','Did you feel worn out?','Have you been a happy person?','Did you feel tired?'],TIME,'These questions are about how you feel and how things have been with you during the last 4 weeks. For each question, please give the answer that comes closest to the way you have been feeling.')]),
 sec('sf-social2','Social Activities (past 4 weeks)',[q('During the past 4 weeks, how much of the time has your physical health or emotional problems interfered with your social activities (like visiting with friends, relatives, etc.)?','single',options=TIME)]),
 sec('sf-general2','General Health Statements',[matrix('sf',['I seem to get sick a little easier than other people','I am as healthy as anybody I know','I expect my health to get worse','My health is excellent'],TF,'How true or false is each of the following statements for you?')]),
]

# ---------------- Mold ----------------
MOLD=[sec('mold-1','Mold History Questionnaire',[
  q('Regardless of whether you live in a freestanding home, apartment building, or condominium, what year was it built?','number'),
  q('Does your residence smell musty?','yesno'), q('How about mold, is mold visible anywhere inside your residence?','yesno'),
  q('Does you home, apartment, or condominium have a crawlspace or basement?','yesno'),
  q('If yes, is crawlspace or basement damp or does it smell musty?','yesno'),
  q('If the building has a crawlspace, is it covered with vapor barrier?','single',options=YNDK), q('If there is a vapor barrier, is it intact?','single',options=YNDK),
  q('If there is a vapor barrier, is it taped together and brought up the sidewalls of the foundation?','single',options=YNDK),
  q('If your house, apartment, or condominium includes a basement:','yesno'), q('Is the basement finished?','yesno'), q('Is there carpet?','yesno'), q('Is water pooling?','yesno'),
  q('Is there any standing water inside or around the outside of your house, apartment, or condominium?','yesno'),
  q('Does the area your house, apartment, or condominium slope down toward your residence or away from it?','single',options=['Toward','Away','N/A']),
  q('If your house, apartment, or condominium has downspouts, are they connected to gutters?','yesno'),
  q('If your house, apartment, or condominium has gutters, do they overflow during heavy downpours?','single',options=YNDK),
  q("Do any of the windows in your house, apartment, or condominium leak (i.e., allow water to enter the residence when it's raining)?",'single',options=YNDK),
  q('Does the roof of your house, apartment, or condominium have any leaks?','single',options=YNDK),
  q('If you know what the humidity is inside your house, apartment, or condominium, please note it here:','short'),
  q('Do any of the windows in your house, apartment, or condominium collect condensation?','yesno'),
  q('What percentage of your living space is covered by carpet?','number',min=0,max=100), q('How old is the carpeting in the residence?','short'),
  q('Are water stains present on any of the ceilings, flooring, or walls in your house, apartment, or condominium?','yesno'),
  q('Does the flooring sag in any of the rooms of your house, apartment, or condominium?','yesno'),
  q('Do you have a dryer inside your house, apartment, or condominium, does it vent to the outdoors?','yesno'),
  q('If your bathrooms have vents, do they vent to the outside of the residence and not into the insulation in the attic or other spaces?','yesno'),
  q('Are others in your house, apartment, or condominium frequently sick?','yesno'),
  q('Not including where you live now, have you ever lived in a house, apartment, or condominium had confirmed or suspected issues related to mold or water damage?','yesno'),
  q("If your home, apartment, or condominium has standalone air conditioning units or mini splits (heating and cooling systems that allow you to control the temperatures in individual rooms or spaces), please shine a light into the unit(s) without disassembling them and describe what's inside with respect to mold, accumulating dust, etc.",'long'),
  q('Finally, using the space below, please tell us anything else you may feel may help us understand your exposure to mold. For example, if you spend time in an office, school, restaurant, or other environment where you suspect mold is present, please tell us about that below in as much detail as possible:','long'),
], intro="Indoor dampness and mold (fungal growth) are common problems in California and around the world. In fact, studies reveal most residential and commercial buildings in the U.S. have experienced water damage, while many currently are water damaged. When a building has suffered water damage, the likelihood of mold is significantly increased, and if there's mold in your home, you may have mold-related illness. By answering the following questions, you'll help us understand what your mold-related exposure may be. Please answer each question as best as you can. At the end, feel free to share any additional details we may not have asked about below.")]

# ---------------- Metabolic ----------------
M=rows('Metabolic')
cats=[]; cur=None
for i in sorted(M):
    c=M[i]; t=c[0]
    if t.startswith('Category'):
        cur={'title':t,'items':[]}; cats.append(cur)
    elif cur and len(c)>=5 and c[1]=='Never': cur['items'].append(t)
    elif cur and t.startswith('Heartburn due to'): cur['items'].append(t)
META=[sec('met-1','Part I',[
  q('Rate your stress level on a scale of low to high during the average week? (low being the least, high being the most)','scale',min=1,max=10,minLabel='Low',maxLabel='High'),
  q('How many alcoholic beverages do you consume per week?','number'), q('How many times do you work out per week?','number'),
  q('How many times do you eat out per week?','number'), q('How many times do you eat fast food per week?','number'), q('How many times do you eat raw nuts or seeds per week?','number'),
  q('List the three worst foods you eat during the average week:','list',count=3), q('List the three healthiest foods you eat during the average week:','list',count=3),
  q('Using the table below, please tell us about any medications you currently take.','table',columns=['Medication','Dosage','Brand Name','Frequency','Taken For'],max=10),
  q('Using the table below, please tell us about any supplements you currently take.','table',columns=['Supplement','Dosage','Brand Name','Frequency','Taken For'],max=10),
], intro='Instructions: The purpose of this questionnaire is to identify difficulties you may be experiencing. Please, answer every question, do not skip any questions.')]
for k,c in enumerate(cats):
    META.append(sec(f'met-c{k}',c['title'],[matrix('met',c['items'],FREQ,'Please indicate the appropriate selection on the questions below.')],intro=('Part II - Instructions: The purpose of this questionnaire is to identify difficulties you may be experiencing. Please answer every questions, do not skip any questions. Follow the key, select, which best fits for all of your answers. Totals per category are calculated automatically.' if k==0 else None)))

# ---------------- Lyme ----------------
L=rows('Lyme'); lyme_items=[re.sub(r'^\d+\.\s*','',L[i][0]) for i in sorted(L) if re.match(r'^\d+\.',L[i][0])]
LYME=[sec('lyme-1','Lyme Disease Questionnaire',[
  matrix('lyme',lyme_items,['Not at all','A little bit','Somewhat','Quite a bit','Very much'],'Symptoms: During the past 2 weeks, how much have you been bothered by any of the following?'),
  q('Over the last 2 week, have any of the above questions impaired your work, social or family function?','long'),
], intro='Instructions: Please rate the following symptoms from "0" to "4" ("0" = Not at all, "4" = Very much level of symptoms). Rate these as true as possible. Do not over exaggerate. Do not underestimate. Please do not over think.')]

# ---------------- Brain ----------------
B=rows('Brain')
BRAIN=[sec('brain-1','Autonomic Increased Sympathetic Activity',[
  matrix('brain',['Easily startled','Difficulty relaxing','Sensitive to bright or flashing lights','Episodes of racing heart','Difficulty sleeping'],FREQ,'Brain Region Localization Form'),
  q('Have you ever been diagnosed with a seizure disorder?','yesno'),
]),
 sec('brain-2','Epileptiform Activity',[matrix('brain',[B[i][0] for i in sorted(B) if i>=14 and len(B[i])>=3 and B[i][1]=='YES'],YN,'Please answer yes or no.')])]

# ---------------- L2/L3 (Health optimization) ----------------
condsL=['Kidney Disease','Liver Disease','Lung disease','Bleeding Disorder','Eating Disorder','Autoimmune Disorder','Arthritis','Alcohol Use Disorder','Thyroid Disorder','Diabetes','Other Endocrine Disorders','Heart Valve Disorder','Heart Disease','High Cholesterol','Anemia','Gastrointestinal Disorder','Cancer','Gallbladder Issues','Mental Health Condition','Substance Use Disorder','Lyme Disease','Other Vector Borne Infections','HIV/AIDS','MCAS','Mold Related Illness','Heavy Metal Related Illness','Hypermobility','POTS','Long COVID','Other (please specify)']
L2=[
 NP[0],
 sec('l2-team','Your Medical Support Team',[
  q('Who is helping you with complex illness currently? · Physician Name','short'), q('Facility Name','short'), q('City','short'), q('Phone','short'),
  q('How long have you been working with them?','short'), q('Did they refer you to Helixona for therapies?','yesno'),
  q('If yes, which therapy? (IVs, EBOO, Erchonia Lazer, Other)','short'),
  q('Who is your current Primary Care Physician (PCP): · Physician Name','short',help='Option: same as previous answer'), q('PCP · Facility Name','short'), q('PCP · City','short'), q('PCP · Phone','short'),
 ]),
 sec('l2-review','Current Health Review',[
  q('My primary concerns are:','list',count=5,required=True,help='Primary concerns may be different than your entire health journey. This space is to help us focus on the biggest concerns for your right now.'),
  q("Treatments you've received and scale of 1-10 how did it help?",'treatments',help="Please list any treatments, therapies, or interventions you've tried in the past 12-18 months for your health concerns. These can include medications, supplements, IV therapy, physical therapy, alternative therapies, surgeries, or other interventions. (Please list current medication and supplements in subsequent sections only.)",max=20),
  q('(For females) Are you pregnant or trying to conceive?','short'),
  q('In the space below, please share your ideas on the root causes of your health concerns. This may include any known triggering events. All insights are welcomed!','long'),
 ], intro='Please help us understand what brought you here by sharing the primary health concerns you are currently facing. You may list symptoms, diagnosis, or conditions that affect your daily life.'),
 sec('l2-imaging','Imaging and Diagnostics',[
  q('Have you had a G6PD blood test?','yesno',help='Note: You may upload diagnostic results and reports directly to your secure portal.'),
  q('Please upload or document any recent or pertinent labs:','long',help='Note: For EBOO a CBC or Hgb from the last 3 months is helpful.'),
 ]),
 sec('l2-pmh','Past Medical History',[
  q('Please check any conditions you have been diagnosed with (even if no longer active):','multi',options=condsL,other=True),
  q('Past Surgical History · Please list past surgeries and dates, with any complications:','long'),
  q('Implanted Devices · Do you have any implanted devices like a pacemaker, nerve stimulator, pain pump, insulin pump?','long'),
  q('1. Has a doctor helped you find the root cause of your concern? If yes, what is the root cause.','long'),
  q('2. What testing was done to find the root cause?','long'),
  q('3. What treatments, medications, supplements have you tried in the past for the root cause?','long'),
  q('4. What are you currently taking to help with the symptoms or cause of your concern?','long'),
  q('5. What other treatments are you doing right now for this concern?','long'),
 ]),
 sec('l2-meds','Prescribed Medication(s) you are currently taking',[q('Medication','table',columns=['Medication','Take for','Prescribed by'],max=12)]),
 sec('l2-supp','Supplements you are currently taking',[
  q('Supplement','table',columns=['Supplement','Taken for','Recommended by (if applicable)'],max=12),
  q('Please list your known allergies (drug/ supplement/ other, type of reaction; severity):','long',required=True),
  q('Do you have any allergies to heparin, lovenox or other anticoagulant? If yes, what was the reaction.','long'),
 ]),
 sec('l2-social','Social and Family History',[
  q('Who is in your support network?','long'), q('Who lives at home?','long'),
  q('Do you have any concerning family illnesses in your family?','long'),
  q('Have any of your immediate family members had any of these conditions:','multi',options=['High Blood Pressure','Kidney Disease','Mental Illness','Migraines','Heart Disease','Allergies','Cancer','Abnormal Bleeding','Strokes','Arthritis','Anemia','Epilepsy','Obesity','Autoimmune Disease','Diabetes']),
 ]),
 sec('l2-missing','What are we missing?',[
  q('Is there anything that you think we should know, that we have not already addressed?','long'),
  q('By typing my name below as my digital signature, I attest that all of the above information is correct to the best of my knowledge. (Parent or guardian signature if the patient is under the age of 18.)','signature',required=True),
 ]),
]
FU=[
 sec('fu-demo','Demographics & Insurance Information',[q('Please confirm the following information is still correct:','confirm',help='Previous answers are shown for review.')]+NP[0]['questions'][:-1]),
 sec('fu-team','Your Medical Support Team',[
  q('Is this provider still helping you with complex illness currently?','yesno',help='Previous answer shown'),
  q('If no, who is currently helping you with complex illness? · Physician Name','short'), q('Facility Name','short'), q('City','short'), q('Phone','short'),
  q('Is this still your Primary Care Physician (PCP)?','yesno',help='Previous answer shown'),
  q('Which therapies are you using at Helixona?','multi',options=['EBOO','IVs','Erchonia Lazer','Other'],other=True),
 ]),
 sec('fu-review','Current Health Review',[
  q('Are these still your primary concerns? If no, please list your current primary concerns 1-5.','list',count=5,help='Previous answers shown'),
  q('What treatments have you received at Helixona or elsewhere since your last visit?','treatments',help="Please list any treatments, therapies, or interventions you've received recently. These can include new medications, new supplements, IV therapy, physical therapy, alternative therapies, surgeries, or other interventions. (Please list current medication and supplements in subsequent sections only.)",max=20),
  q('(For females) Are you pregnant or trying to conceive?','short'),
 ]),
 sec('fu-imaging','Imaging and Diagnostics',[q('Please upload or document any recent or pertinent labs:','long',help='Note: For EBOO a CBC or Hgb from the last 3 months is helpful.'),q('Implanted Devices · Do you have new implanted devices like a pacemaker, nerve stimulator, pain pump, insulin pump?','long')]),
 sec('fu-meds','Prescribed Medication(s) you are currently taking',[q('Medication','table',columns=['Medication','Take for','Prescribed by'],max=12,help='Previous medications are imported for review; add new ones below.')]),
 sec('fu-supp','Supplements you are currently taking',[q('Supplement','table',columns=['Supplement','Taken for','Recommended by (if applicable)'],max=12,help='Previous supplements are imported for review.'),q('Please list your known allergies (drug/ supplement/ other, type of reaction; severity):','long',help='Previous allergies are imported for review; add new ones.')]),
 sec('fu-social','Social and Family History',[q('How strong is your current support network?','single',options=['I have all the support I need',"Sometimes I don't feel like I have the support I need","I don't ever feel like I have any support that I need"])]),
 sec('fu-missing','What are we missing?',[q('Is there anything that you think we should know, that we have not already addressed?','long'),q('By typing my name below as my digital signature, I attest that all of the above information is correct to the best of my knowledge. (Parent or guardian signature if the patient is under the age of 18.)','signature',required=True)]),
]

forms=[
 {'id':'new-patient','title':'New Patient Packet','short':'New Patient Packet','source':'NP - Questionnaires 2.xlsx · sheet "New Patient"','sections':NP,'program':'Complex Chronic'},
 {'id':'sf36','title':'SF-36 Questionnaire (Quality of Life)','short':'SF-36 · Quality of Life','source':'sheet "SF-36"','sections':SF,'program':'Complex Chronic'},
 {'id':'mold','title':'Mold History Questionnaire','short':'Mold History','source':'sheet "Mold"','sections':MOLD,'program':'Complex Chronic · condition-specific'},
 {'id':'metabolic','title':'Metabolic Assessment Form','short':'Metabolic Assessment','source':'sheet "Metabolic"','sections':META,'program':'Complex Chronic · condition-specific'},
 {'id':'lyme','title':'Lyme Disease Questionnaire','short':'Lyme Disease','source':'sheet "Lyme"','sections':LYME,'program':'Complex Chronic · condition-specific'},
 {'id':'brain','title':'Brain Region Localization Form','short':'Brain Region Localization','source':'sheet "Brain"','sections':BRAIN,'program':'Complex Chronic · condition-specific'},
 {'id':'l2l3-new','title':'Health Optimization · L2/L3 New Patient','short':'Health Optimization · New Patient','source':'sheet "L2L3 New Patient"','sections':L2,'program':'Health optimization (L2/L3)'},
 {'id':'l2l3-fu','title':'Health Optimization · L2/L3 Follow-Up Patient','short':'Health Optimization · Follow-Up','source':'sheet "L2L3 FU Patient"','sections':FU,'program':'Health optimization (L2/L3)'},
]
# unique ids across shared sections
seen=set()
for f in forms:
    for s in f['sections']:
        for qq in s['questions']:
            if qq['id'] in seen:
                qid[0]+=1; qq=dict(qq); qq['id']=f'q{qid[0]}'
            seen.add(qq['id'])
out='// GENERATED from NP - Questionnaires 2.xlsx (Medical Director). Wording, order, choices and sections are kept exactly as supplied.\n// Do not edit by hand; regenerate with scripts/build_questionnaire.py.\n'
out+="export type QType = 'short' | 'long' | 'single' | 'multi' | 'yesno' | 'date' | 'number' | 'scale' | 'list' | 'table' | 'treatments' | 'matrix' | 'signature' | 'confirm'\n"
out+="export interface Q { id: string; type: QType; text: string; help?: string; required?: boolean; options?: string[]; other?: boolean; rows?: string[]; columns?: string[]; count?: number; max?: number; min?: number; minLabel?: string; maxLabel?: string; showIfPrev?: string }\n"
out+="export interface Sec { id: string; title: string; intro?: string; questions: Q[] }\n"
out+="export interface Form { id: string; title: string; short: string; source: string; program: string; sections: Sec[] }\n"
out+='export const forms: Form[] = '+json.dumps(forms, ensure_ascii=False, indent=1)+'\n'
open(sys.argv[2],'w').write(out)
print('forms', [(f['id'], len(f['sections']), sum(len(s['questions'])+ (sum(len(q.get('rows',[])) for q in s['questions'])) for s in f['sections'])) for f in forms])
