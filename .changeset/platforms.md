---
"@drizztdourden08/brock-build": patch
"@drizztdourden08/create-brock": patch
"@drizztdourden08/brock-thread": patch
"@drizztdourden08/brock-core": patch
"@drizztdourden08/brock-input": patch
---

Platforms are separate ids (windows, macos, linux, android, web, with ios reserved) and bundles (desktop, mobile) in `targets`. Each one is a strategy with doctor checks, scaffold steps, CI and release jobs and secrets. `brock sync` composes `ci.yml` (lint, structure, tests and the headless review on Linux) and `release.yml` from them. create-brock asks for the platforms or takes `--platforms`; `platform add`, `remove` and `list`, `doctor` and `web build` are new commands. Android gets a Capacitor project in `mobile/android` with signing from the environment, `mobile build --release` and `mobile keystore`; Linux debs install module udev rules.
