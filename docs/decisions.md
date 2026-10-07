# Decision log

| Date | Decision | Supersedes | Why |
|---|---|---|---|
| 2026-10-02 | eCW integration via bot (browser automation), no API | Requirements §10 SCH-03/SCH-10 assumed an API | No eCW API available or contracted |
| 2026-10-02 | App owns availability/bookings for program modalities; eCW receives a mirror | Requirements §10 (eCW as scheduling system of record) | Bot cannot guarantee real-time availability; rooms/devices are not providers |
| 2026-10-06 | Build by module, intake first | Requirements §19 (full sequence) | MVP is large; first demo ~1.5 months |
| 2026-10-06 | Stripe as payment processor | Requirements §11 (processor unspecified) | Client decision |
| 2026-10-07 | Mockups deployed to GitHub Pages via Actions; hash routing so deep links work | — | Client reviews in the browser without hosting setup |
| 2026-10-07 | Brand tokens follow CLAUDE.md §6 (deep teal, warm neutrals, Source Sans 3 + Fraunces) pending the official Helixona palette | — | helixona.com was not reachable from the build environment; tokens live in one place (`src/index.css`) for a quick swap |
