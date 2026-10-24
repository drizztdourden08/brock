---
'@drizztdourden08/brock-build': patch
---

`BrockServerOptions` types `optionalAddons`, so a brock.config.ts that sets `server.optionalAddons` typechecks. The build already read it in 0.87.0.
