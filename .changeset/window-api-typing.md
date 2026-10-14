---
'@drizztdourden08/brock-react': patch
---

An app may declare its own `window.api` type. brock-react read and wrote `window.api` through `Window & { api?: ... }`, so an app's `declare global { interface Window { api: AppApi } }` turned those casts into type errors inside brock-react's source, which the app's own typecheck reads. brock-react now reaches `window.api` through a holder type of its own and never through the global `Window`, and the log and widget layout globals do the same. An app types its extra `window.api` members by augmenting `IpcNamespaces` in `@drizztdourden08/brock-core/augment`, or by passing its maps to `hostApi<M>()`; a global declaration of its own keeps working too.
