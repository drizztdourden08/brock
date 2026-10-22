---
'@drizztdourden08/brock-input': patch
'@drizztdourden08/brock-electron': patch
'@drizztdourden08/brock-catalog': patch
'@drizztdourden08/brock-display': patch
'@drizztdourden08/brock-secrets': patch
---

Fix the Controllers window showing no controllers: the input, catalog, display and secrets modules now keep one instance per app, so register and onWindow no longer build two.
