---
'@drizztdourden08/brock-port-kit': minor
'@drizztdourden08/brock-react': patch
---

An asset step report takes a `Text` for its line, so `report.line(msg('ns:key'))` shows in the active language. Brock React typechecks when the app's generated messages type narrows the keys: the tour and Tessera keys built at run time are no longer read as typed keys.
