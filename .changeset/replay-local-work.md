---
'@drizztdourden08/brock-thread': patch
---

Add `replay plan` and `replay run --go`. Replay moves local work to GitHub on the owner's go: it pushes the integration branch after a fast-forward check, opens a GitHub pull request for each merged local one, and publishes the exact release tarballs after a sha512 check before it creates the GitHub release. It refuses in local mode and without `--go`, stops at the first failure, and skips what is already done.
