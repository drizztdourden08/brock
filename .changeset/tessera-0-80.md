---
'@drizztdourden08/brock-react': patch
---

Build against Tessera 0.80. Its `tokens.css` is one flat pre-built file, so a dev start no longer waits on a chain of style imports. Apps can bump Tessera to 0.80 for the faster start; 0.78 still works.
