---
'@drizztdourden08/brock-react': patch
---

`appOpen` hands a held launch request to every handler that subscribes before the next task, not only the first. A file or link the app was launched with used to reach one screen when two screens subscribed in the same render; now each gets it, and a handler that subscribes later does not see it again.
