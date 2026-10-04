---
'@drizztdourden08/brock-react': patch
'@drizztdourden08/brock-build': patch
---

Widgets use Tessera's body padding and fill: the Performance widget drops its own padding, the Logs widget uses `padding: 'none'`, `fill` and LogPanel `height="fill"`, and widget `meta` accepts `padding` and `fill`.
