---
'@drizztdourden08/brock-react': minor
---

A title bar button spec takes `disabled`. A button with a `command` is disabled while the `when` of that command returns false, and the bar re-reads it each time the component that registers the command renders, so Undo and Redo follow the document. A disabled button ignores clicks. Brock hands Tessera `disabled: true` on the bar action; Tessera 0.52 has no disabled look for title bar actions yet, so the button is not dimmed until it does.
