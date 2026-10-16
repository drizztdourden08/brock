---
'@drizztdourden08/brock-build': patch
'@drizztdourden08/brock-react': patch
---

Tessera 0.37.1 draws the splash wordmark. `BootFailureSplash` passes `product.icons.wordmark.dark` to Tessera's `Splash` as `wordmark`, so the heading is a real image named by the app name, and its own `BootFailureSplash.css` and wordmark helpers are gone. The static splash page writes `<img class="ts-wordmark">` and drops Brock's `.splash__wordmark` rules for Tessera's. Both splashes look as before. brock-react's Tessera peer range is `^0.37.1`.
