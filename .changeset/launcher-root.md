---
"@drizztdourden08/brock-build": patch
"@drizztdourden08/create-brock": patch
---

The repo command runs Brock in its own checkout when called from outside it, and a worktree install no longer rewrites the machine shims. Scaffolded and adopted apps route the scope to GitHub Packages in their .npmrc.
