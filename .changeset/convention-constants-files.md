---
'@drizztdourden08/brock-build': patch
---

`brock structure` accepts the constants file the constants lint rule names in every convention folder, as it already did in `src/tours`: `<id>.widget.constants.ts` and `layout.constants.ts` in `src/widgets`, `<id>.action.constants.ts` in `src/title-bar`, `<id>.<kind>.constants.ts` (such as `library.page.constants.ts`) at any level of `src/screens`, and `<name>.constants.ts` for constants several files there share; `brock sync` leaves them out of `.brock`. Module folders take `<id>.task.constants.ts` beside a boot task and `<id>.step.constants.ts` beside a review step. Before, lint asked for these files and `brock structure` refused them.
