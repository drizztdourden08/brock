---
'@drizztdourden08/brock-build': minor
---

Brock's own releases follow the release note standard through the reusable release workflow of standards: the root declares `@drizztdourden08/standards` and a `release-notes` script, so once Brock depends on standards 0.8.0 the version pull request carries a draft `release-notes/v<version>.md` from the changesets, publishing waits until someone rewrites it, and the GitHub release `v<version>` takes it as its body in place of one release per package.
