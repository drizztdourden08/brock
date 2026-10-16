---
'@drizztdourden08/brock-react': patch
---

The review's `floating-widget-min` check no longer fails in a small window. A floating widget can't be larger than the main view it floats in, so shrinking it stops at its 240 by 160 minimum or at the main view's size when the view is smaller, and the check now expects that smaller size. Its failure message gives the main view's size. The widget sizing itself is unchanged: it keeps its minimum whenever the main view is big enough, and a widget squeezed by a small window comes back to its saved size when the window grows.
