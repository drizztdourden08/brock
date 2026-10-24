---
'@drizztdourden08/brock-secrets': minor
---

A Node secret store for headless apps. `@drizztdourden08/brock-secrets/node` exports `createNodeSecretStore({ dataDir, env?, envPrefix? })`, with the same `canStore`, `set`, `get`, `has`, `list` and `delete` as the Electron store, for a server with no Electron and no OS keychain. The entry never imports `electron`. Secrets live in one JSON file, `<dataDir>/secrets/secrets.json`, written atomically with mode 0600 on posix (on Windows the mode is ignored and the file keeps the folder's ACL). An environment variable `BROCK_SECRET_<KEY>` overrides the file for a key: the name is upper case with each run of characters outside A-Z and 0-9 turned into one `_`, so `api-token` reads `BROCK_SECRET_API_TOKEN`. This store is not encrypted at rest. The Electron store is unchanged.
