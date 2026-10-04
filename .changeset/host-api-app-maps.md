---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-react': minor
---

`hostApi<M>()` and `requireHostApi<M>()` take the app's own maps as a type argument (`{ invoke?, send?, events? }`, for example `typeof APP_INVOKE_MAP`) and add their methods to the base ones, so an app reaches its channels without a cast. Without one they return the base `IpcApi` as before. brock-core exports `AppIpcMaps` and `AppIpcApi`.
