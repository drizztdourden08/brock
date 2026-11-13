---
'@drizztdourden08/brock-react': patch
---

The web and Capacitor API shim resolves every base invoke method that returns a list to an empty list, `takeOpenRequests` and the document and widget lists included, so `useAppOpenBridge` no longer throws off Electron.
