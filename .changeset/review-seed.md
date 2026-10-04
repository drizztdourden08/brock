---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
'@drizztdourden08/create-brock': minor
---

The review tours the app's real content: `src/review/seed.ts` (default export `defineReviewSeed({ run })`) runs as the `seed` step right after the profile step, so the screens and widgets that follow are captured with data. The seed fills the app through its own channels, a store, or fixture files written with `tour.platform.files`. `brock sync` lists it in `.brock/review.ts`, `src/main.tsx` passes `review={appReview}` to `BrockApp` (the `review-files` migration adds it), and the new app writes a note for the Notes widget. docs/review-steps.md shows how to write one.
