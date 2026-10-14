---
'@drizztdourden08/brock-react': minor
---

`meta.keepMounted` on a hub page keeps it mounted, hidden, while another page of the same hub is open, so a running view keeps its state when the user looks at another page and comes back. On a card screen the same meta sets the screen's `keepMounted`.
