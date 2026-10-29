---
'@drizztdourden08/brock-input': patch
'@drizztdourden08/build-cache': patch
---

Cache the verified SDL3 addon prebuilt per machine and never download it in local mode. The postinstall and the prepare step first look in the build cache (a new `addon-prebuilt` entry kind, keyed by the release tag, the asset name and the platform), check the archive SHA-256 and unpack it with no network. In local mode a cache miss logs one line and falls back to a source build or the addon already on disk; in remote mode it downloads as before and stores the verified archive. `@drizztdourden08/build-cache` gains a `./store` export that loads no compiler.
