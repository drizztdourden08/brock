---
'@drizztdourden08/brock-build': minor
---

New `brock release-notes check [version]`, from an app or its repo root: the note of that version must exist at the repo root and follow the release note standard, with the title naming `product.name`. Without a version it checks the app's own version once the repo has a note at or below it. The managed `ci.yml` runs it in the quality job, and the managed `release.yml` runs it with the version being released before it tags, so a release without a proper note stops there.
