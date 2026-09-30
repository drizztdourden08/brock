---
"@drizztdourden08/brock-react": patch
"@drizztdourden08/brock-build": patch
"@drizztdourden08/brock-lint-config": patch
"@drizztdourden08/create-brock": patch
---

Screens by convention: files in src/screens become bucket hubs, pages, tabs, settings pages, cards and custom screens through a generated .brock/screens.ts, with the menu, bucket switch, Escape home and settings placement read from screens.config.ts. brock structure checks the layout, the review opens every generated screen, and the template app uses it.
