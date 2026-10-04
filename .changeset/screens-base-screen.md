---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-lint-config': minor
---

A base screen is a file now: `src/screens/<id>.base.tsx`, one per app, default-exports its component (`BaseProps`) with `title` and `icon` in `meta`. `brock sync` lists it, `BrockApp` draws it under every hub, Escape closes down to it and opens `config.home` from it, and `brock structure` rejects a second one, one inside a bucket and one named like a bucket. The `base-screen-file` migration moves a hand `defineScreen` passed through `screens` and `home` into that file, or leaves a to-do naming the file when the screen holds more than a title, an icon and a component.
