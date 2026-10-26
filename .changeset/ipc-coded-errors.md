---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-electron': minor
---

A handler registered through `ctx.handle` can throw an `AppError` (`new AppError(message, { code, data? })`) and the renderer reads the code and data back with `isAppError(error, 'code')`, where before only the message crossed. The error rejects as usual with the human message plus an encoded tail that the preload keeps and `isAppError` decodes. `data` must be JSON-safe (checked when the error is made) and is dropped with `dataDropped: true` past 8192 characters of JSON. A plain error behaves as before, and no stack crosses. `AppError`, `isAppError`, `toAppError`, `encodeAppError` and `decodeAppError` come from `@drizztdourden08/brock-core/ipc`.
