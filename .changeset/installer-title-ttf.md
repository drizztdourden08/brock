---
'@drizztdourden08/brock-build': patch
---

The Setup splash sets the app name in Tessera's TrueType title font, `fonts/chakra-petch/chakra-petch-latin-600-normal.ttf`, which Tessera 0.21 ships beside the WOFF2 file. resvg loads it straight from the package with the system fonts, by the family it declares, `Chakra Petch SemiBold`, so Brock's own WOFF2 to TrueType converter is gone. Segoe UI stays the fallback.
