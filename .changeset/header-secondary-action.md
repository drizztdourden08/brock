---
"@drizztdourden08/brock-react": minor
---

A page header can now show a secondary button next to the primary one. Declare `header: { secondary: { label, icon?, open }, primary, search }` in a page's meta, or pass `secondary={{ label, icon, onClick }}` to `PageActions`. It has the same shape as `primary`, draws as a secondary Tessera button just left of the primary button, and is absent when unset. The tour target `{ shell: 'primary' }` still lights the primary button only.
