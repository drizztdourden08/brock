---
"@drizztdourden08/brock-react": minor
---

Take the tour now sits at the top level of the app menu, just above Credits and About, in every app that has tours. It no longer hides under Advanced, or under Help when the app has a Help group, so new users and a first-run tour can find it at once. An app with several tours still lists them in a submenu of that entry.

To upgrade, check your tour steps. A step that uses `menuEntry: ['Advanced', 'Take the tour']` no longer finds the entry. Use the plain `menuEntry: 'Take the tour'` instead.
