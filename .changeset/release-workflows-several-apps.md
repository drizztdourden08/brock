---
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-updater': minor
---

A Brock workspace with several apps gets workflows per app. Each app gets `ci-<app>.yml` and `release-<app>.yml` at the repo root, and the first app also writes `ci.yml` with one `workspace` job for the repo-wide checks. A pull request builds and reviews an app only when it touches it: the new `brock affected <app folder> [base ref]` prints true for the app's own files, a workspace package it depends on, or a file outside every package. Releases tag with the new `product.releaseTagPrefix` (`'desktop-v'`, required once a repo has several apps, `v` otherwise) and read the notes from the app's own `release-notes/`; `brock release --app <name>` dispatches the app's workflow. The updater keeps to the releases whose tag starts with the prefix, so the other apps and any other tags of the repo stay out of its list. A workspace with one app keeps `ci.yml`, `release.yml` and plain `v<version>` tags.
