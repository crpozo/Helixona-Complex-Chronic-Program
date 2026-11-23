# HELIXONA
## HCOS — Daily Health Check-In v4
**Development Requirements for Carlos**  
**Date:** November 19, 2026  
**Module:** Patient Portal → Daily Health Check-In

## 1. Objective and Design Principles
Make daily health tracking effortless for patients, including those experiencing brain fog, exhaustion, or pain, while collecting clinically useful, structured information for longitudinal review.

- **Simple first:** Six core ratings should take approximately one minute.
- **Consistent direction:** All daily wellness sliders use **0 = worst, 10 = best**, with better health to the right.
- **Optional detail:** Each category has expandable symptom checkboxes, selected follow-ups, and an optional note.
- **Low cognitive burden:** Everyday language, short prompts, large touch targets.
- **Data integrity:** Show previous answers for context; do not silently carry them forward as today's responses.
- **Structured longitudinal data:** Link ratings and symptoms to dates, treatments, medications, supplements, activities, flares, and crashes.
- **Safety:** Daily check-ins are not continuously monitored or a substitute for urgent care.

## 2. Main Screen
**Heading:** Your Daily Health Snapshot

**Introduction:**
> How are you feeling today? Move each slider to show how you're doing. A higher number means you're feeling better. Have more to share? You can add details below any question.

Use the same slider direction, colors/fill behavior, and numeric label placement for all six categories.

| Current title | Proposed title | Short patient description | 0 label | 10 label |
|---|---|---|---|---|
| Energy | **Energy** | How much energy do you have for your usual activities today? | No energy | Full of energy |
| Fatigue | **Physical Exhaustion** | How physically worn out or exhausted do you feel? | Completely exhausted | Not exhausted |
| Pain | **Physical Comfort** | How comfortable is your body today? Think about aches, pain, or discomfort. | Severe pain | No pain |
| Brain Fog | **Mental Clarity** | How clearly can you think, focus, and remember things today? | Very foggy | Clear and focused |
| Sleep Last Night | **Sleep Quality** | How well did you sleep last night? | Very poor sleep | Restful sleep |
| Digestion | **Digestive Comfort** | How comfortable has your stomach and digestion been today? | Very uncomfortable | Very comfortable |

**Clinical considerations:** Energy and Physical Exhaustion may overlap; retain provisionally and review their distinct usefulness with clinical leadership. Physical Comfort is not identical to a conventional 0–10 pain severity score. If the physicians need a standard pain score, retain a separate clearly labeled pain-intensity measure rather than treating comfort as equivalent.

**Historical data caution:** Never simply relabel old ratings. Preserve original question text, scale direction, and version. For an unchanged construct with reversed direction, `normalized_score = 10 - original_score` may be mathematically possible, but revised wording can make historical and new measures clinically non-equivalent.

## 3. Expandable Optional Details
Under **every** slider show **+ Add details (optional)**. Expand inline, not on a separate screen. All details are optional and never block submission.

Expanded areas may include:
1. Multi-select common symptom checkboxes.
2. One or two short optional follow-up questions when useful.
3. A brief optional comment box.

For scores 0–4, optionally suggest: **Having a difficult day? You can tell us a little more.** Do not force the section open or require it. Patients may add details regardless of score.

### A. Energy
**Prompt:** What is affecting your energy today?

Checkboxes:
- Low energy throughout the day
- Energy dropped suddenly
- Energy worsened after activity
- Needed extra rest or naps
- Feel physically weak
- Feel sleepy or drowsy
- Energy comes and goes
- Other

**Optional follow-up:** When was your energy lowest? Morning / Afternoon / Evening / All day / Not sure.

**Optional note:** Anything else about your energy today?

### B. Physical Exhaustion
**Prompt:** What best describes your exhaustion?

Checkboxes:
- Woke up feeling exhausted
- Body feels heavy or drained
- Muscles tire easily
- Exhausted after light activity
- Exhausted after mental activity
- Needed to lie down or rest
- Exhaustion is worse than usual
- Other

**Optional follow-up:** Did exhaustion become worse after activity? Yes, right away / Yes, hours later / Yes, the next day / No / Not sure.

**Optional note:** Anything else about your exhaustion?

**Clinical note:** This records patient reports of immediate or delayed worsening after exertion; it does not diagnose post-exertional malaise.

### C. Physical Comfort (Pain)
**Prompt:** What kind of pain or discomfort are you experiencing?

Checkboxes:
- Headache
- Migraine
- Joint pain
- Muscle pain
- Bone or deep aching pain
- Nerve pain (burning, tingling, or shooting)
- Neck or back pain
- Abdominal pain
- Widespread pain
- Other

**Optional location (multi-select):** Head / Face; Neck / Shoulders; Arms / Hands; Chest / Upper Back; Abdomen; Lower Back / Hips; Legs / Feet; All over; Other.

**Optional character (multi-select):** Aching; Sharp or stabbing; Burning; Throbbing; Pressure or tightness; Tingling or electric; Cramping; Other.

**Optional note:** Anything else about your pain?

**Safety:** Chest pain, especially with shortness of breath, must route to clinically approved emergency guidance and not merely into routine symptom documentation.

### D. Mental Clarity
**Prompt:** What are you noticing with your thinking or memory?

Checkboxes:
- Trouble concentrating
- Forgetting things
- Difficulty finding words
- Thinking feels slow
- Hard to follow conversations
- Difficulty reading or understanding information
- Feeling mentally overwhelmed
- Mentally tired after thinking or concentrating
- Other

**Optional follow-up:** When is your mental clarity most affected? Morning / Afternoon / Evening / All day / Comes and goes / Not sure.

**Optional note:** Anything else about your mental clarity?

**Clinical note:** This is a patient-reported experience, not a formal cognitive assessment.

### E. Sleep Quality
**Prompt:** What affected your sleep?

Checkboxes:
- Trouble falling asleep
- Woke up several times
- Woke up too early
- Sweating or feeling too hot
- Feeling too cold
- Racing thoughts
- Pain or physical discomfort
- Needed to use the bathroom
- Breathing problems or snoring
- Restless legs or body
- Nightmares or vivid dreams
- Slept but did not feel rested
- Other

**Optional follow-ups:**
- About how many hours did you sleep? Numeric hours, permitting half-hour increments.
- How many times did you wake up? None / Once / 2–3 times / 4 or more / Not sure.

**Optional note:** Anything else about your sleep?

**Date handling:** Associate sleep with the relevant overnight period, not automatically with all events occurring in the check-in's daytime date.

### F. Digestive Comfort
**Prompt:** What digestive symptoms are you experiencing?

Checkboxes:
- Diarrhea or loose stools
- Constipation
- Bloating
- Gas
- Abdominal pain or cramping
- Nausea
- Acid reflux or heartburn
- Vomiting
- Feeling unusually full
- Poor appetite
- Urgent need for a bowel movement
- Other

**Optional follow-ups:**
- How many bowel movements have you had today? Optional numeric field.
- Have you noticed a change after eating? Symptoms worsened / Symptoms improved / No noticeable connection / Not sure.

**Optional note:** Anything else about your digestion?

**Clinical note:** Do not infer causes from reported associations.

## 4. Patient Flow
1. Open **Your Daily Health Snapshot**.
2. Select or confirm whichever of the six ratings the patient wants to report.
3. Optionally expand **Add details** for any category; select checkboxes and/or add a note.
4. Continue to **Next: Recent Treatments**. Optional details never block progress.
5. Distinguish **Completed**, **Partially Completed**, and **Not Submitted** check-ins. Each category records whether it was answered, confirmed unchanged, or skipped.

Large touch targets and a tappable numeric score entry are recommended for patients who have difficulty moving sliders.

## 5. Yesterday's Values — Avoid False Data
Current design shows yesterday's answer as the initial slider position. This is convenient but can incorrectly turn yesterday's condition into a reported score for today.

**Preferred solution:** Display **Yesterday: [score]** as a small reference label or marker. Today's answer begins **Not yet answered**. Offer **Same as yesterday** as an explicit one-tap confirmation.

If prefilled sliders are retained for speed, require an explicit confirmation action before values become today's observations.

Each response must distinguish:
- `new_today`
- `confirmed_previous`
- `skipped`

A skipped question is **not** a zero and is **not** confirmation of yesterday's score.

## 6. Data Model
Recommended tables/objects:

### Daily Check-In
- `checkin_id`
- `patient_id`
- `checkin_date`
- `submitted_at`
- `patient_timezone`
- `checkin_version`
- `completion_status`

### Category Response
- `response_id`
- `checkin_id`
- `category_id`
- `question_version`
- `rating_value` (nullable integer 0–10)
- `response_source` (`new_today`, `confirmed_previous`, nullable if skipped)
- `response_status` (`answered`, `skipped`)
- `reported_period_start`, `reported_period_end`
- `optional_notes`

### Symptom Observation
- `symptom_observation_id`
- `response_id`
- `symptom_code`
- `symptom_label_version`
- `selected`
- `location` (optional)
- `characteristic` (optional)
- `reported_at`

**Implementation requirements:**
- Give every checkbox option a stable internal code; do not store all symptoms as one concatenated text field.
- Examples: `digestive_diarrhea`, `digestive_constipation`, `digestive_reflux`, `pain_headache`, `pain_migraine`, `sleep_night_sweats`, `sleep_sleep_onset`, `clarity_word_finding`.
- Store multiple selected symptoms independently for querying and trends.
- An unchecked checkbox means **not reported**, not necessarily **absent**.
- Preserve a canonical daily check-in with auditable revision history and avoid duplicate observations during resaves.
- Keep original scale wording/direction and versions for legacy records.
- Honor the patient's local dates; associate sleep with the correct overnight interval.

## 7. Clinical Dashboard and Longitudinal Overlays
Provider view should offer:
- Six separate rating trends, with 7-day, 30-day, 90-day and custom ranges.
- Date-specific details: rating, checked symptoms, pain location/character, comments, and contemporaneous events.
- Overlays for medication and supplement prescription/start/stop/dose/adherence changes; treatments and modalities; flare/crash events; and activity/exertion entries.

Example questions for physician investigation:
- Did digestive symptoms change after a supplement was started?
- Did mental clarity shift during a treatment period?
- Are poor sleep nights associated with exhaustion?
- Does pain often increase before reported flares?
- Are symptoms changing around shifts in activity?

**Interpretation:** These are associations, not causal conclusions. Do not calculate a single overall health score from six domains without separate clinical validation.

## 8. Safety and Patient Communication
Keep clear messaging near completion:

> Your care team reviews submissions during clinic hours. This check-in is not monitored continuously.

Preserve an accessible **Report a crash or flare** route. Emergency symptoms must use a distinct clinically approved triage experience, not only a check-in note. Examples requiring emergency guidance include chest pain with shortness of breath and new/worsening throat or tongue swelling with difficulty breathing or swallowing. Clinical leadership must approve all exact triggers and wording before release.

## 9. Implementation Priorities
### Phase 1 — Immediate
- [ ] Standardize all daily wellness sliders: 0 worst / 10 best.
- [ ] Update six titles, prompts, and endpoint labels.
- [ ] Add expandable optional symptom checkbox groups and notes.
- [ ] Save symptom selections as structured data.
- [ ] Fix previous-day carry-forward behavior and preserve versions.
- [ ] Mobile QA, large tap targets, flare/crash access, safety notice.

### Phase 2 — Clinical Enrichment
- [ ] Pain location/character follow-ups and other optional micro-questions.
- [ ] Symptom details in provider views.
- [ ] Category trend graphs and timeline event markers.

### Phase 3 — Integrated Analysis
- [ ] Overlay medication/supplement changes, treatments, activities, flares, crashes.
- [ ] Develop provider-facing summaries for review (not diagnoses).
- [ ] Evaluate question usefulness and refine from patient/clinical feedback.

## 10. MVP Acceptance Criteria
1. All six sliders are consistently oriented.
2. Titles and brief descriptions are readable and understandable.
3. Patients can submit basic ratings without opening detail sections.
4. Optional expansions support multiple symptom selections and short comments.
5. No omitted rating silently becomes today's report.
6. Original historical score meaning and versions are preserved.
7. Structured observations are dated, independently queryable, and auditable.
8. Providers can see ratings and optional details together.
9. Mobile interaction is comfortable for people with fatigue or brain fog.
10. Emergency guidance and non-continuous-monitoring notice remain clear.

## 11. Open Clinical Design Decisions
- **Energy vs. Physical Exhaustion:** Confirm with Dr. Drannikov whether both are sufficiently distinct for daily tracking; retain both initially pending feedback.
- **Physical Comfort vs. Pain Intensity:** Keep a separate conventional 0=no pain / 10=worst pain measure if the clinical team needs a standard pain intensity score. Do not conflate the two.

---

**Design standard:** *The daily check-in should feel like a gentle conversation with Helixona, not another medical form. The patient experiences simplicity; the clinical system preserves depth.*
