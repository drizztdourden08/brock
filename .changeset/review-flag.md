---
"@drizztdourden08/brock-core": patch
"@drizztdourden08/brock-electron": patch
"@drizztdourden08/brock-react": patch
"@drizztdourden08/brock-build": patch
---

Every app gets a `--review` automation flag: a headless tour of the shell that captures a screenshot per step, checks the title bar, menu, screens, Escape, palette, bug report, About and widgets, and writes a report with exit code 0 or 1. Escape now closes the title bar menu, palette results draw their icons, About rows keep a gap, and `brock start` launches the app folder so the app version applies.
