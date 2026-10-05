---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
'@drizztdourden08/create-brock': minor
---

The review copies `src/review/fixtures/` into the app data folder, at the same paths, before the seed runs, for sample files that are easier to keep as files. `brock sync` lists them in `.brock/review.ts` (`fixtures`, lazy `?url` imports), the copy reports a `fixtures-copied` check in the `seed` step, and `brock structure` leaves the folder alone. A fresh app ships `src/review/fixtures/notes/review-note.txt`, which its seed reads into the Notes widget.
