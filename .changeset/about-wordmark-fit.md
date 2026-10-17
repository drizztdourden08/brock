---
'@drizztdourden08/brock-react': patch
---

A wide `product.icons.wordmark` now fits the About card. Before, the image frame had a fixed `--size-48` height, so it was as wide as the picture at that height, and the centred heading grew to that width: a wordmark wider than the card was cut on both sides, and at a narrow window the whole panel spilled out of the card. The panel now takes the width it is given, up to `--size-448`, and the image fills it with its height following its proportions up to `--size-48`, centred, so any wordmark fits however wide it is. The review checks it: `about-wordmark-fits` fails when the wordmark's left or right edge passes the card's. The splashes already fitted it and are unchanged.
