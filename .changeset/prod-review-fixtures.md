---
'@drizztdourden08/brock-react': patch
---

A production review copies its fixtures. Vite inlines a small file of `src/review/fixtures` as a `data:` URL in a production build, and the renderer's Content Security Policy refused to fetch it, so `launch --prod --review` (the CI review job) failed `fixtures-copied` with a console error. The review now decodes an inlined fixture itself.
