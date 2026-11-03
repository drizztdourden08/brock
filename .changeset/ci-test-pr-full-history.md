---
'@drizztdourden08/brock-build': patch
---

The generated ci.yml checks out the full history in the job that runs `test:pr`. `standards test pr` compares with the base branch and failed on a shallow checkout with "no default branch found". Run `brock sync` to take it.
