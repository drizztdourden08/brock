---
'@drizztdourden08/brock-build': patch
---

`defineBrockVitestConfig` works from a workspace root. It takes react, react-dom, zustand and Tessera, and the JSX runtime, from the app that has them (`{ appDir }` as the third argument, else the root when it holds a `brock.config.ts`, else the first workspace package that depends on brock-react), and leaves out a shared package that is not installed. A single app is unchanged.
