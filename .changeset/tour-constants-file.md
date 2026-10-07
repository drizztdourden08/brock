---
'@drizztdourden08/brock-build': minor
---

`src/tours` takes constants files beside the tours: `<id>.tour.constants.ts`, the file the constants lint rule names for a constant in `<id>.tour.ts`, and `<name>.constants.ts` for constants several tours share. `brock structure` no longer reports them, and `brock sync` leaves them out of `.brock/tours.ts`. Before, lint asked for the constants file and the structure check refused it, so a tour's selector had to live in `src/hooks`.
