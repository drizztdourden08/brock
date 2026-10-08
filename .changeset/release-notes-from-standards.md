---
'@drizztdourden08/brock-thread': minor
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-lint-config': minor
'@drizztdourden08/create-brock': minor
---

Brock depends on `@drizztdourden08/standards` ^0.8.0, and `brock-thread` drops its copy of the release note checker for `@drizztdourden08/standards/release-notes`: `checkReleaseNote` is the standards function, and `checkNoteFile` runs its `checkRepoNotes` for the version named, so `brock release` and `brock release-notes check` also hold every newer note in the repo to the standard.
