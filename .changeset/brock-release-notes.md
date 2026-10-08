---
'@drizztdourden08/brock-build': patch
---

Brock's own releases carry a release note. The `release` workflow passes `release-notes` to the reusable workflow of standards, so the version pull request holds a draft `release-notes/v<version>.md` for the one version all Brock packages share, publishing waits until the draft is rewritten and passes the check, and the GitHub release `v<version>` takes the note as its body. The README gives the steps: after the version pull request opens, write the note on its branch, check it with `pnpm release-notes check`, then merge.
