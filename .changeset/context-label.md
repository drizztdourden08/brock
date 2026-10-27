---
'@drizztdourden08/brock-react': minor
---

A context can carry a label. `contexts.set('session', { active, data, label: 'Sunday run' })` puts the label after the title of every widget bound to that context, so a Players widget reads Players, Sunday run, docked, floating and popped. A changed label updates the titles, and no label keeps the plain title.
