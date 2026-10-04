---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-lint-config': minor
'@drizztdourden08/create-brock': minor
---

Apps add their own review steps: each `src/review/<id>.step.ts` (default export `defineReviewStep({ run })`) runs as step `<id>` after the built-in steps, in the same report. `run(tour)` gets the built-in helpers: `check`, `report`, `capture` (named `<id>-<name>`), `find`, `findAll`, `click`, `hover`, `typeText` (inputs and textareas), `press`, `waitFor`, `settle`, `delay`, `openScreen`, `openWidget`, `resetUi`, plus `platform` and `api`. A step that finishes gets a passing `step-ran` check, and an id that is a built-in step's name fails. `brock structure` accepts `<id>.step.ts` files and the lint preset allows their default export. The new app ships `src/review/notes.step.ts`.
