---
"@drizztdourden08/brock-react": minor
---

The browser host detects a phone. It reported `formFactor: 'desktop'` everywhere; it now reports `formFactor: 'mobile'` where a coarse pointer meets a narrow viewport (at most 767 px wide, or 500 px high for a phone held sideways) and `input: 'touch'` for a coarse pointer, and `PlatformProvider` follows both media queries, so the info changes with the viewport. `when` rules on `formFactor`, mobile-only settings tabs, the `platform-mobile` class and the search index now work in a phone's browser as they do in the Capacitor app.
