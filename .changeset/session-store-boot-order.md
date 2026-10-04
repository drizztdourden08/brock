---
'@drizztdourden08/brock-react': patch
---

A renderer boot task that fills a session store must run `after: ['settings']`, because the profile hydration resets every session store before `settings` resolves; the architecture Boot section and the brock-react README now say so. In development the renderer boot warns in the app log when that reset wipes a session store something already filled, naming the app and module tasks that can run before `settings`.
