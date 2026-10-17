---
'@drizztdourden08/brock-react': patch
'@drizztdourden08/brock-electron': patch
---

Screenshots no longer catch a loading spinner. Each lazy load (a lazy screen, widget, title bar item or tour) now holds the screenshot from its start until it settles and a frame has painted, so `--screenshot` waits for it like any other hold. The review's own captures (`review:capture`, `review:captureWidget`, `review:captureGroup`) now wait for the same holds too, up to 10 s; a hold still open then fails a `capture-holds` check for that step and the capture goes ahead.
