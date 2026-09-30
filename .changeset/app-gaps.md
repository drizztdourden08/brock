---
"@drizztdourden08/brock-core": patch
"@drizztdourden08/brock-electron": patch
"@drizztdourden08/brock-react": patch
"@drizztdourden08/brock-build": patch
"@drizztdourden08/brock-thread": patch
"@drizztdourden08/create-brock": patch
---

The gaps the first Archipelia app found, now in Brock. `product.ports` gives each app a port block, each thread worktree a slot of its own and the dev server `strictPort`; `create-brock` writes the base. `brock adopt` writes the knip entries and the `.gitignore` lines for generated outputs. `brock check` and `brock sync` run per app at a workspace root. `launchAppForTest` from `brock-build/testing` starts the built app headless for app e2e tests. New helpers: `confirmAction`, `useNow`, `useCopyText`, `useKeyedGuard`, `redactSecrets` and `lanAddresses()` with the `network:lanAddresses` channel.
