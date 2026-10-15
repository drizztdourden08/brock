---
'@drizztdourden08/brock-react': minor
---

The Storage page works on a phone: `<BrockApp dataDomains>` gives the renderer the app's data domains, the Capacitor storage port sums each one through the Filesystem plugin, and the page shows the data folder and each domain's size and item count with no action the phone cannot run. `setDataDomains` and `rendererDataDomains` are exported.
