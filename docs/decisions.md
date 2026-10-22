# Decision log

| Date | Decision | Supersedes | Why |
|---|---|---|---|
| 2026-10-02 | eCW integration via bot (browser automation), no API | Requirements §10 SCH-03/SCH-10 assumed an API | No eCW API available or contracted |
| 2026-10-02 | App owns availability/bookings for program modalities; eCW receives a mirror | Requirements §10 (eCW as scheduling system of record) | Bot cannot guarantee real-time availability; rooms/devices are not providers |
| 2026-10-06 | Build by module, intake first | Requirements §19 (full sequence) | MVP is large; first demo ~1.5 months |
| 2026-10-06 | Stripe as payment processor | Requirements §11 (processor unspecified) | Client decision |
| 2026-10-07 | Mockups deployed to GitHub Pages via Actions; hash routing so deep links work | — | Client reviews in the browser without hosting setup |
| 2026-10-07 | Brand tokens follow CLAUDE.md §6 (deep teal, warm neutrals, Source Sans 3 + Fraunces) pending the official Helixona palette | — | helixona.com was not reachable from the build environment; tokens live in one place (`src/index.css`) for a quick swap |
| 2026-10-08 | All Priority 1–3 mockups built in one pass (client asked not to wait for Priority 1 review) | CLAUDE.md §4 sequencing for mockups | Client request; the real build still ships by module, intake first |
| 2026-10-22 | Medical Director's questionnaire (New Patient Packet, SF-36, Mold, Metabolic, Lyme, Brain, L2/L3 Health Optimization new + follow-up) implemented exactly as supplied from the spreadsheet; L2/L3 read as the Health Optimization questionnaire per client | Placeholder questions | Content received; generator script keeps wording and order identical to the source |
| 2026-10-22 | Two intake pathways from the website: Complex Chronic (New Patient Packet + SF-36 + Metabolic + Mold) and Health Optimization = L2/L3 (New Patient, then Follow-Up); NP care routes to the front desk | Requirements §3 'self-directed care' | Client clarification |
| 2026-10-22 | Ten patient consents implemented as supplied (.docx → consentContent.ts); the paper signature block is replaced by the app e-signature with representative relationship | Placeholder forms | Content received from the client |
