---
'@drizztdourden08/brock-react': patch
---

`JobDialog` sets `data-job-id="<job id>"` on its dialog element, so a test finds the dialog of one job without matching its title. Tessera's `JobDialog` takes no data attributes, so Brock puts it on from its own side.
