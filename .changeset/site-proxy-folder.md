---
'@drizztdourden08/brock-build': patch
---

`brock site add`, `brock sync` and `brock check` warn when a site's `src` or `public` holds a folder named like its dev proxy path (`src/api` under `/api`), whose files the proxy would send to the API and leave the page blank.
