---
'@drizztdourden08/brock-build': patch
'@drizztdourden08/create-brock': patch
'@drizztdourden08/brock-lint-config': patch
'@drizztdourden08/brock-thread': patch
---

Fix the duplicate copy of standards in a repo that is ahead of Brock. These packages asked for standards `^0.11`, so a repo on standards `^0.12` got two copies and `standards sync` failed with "Cannot redefine plugin". The range is now `>=0.11.0 <1`, so the one copy a repo installs satisfies every Brock package.
