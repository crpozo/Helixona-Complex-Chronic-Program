# Helixona HCOS — Flare Reporting Conversation

**Exported:** November 17, 2026  
**Format:** Markdown transcript (reconstructed from the conversation displayed in this chat)

> **Note:** The original conversation included three screenshots of the HCOS interface and interactive sample controls in some assistant responses. Their contents and controls are represented in Markdown below. Interactive controls cannot function in a `.md` file. This transcript preserves the discussion and recommendations, with visual elements converted to text.

---

## User — Initial question

We're working on language for the HCOS and for the patients when they're documenting a flare. We're trying to find language for, so like when I'm in a mast cell flare and I go up the stairs, I just, I have trouble going up the stairs. You know, I'm out of breath by the time I reach the top. But on a regular day when I'm not inflamed like that, I could just run up the stairs, no problem. So how would we describe that? Because one of the things is we're putting an alert on there: if you have chest pain with shortness of breath, you have to call 911. We don't even let them document that as a flare. So how would we document that so it's clear? It's just kind of shortness of breath with exertion, but something— what's a better way of saying that, but still directing them if they have shortness of breath with chest pain to call 911?

## Assistant — Suggested language for exertional breathlessness

I think the distinction you're trying to capture is **a temporary reduction in someone's ability to tolerate physical activity during a flare**, compared with what they can normally do.

The clinical term is *dyspnea on exertion*, but I wouldn't use that language in the patient-facing HCOS.

My recommendation is:

**"Getting winded more easily with activity"**

It's natural, easy to understand, and accurately describes what you're experiencing when climbing stairs during a mast cell flare.

The key is separating the symptom from the emergency warning.

### Recommended HCOS language

**FLARE SYMPTOM — Getting winded more easily with activity**

Feeling unusually out of breath during activities you can normally do comfortably, such as climbing stairs, walking, or doing household tasks.

**How much is this affecting you?**

- **Mild:** I get winded with more activity than usual.
- **Moderate:** Normal activities, like climbing stairs, leave me winded.
- **Severe:** Even small activities, like walking across a room, leave me winded.

**Important safety information:** If you have shortness of breath with chest pain, severe difficulty breathing, fainting, or swelling of your tongue or throat, **call 911 immediately.** Do not use the flare tracker for a medical emergency.

### One important clinical consideration

I would not make chest pain the *only* reason HCOS redirects someone to emergency care. Severe or sudden breathing difficulty can be an emergency even without chest pain. This is especially important for your MCAS population, where breathing symptoms can sometimes be part of anaphylaxis.

I would also avoid automatically treating every new episode of shortness of breath as a routine flare.

For the underlying HCOS logic, I'd recommend:

| Patient experience | HCOS response |
|---|---|
| Familiar, mild exertional breathlessness during a flare | Allow documentation |
| Noticeably worse than usual, new, or occurring with less activity | Prompt clinical contact or same-day evaluation |
| Sudden or severe difficulty breathing, chest pain, fainting, or signs of anaphylaxis | Stop flare entry and direct patient to call 911 |

Your medical director should approve the precise triage rules before implementation.

### One additional question worth capturing

Since HCOS is intended to recognize patterns over time, I'd add:

**"Compared with your usual health, how much activity can you do before becoming winded?"**

Possible responses:

- About the same as usual
- Slightly less than usual
- Much less than usual
- I become winded even while resting

The last response should initiate an immediate safety assessment rather than ordinary symptom scoring.

This captures something a simple 1–10 symptom scale misses: **the patient's changing functional capacity.**

In your example, the significant finding isn't simply that you experienced shortness of breath. It's that an activity you normally perform effortlessly became difficult during a flare.

That difference can be tremendously useful in tracking recovery, identifying worsening symptoms, and helping your physicians understand how inflammation is affecting the patient's daily life.

For the actual symptom label, I would keep **"Getting winded more easily with activity"** and store the clinical term **"Exertional dyspnea"** behind the scenes for physician documentation and analytics.

---

## User — Current HCOS screens and request for adaptive flow

The user shared three screenshots of the current HCOS "Report a crash or flare" screens and asked:

> These are the current questions and the way that we phrased them. Can you help us? I think what we may need to do is based on what they select, they should then have follow-up questions so we can understand how severe it is. Can you help create that flow of how this would be the most accurate in collecting the data and allow us to be able to do retrospective studies on the data based on how the patients perform over time, along with having a safety for the patients so that if they are in some sort of medical emergency, we direct them straight to 911 and, you know, make sure that they're safe, that we are able to discern between a normal flare and a potential emergency. And can you help structure the questions so that we can achieve those goals?

### Screenshots shown in chat — transcribed

**Screenshot 1 — Report a crash or flare**

- A notice that submissions are not continuously monitored: "Your care team reviews submissions during clinic hours. This is not a substitute for 911 or emergency care. If you think you are having an emergency, call 911 now."
- "How severe are your symptoms?" with 0–10 scale (0 = Mild, 10 = Worst ever), example score 9.
- "What symptoms are you experiencing?" with options: Extreme fatigue, Pain flare, Headache / migraine, Dizziness, Heart racing, Nausea, Brain fog, Fever or chills, Rash, Fainting, Other.

**Screenshot 2 — Symptom checklist and onset**

- Same checklist displayed across the upper part of screen.
- "When did the crash or flare begin?"
- Options: In the last few hours; Yesterday; 2–3 days ago; More than 3 days ago.

**Screenshot 3 — Support and submission**

- "How can we support you?"
- "Just document this flare (tracking my symptoms and patterns over time)"
- "I'd like someone to contact me"
- "SEND REPORT"
- Flare reports are reviewed during office hours (Mon–Fri 8 AM–5 PM); responses are not immediate. If the patient needs to speak with someone, call the office.
- Red warning: "If you feel shortness of breath or chest pain, call 911."

## Assistant — HCOS adaptive flare reporting proposal

# HELIXONA HCOS

## Flare Reporting: Patient Safety, Symptom Tracking & Clinical Intelligence

After reviewing your three screens, I think you have a very good starting point. The interface is clean, the questions are approachable, and the process doesn't feel overwhelming.

What I'd change is the **intelligence behind the questions**, rather than making the initial questionnaire significantly longer.

For Helixona's patient population—particularly MCAS, POTS, Lyme, mold-related illness, hEDS, and other complex chronic conditions—we need to recognize that a symptom can have very different meanings depending on the patient, its intensity, how suddenly it appeared, and how much it differs from their normal condition.

A heart rate of 120, for example, might be familiar to someone with POTS. For another patient, it could represent a significant new change.

Similarly, being winded while climbing stairs during a familiar flare is very different from suddenly struggling to breathe while sitting still.

**The goal should be to identify what's happening, how it's affecting the patient, how it compares with their baseline, and whether medical attention is needed.**

I would design this as three connected systems:

1. **Safety Screening** — Recognize emergency warning signs before the patient completes a flare report.
2. **Adaptive Flare Documentation** — Ask only the follow-up questions relevant to the symptoms the patient selects.
3. **Longitudinal Clinical Intelligence** — Capture consistent data to identify changes, treatment responses, flare patterns, and recovery over time.

There is one important design principle I would establish from the beginning:

**Safety screening and research data collection must be separate, but connected.**

If a patient encounters an emergency warning, HCOS should interrupt routine documentation and direct them to appropriate care. However, the system should still preserve the information already entered, along with the safety outcome, rather than losing potentially valuable clinical data.

It should never delay emergency instructions to collect more information.

### 1. Redesign the first screen: Safety comes before symptom severity

Your current screen begins with a general warning about emergencies, followed by a 0–10 severity slider.

I would change the sequence.

#### Screen 1 — Emergency safety check

**REPORT A CRASH OR FLARE — Step 1**

**First, let's make sure you're safe.**

Before recording your symptoms, please tell us if you're experiencing any of the following **right now**.

- [ ] Chest pain, pressure, or tightness
- [ ] Severe or sudden trouble breathing
- [ ] Swelling of my tongue or throat, or trouble swallowing or breathing
- [ ] Fainting, severe confusion, or feeling like I may pass out with other serious symptoms
- [ ] Sudden trouble speaking, facial drooping, or weakness on one side of my body
- [ ] I'm not sure if my symptoms are an emergency.

**If any emergency warning is selected:**

> **Seek emergency help now.** These symptoms may be signs of a medical emergency. Call 911 now. Do not wait for a response from Helixona or continue the flare report.

**If the patient is unsure:**

> If you may be having an emergency, call 911. This form cannot determine whether it is safe to wait.

**If none apply:** "None of these apply — Continue."

*Illustrative screen. Clinical wording and routing require Medical Director approval.*

I would also include a direct emergency action for suspected anaphylaxis: use prescribed epinephrine promptly according to the patient's emergency action plan and call 911. Anaphylaxis can involve more than one body system and does not require chest pain or even a visible rash.

For patients who report being unsure, I would provide clear emergency guidance rather than asking an automated system to make a diagnosis.

**Why this is important**

Your current footer says:

*If you feel shortness of breath or chest pain, call 911.*

That is appropriately cautious, but it does not distinguish your familiar exertional breathlessness example from acute respiratory distress.

The new design accomplishes two things: it places emergency recognition where patients will actually see it, and it allows additional questions to establish the context of symptoms that are not immediately emergencies.

Chest discomfort and breathing difficulty can each be warning signs of a heart attack, even when they do not occur together.

A screen like this should be considered a safety checkpoint, **not a medical clearance**. Passing it does not prove that subsequent symptoms are safe.

### 2. Keep the symptom checklist, but improve the options

Your current checklist is good because it is short and familiar. I would retain that structure, but expand a few categories so patients don't have to put common symptoms under "Other."

#### Proposed symptom selection

**What symptoms are you experiencing?**

Select all that apply. We'll ask a few additional questions based on your answers.

**Energy & Thinking**
- [ ] Extreme fatigue
- [ ] Brain fog
- [ ] Headache / migraine
- [ ] Difficulty sleeping

**Heart & Breathing**
- [ ] Heart racing / palpitations
- [ ] Getting winded more easily with activity
- [ ] Dizziness / lightheadedness

**Pain & Body**
- [ ] Increased pain
- [ ] Muscle weakness
- [ ] Joint pain / instability

**Immune & Digestive**
- [ ] Rash / flushing / itching
- [ ] Nausea
- [ ] Stomach pain / diarrhea
- [ ] Fever / chills

**Other**
- [ ] Sensitivity to light, sound, or smells
- [ ] Other symptom

Two changes are especially important.

First, I would change **"Fainting"** in the current checklist to "Feeling faint / lightheaded," with a separate follow-up asking whether the patient actually lost consciousness. Recent fainting should not simply sit beside nausea as another routine checkbox.

Second, I would include "Getting winded more easily with activity" as its own symptom. That will help distinguish a change in physical capacity from chest pain or severe respiratory distress.

For patients with MCAS and dysautonomia, I would also ensure the detailed branches capture flushing, itching, gastrointestinal symptoms, temperature intolerance, and changes with standing, even if these do not all appear as top-level choices.

### 3. Build adaptive follow-up questions based on the symptoms selected

Rather than asking the same lengthy questionnaire of everyone, HCOS can open a short follow-up for each selected symptom.

Each branch should capture four elements:

1. **Intensity:** How severe is it?
2. **Change:** How different is this from the patient's usual condition?
3. **Impact:** What can the patient no longer do comfortably?
4. **Pattern:** What accompanies it, and does anything appear to trigger it?

Below are the branches I would prioritize for the first release.

#### A. Getting winded more easily with activity

This is the symptom we originally discussed, and it is a useful example of how the branching should work.

**Getting winded more easily with activity**

You mentioned getting out of breath more easily than usual. Help us understand what you're experiencing.

**When do you become winded?**

- Only during strenuous activity
- During normal activities, like climbing stairs
- During very light activity, like walking across a room
- Even while resting

**If “Even while resting” is selected:**

> **Breathing safety check.** Trouble breathing at rest needs prompt medical assessment. If this is new, severe, sudden, or worsening, call 911 now. Do not continue routine flare reporting.

**Compared with your usual health, is this:**

- About the same as usual
- Slightly worse
- Much worse
- A new symptom for me

**Does resting help your breathing return to normal?**

- Yes, within a few minutes
- Yes, but it takes longer than usual
- No, it continues even after resting
- I'm not sure

The system should screen for chest discomfort, wheezing, throat symptoms, and anaphylaxis warning signs as appropriate. Persistent, new, or substantially worsened breathing symptoms should route to urgent clinical assessment, with emergency routing whenever red flags appear.

For retrospective research, you now have three useful variables: exertion threshold, baseline deviation, and recovery with rest.

#### B. Heart racing / palpitations

**Patient-facing questions:**

"How would you describe what you're feeling?"

- My heart is beating faster than usual.
- My heart feels like it's pounding.
- My heartbeat feels irregular or skips beats.
- I'm not sure.

"When does this happen?"

- While resting
- When standing up
- During physical activity
- At unpredictable times

"Is this similar to your usual symptoms?"

- Yes, this is familiar.
- It is familiar but worse than usual.
- This is new or different.

Optional: "If you've measured your heart rate, what was it?" Include the reading, units, device, and whether the person was resting, standing, or active.

**Safety branch:** New palpitations with chest discomfort, significant breathing difficulty, fainting, or other concerning symptoms should stop routine documentation and trigger emergency guidance. New or persistent palpitations without those findings may still require prompt clinician assessment.

For POTS patients, changes in posture and symptoms accompanying the heart-rate change are particularly valuable.

#### C. Extreme fatigue

This is another important one because fatigue can describe several distinct experiences.

**What best describes your fatigue?**

- My body feels physically exhausted.
- My mind feels exhausted, and thinking is difficult.
- I feel both physically and mentally exhausted.
- I feel unusually sleepy.

**How much is it affecting your ability to function?**

- I can do most normal activities, but need more breaks.
- I can do some normal activities, but need considerable rest.
- I can manage only basic needs.
- I'm unable to manage my basic needs.

**Does activity make your symptoms worse?**

- No.
- Yes, during or right after activity.
- Yes, several hours later or the following day.
- I'm not sure.

That third question is especially valuable for distinguishing general fatigue from possible post-exertional symptom exacerbation, without assuming the underlying diagnosis.

#### D. Brain fog

**What are you having trouble with?**

- Finding words
- Remembering things
- Concentrating
- Reading or following conversations
- Processing information or making decisions

**How much does it affect daily activities?**

- Noticeable, but I can function.
- It takes much more effort to complete tasks.
- I'm unable to complete some usual tasks.

Also ask whether this is familiar, worse than usual, or new. Sudden confusion, speech changes, or other neurological warning signs should route directly to emergency screening rather than being accepted as ordinary brain fog.

#### E. Dizziness / lightheadedness

This needs careful separation because "dizzy" can mean several things.

**What does the dizziness feel like?**

- I feel lightheaded, like I might faint.
- The room feels like it's spinning.
- I feel unsteady or off balance.
- My vision darkens when I stand up.

**When does it happen?**

- When standing up
- While standing for a while
- When moving my head
- Even while sitting or lying down

**Have you actually fainted or lost consciousness?**

- No.
- Yes.

A "Yes" answer needs a dedicated medical safety branch, not just a higher severity score. Recent unexplained loss of consciousness requires urgent evaluation, and ongoing altered consciousness or associated emergency symptoms require 911.

#### F. Rash / flushing / itching

For mast cell patients, I would separate the type of skin symptom from its severity.

**What are you experiencing?**

- Flushing or feeling unusually hot
- Itching
- Hives or raised bumps
- A different type of rash

**How widespread is it?**

- One small area
- Several areas
- Most of my body

**Did it occur with any of these symptoms?**

- New breathing difficulty or wheezing
- Throat tightness, voice changes, or swelling
- Feeling faint or collapsing
- Repeated vomiting or severe abdominal symptoms after a suspected exposure
- None of these

This is one of the most important clinical safety branches. Anaphylaxis can present with combinations of skin, respiratory, cardiovascular, or gastrointestinal symptoms. Some patients will not have a rash at all.

#### Other symptom branches

For the other symptoms, I would start with similarly brief, standardized questions:

| Symptom | Most valuable follow-up data |
|---|---|
| Pain flare | Location, 0–10 intensity, type of pain, functional impact, change from baseline |
| Headache / migraine | Location, intensity, familiar vs new pattern, light/sound sensitivity, neurological warning signs |
| Nausea / GI | Nausea, vomiting, diarrhea, abdominal pain, ability to keep fluids down |
| Fever / chills | Measured temperature if available, duration, accompanying symptoms |
| Muscle weakness | Generalized vs one-sided, new vs familiar, effect on walking and daily tasks |
| Sleep difficulty | Trouble falling asleep, waking frequently, sleep duration, restorative quality |
| Sensory sensitivity | Light, sound, smell, touch; severity and impact |

All of these branches should begin with an appropriate clinical safety check. For example, a sudden severe headache or new one-sided weakness should not be treated as a migraine flare.

**One usability refinement:** If someone selects five symptoms, don't make them answer five complete questionnaires. Show the shared questions once, then ask only the unique questions needed for each symptom. That will substantially reduce the effort required to document a flare.

### 4. Improve the questions every patient answers

There are a few core questions I would ask every patient regardless of which symptoms they select.

These create the common data points that make comparisons possible across different patients, conditions, and treatments.

#### Overall severity

Your current question is:

"How severe are your symptoms?" with a scale of 0 = Mild and 10 = Worst ever.

I would change it to:

**"At their worst during this flare, how severe have your symptoms been?"**

**Overall flare severity: 0–10**

- 0 — No symptoms
- 10 — Worst imaginable

A score of 10 is not, by itself, an emergency determination. Safety screening is separate.

I would also make the severity question specific to either the *worst point* of the flare or *right now*. Those are two different measurements. Ideally, collect both, but do not require a patient to answer two nearly identical questions unless the additional data will be used.

#### Functional impact

This may be the single most valuable new question for HCOS.

**"How much is this flare affecting your ability to do your usual activities?"**

| Response | Stored value |
|---|---:|
| I can do my normal activities. | 0 |
| I can do most activities, but need more breaks. | 1 |
| I can do some activities, but need significant rest. | 2 |
| I can manage only basic daily needs. | 3 |
| I'm unable to manage my basic daily needs. | 4 |

This is a proposed Helixona functional-impact measure, not a validated clinical scale.

Why I like this approach: a patient may report pain at 7/10 on two different days, but their ability to function could be dramatically different.

When recovery begins, patients often notice improvement in what they can do before they notice a large reduction in symptoms.

#### Flare onset

Your current options are:

- In the last few hours
- Yesterday
- 2–3 days ago
- More than 3 days ago

I would modify this to capture an actual date when the patient remembers it.

**"When did this flare begin?"**

- Today
- Yesterday
- 2–3 days ago
- More than 3 days ago
- I'm not sure

If more than 3 days ago, optionally ask the approximate start date. For a same-day flare, HCOS can ask approximately what time symptoms began.

For research, retain both the patient's response and the estimated onset date. Avoid converting "2–3 days ago" into a falsely precise timestamp.

#### Change from baseline

**"Compared with your usual health, how are you feeling?"**

- Slightly worse than usual
- Moderately worse than usual
- Much worse than usual
- This is one of my worst flares

The patient's baseline should ideally come from their most recent stable health assessment, not necessarily their condition at initial enrollment.

#### Is the flare improving?

**"Since this flare began, are your symptoms:"**

- Getting better
- Staying about the same
- Getting worse
- Going up and down

This provides another particularly useful trend measure, especially for determining whether an active flare needs closer clinical attention.

### 5. Add a short trigger and treatment-response section

For Helixona, I think this information could become one of the most valuable parts of the dataset over time.

But I would keep it optional so patients don't feel that they have to investigate their own flare while feeling poorly.

**"Do you think something may have contributed to this flare?"**

Allow multiple selections:

- A recent treatment or therapy
- Physical activity or overexertion
- Emotional stress
- Poor sleep
- Food or drink
- Environmental exposure (smoke, fragrance, mold, chemicals)
- Heat, cold, or weather changes
- Illness or infection
- Medication or supplement change
- Hormonal changes
- I don't know
- Other

If they select a recent treatment, HCOS should ask:

"Which treatment?" and "Approximately how long after the treatment did your symptoms begin?"

Where possible, the patient should choose from actual treatments already recorded in HCOS rather than type the information manually.

I would also add:

**"Have you done anything that helped or worsened this flare?"**

This could include rest, hydration, medications, supplements, an established rescue plan, or another intervention. Only relevant, selected items would receive additional questions about timing and response.

That would allow you to identify patterns such as whether flares frequently occur after a specific intervention, how long they last, and what patients report helps them recover.

These are associations to investigate, not proof that a treatment caused or resolved a flare.

### 6. Create three clinical routing pathways

This is where the HCOS becomes much more than a symptom diary.

I would recommend three patient-facing pathways, with a fourth internal state for incomplete or unanswered safety information.

**Pathway A — Emergency**

Symptoms meeting an emergency safety rule immediately interrupt the report. Display 911 instructions and, when relevant, the patient's emergency action plan.

Do not require completion or offer "continue anyway" as a route around the warning.

**Pathway B — Prompt clinical assessment**

New, worsening, unusual, or clinically concerning symptoms that do not meet emergency rules should direct the patient to prompt medical assessment.

Provide explicit instructions for contacting a clinician, including after-hours alternatives. Do not promise a rapid Helixona response unless that service is actually staffed and operational.

**Pathway C — Routine flare documentation**

Patients with familiar symptoms and no identified warning signs can complete their report, save it to their health timeline, and request follow-up through the normal clinical workflow.

#### Routing should depend on more than a severity number

I would not automatically assign every 8/10 or 9/10 flare to an emergency.

For example, a familiar severe pain flare and a sudden neurological event could receive the same numeric score but demand very different responses.

Likewise, a patient who rates breathing difficulty as only 3/10 might still have a serious new condition.

The clinical rules should consider:

| Dimension | Example |
|---|---|
| Symptom type | Breathing difficulty vs fatigue |
| Onset | Sudden vs gradual |
| Baseline change | Familiar vs new or significantly worse |
| Associated symptoms | Chest pressure, fainting, swelling |
| Functional impact | Can manage normal activities vs unable to function |
| Current status | Improving, stable, or worsening |
| Patient-specific context | POTS, MCAS, established emergency action plan |

I'd recommend having Dr. Drannikov approve a versioned clinical rules table that defines which answer combinations lead to each pathway, including what happens when the patient is uncertain.

Until those rules are clinically validated, the software should not present its routing decisions as a diagnosis or as confirmation that a patient is medically safe.

#### What about the patient's request for contact?

Your current final screen asks:

"How can we support you?"

- Just document this flare
- I'd like someone to contact me

I would keep that question for routine reports, but I would revise the choices:

**"What would you like us to do with this report?"**

- Save this flare to my health timeline.
- Save this flare and have my care team contact me during office hours.

For the second response, specify the expected response window according to Helixona's actual staffing policy.

I would not make that question the primary clinical triage mechanism. The patient's medical safety should never depend on whether they select "contact me."

A patient who needs medical assessment may select "just document" because they don't realize the seriousness of their symptoms.

### 7. Structure the data so Helixona can conduct retrospective studies

This is where I think the design becomes especially exciting.

If you capture the information consistently, you could eventually examine whether specific patterns of care are associated with improvements in symptoms, fewer flares, shorter flares, or greater functional capacity.

I would organize the information into six connected datasets.

| Dataset | Essential information |
|---|---|
| **Flare event** | Flare ID, patient ID, report timestamp, estimated onset, flare status, overall severity |
| **Symptoms** | Symptom code, severity, change from baseline, functional effect, associated findings |
| **Triggers** | Patient-reported suspected triggers, exposure type, time relationship |
| **Treatments** | Treatments before flare, medications or interventions during flare, timing |
| **Recovery** | Improvement/worsening, flare end date, duration, functional recovery |
| **Safety & follow-up** | Safety-rule version, routing result, clinician review, contact, escalation, outcome |

A crucial point: **Do not store the entire flare as one large free-text note.**

You can generate a readable clinical summary from the data, but preserve the individual answers in structured fields.

That enables comparisons across patients and over time.

#### Example: What the data could eventually reveal

Imagine looking at a patient's history across six months:

**Example patient: Flare trends over 6 months**

*Illustrative data only — not actual Helixona patient results.*

| Month | Average reported flare severity | Functional impact (0–4) |
|---|---:|---:|
| Jan | 8.2 | 3.5 |
| Feb | 7.6 | 3.2 |
| Mar | 6.9 | 2.8 |
| Apr | 6.1 | 2.4 |
| May | 5.2 | 1.8 |
| Jun | 4.3 | 1.3 |

This example shows how symptom severity and functional impact might change over time. The two measures use different scales and should be analyzed separately.

With enough consistent data, you could study questions such as:

- Do MCAS patients report fewer or shorter flares as treatment progresses?
- Does exertional tolerance improve before overall fatigue severity improves?
- Are certain therapies followed by temporary increases in symptom burden?
- Do patients with POTS experience improvements in their ability to stand or walk?
- Which symptoms tend to occur together?
- How long does recovery take after a severe flare?

However, there's an important research design issue: patients will be more likely to submit reports when they feel poorly.

A falling flare severity average might reflect real improvement—or differences in reporting behavior.

To make the data more scientifically useful, I would pair event-driven flare reports with a **very brief, standardized weekly check-in**, including weeks when the patient has no flare.

A weekly check-in could ask about overall health, functional capacity, flare days during the past seven days, and whether symptoms prevented usual activities. The choice of a defined recall period is consistent with established patient-reported outcome measurement principles.

I would also consider using validated PROMIS measures alongside HCOS-specific questions when you move into formal outcomes research. The custom Helixona questions are valuable, but their scores should not be presented as validated scales until their measurement properties have been established.

### 8. Add a flare recovery check-in

This is a feature I would strongly recommend building into the first or second development phase.

Right now, your report captures the beginning of a flare but does not appear to capture when it ends.

That leaves a major gap in the longitudinal data.

I would create a short follow-up connected to the original flare event.

**FLARE RECOVERY CHECK-IN**

**How are you feeling now?**

We're checking in about the flare you recently reported.

- [ ] My flare has ended.
- [ ] I'm improving, but still having symptoms.
- [ ] I'm feeling about the same.
- [ ] My symptoms are getting worse.

If the flare has ended: **"When did your flare end?"** with optional date picker.

If symptoms are getting worse:

> Worsening symptoms may need medical attention. HCOS should repeat the appropriate safety screen and provide the clinician-approved care instructions.

**Have you returned to your usual activity level?**

- Yes
- Partially
- Not yet

The system could offer a recovery check-in after a clinically approved interval, with an easy option to report resolution earlier.

These follow-ups should be positioned as **recovery tracking, not continuous medical monitoring**. If Helixona cannot review responses immediately, that limitation must remain clear.

Capturing the recovery date allows you to measure flare duration rather than just frequency and intensity.

### 9. Additional requirements for your software developer

I would include these in the HCOS development specifications.

**Structured clinical data**

Every question should have a stable question ID, version number, response code, and clear definition. If the wording changes later, preserve which version the patient answered.

**Separate symptom severity from functional capacity**

Store an overall flare score, individual symptom scores where useful, and a separate functional-impact score. Do not combine them into one unexplained number.

**Patient baseline**

Compare symptoms against the patient's most recent stable baseline and preserve historical baseline versions.

**Smart question reuse**

When several selected symptoms share a question—such as "Is this new or worse than usual?"—ask it once where clinically appropriate. However, preserve symptom-specific answers when the differences matter.

**Clinical safety audit trail**

Record the triggered rule, timestamp, displayed instructions, whether the patient acknowledged them, and whether the report was submitted. An acknowledgment is not proof that the patient called 911 or obtained care.

**Unfinished reports**

If an emergency warning interrupts documentation, preserve the partial information with a status of "Interrupted — Emergency Guidance Displayed." Do not classify the event as a successfully completed routine flare report.

**Clinical oversight and alert delivery**

Urgent clinical notifications must have explicit ownership, operating hours, escalation rules, and acknowledgment tracking. A queued message is not the same as a clinician having reviewed it.

**Research governance**

Include patient permissions, access controls, secure handling, appropriate de-identification, and a research review process before using information for formal studies or publication. Clinical care and research authorization should remain distinguishable.

### 10. The final patient journey I would implement

1. **Safety check** — Identify immediate warning signs before routine documentation. Stop and show emergency guidance when required.
2. **Select symptoms** — Use the simple checklist you already designed, with a few additions and clearer wording.
3. **Adaptive symptom questions** — Capture severity, context, baseline changes, and relevant clinical warning signs.
4. **Overall flare assessment** — Record worst severity, current status, functional impact, and onset.
5. **Possible triggers and interventions** — Keep these questions brief, with an option to skip.
6. **Clinical safety routing** — Evaluate responses continuously and direct patients to the appropriate emergency, prompt-assessment, or routine-report pathway.
7. **Save and support** — Save the structured event and allow the patient to request routine care-team follow-up when appropriate.
8. **Recovery tracking** — Link subsequent updates to the original flare until it resolves or is closed with an explicitly recorded status.

### My recommendation on development priorities

I would divide the build into two phases rather than attempting to launch every possible feature at once.

**Phase 1 — Safe, useful flare reporting:** Implement the emergency rules, revised symptom checklist, six high-priority adaptive symptom branches, shared severity and functional questions, structured data storage, and clear clinical routing.

**Phase 2 — Learning and outcomes:** Add broader symptom branches, integration with treatments and medications, recovery check-ins, weekly baseline tracking, and longitudinal analysis dashboards.

One thing I'd particularly emphasize to your developer is that the patient should rarely see more than three or four questions at a time. Patients experiencing cognitive decline, severe fatigue, migraine, or brain fog need a calm, manageable experience.

For HCOS, I would aim for approximately 1–2 minutes to report a straightforward flare, with additional time only when symptoms require more detailed evaluation.

The best design is one that asks **the fewest questions necessary to make the next appropriate decision**, while quietly capturing the structured data that will help Helixona's clinicians—and future patients.

What you're building has the potential to be particularly valuable because it recognizes a fundamental truth of complex chronic illness: **how a patient is functioning, and how that function changes over time, can tell us as much as the symptom itself.**

That belongs at the heart of HCOS.

---

## User — Request to show the next patient-facing screen

Show me the next patient-facing HCOS flare reporting screen after the emergency safety check.

## Assistant — Screen 2: Symptom Selection

This would be **Screen 2: Symptom Selection**, immediately after the patient confirms that none of the emergency warning signs apply.

I would keep it visually similar to your existing HCOS screens: simple, uncluttered, and easy to complete during a flare.

### Patient-facing mockup (text version)

**Report a crash or flare — Step 2 of 5**

**What symptoms are you experiencing?**

Select all that apply. We'll ask a few more questions to better understand how you're feeling.

**Energy & Thinking**

- [ ] Extreme fatigue
- [ ] Brain fog
- [ ] Headache / migraine
- [ ] Difficulty sleeping

**Heart & Breathing**

- [ ] Heart racing / palpitations
- [ ] Getting winded with activity
- [ ] Dizziness / lightheadedness

**Pain & Body**

- [ ] Pain flare
- [ ] Muscle weakness
- [ ] Joint pain / instability

**Immune & Digestive**

- [ ] Rash / flushing / itching
- [ ] Nausea / stomach upset
- [ ] Fever / chills
- [ ] Sensitivity to light, sound, or smells

**Other**

- [ ] Other symptom

*Select at least one symptom to continue.*

**Continue →**

*Flare reports are not monitored continuously. If you develop emergency symptoms, call 911.*

### What happens next

When the patient taps **Continue**, HCOS uses their selections to determine which follow-up questions to display.

For example, selecting "Getting winded with activity" would lead to questions about how much activity causes breathlessness, how it compares with their usual ability, and whether it improves with rest.

Selecting "Brain fog" would instead lead to questions about concentration, memory, communication, and daily functioning.

If the patient selects both symptoms, HCOS should ask the relevant questions for each, without unnecessarily repeating shared questions.

**One important safety feature:** Emergency screening must remain active throughout the questionnaire. If a follow-up answer reveals a warning sign, HCOS should immediately interrupt routine reporting and display the appropriate emergency instructions.

This gives patients a simple experience while collecting consistent, structured information that Helixona can analyze across flares and over time.

---

## User — Export request

can you please export this chat and your responses in .md

---

*End of export.*
