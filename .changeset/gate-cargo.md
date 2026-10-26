---
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-thread': patch
---

Add a cargo lane to `brock gate`. While a `Cargo.toml` with a `[workspace]` or `[package]` table sits at the repo root, the gate checks the Rust comments, then runs `cargo fmt --all -- --check`, `cargo clippy --workspace --all-targets` and `cargo test --workspace`, each reported like the other steps. Clippy runs with `-D warnings` and with the `too_many_lines` and `cognitive_complexity` lints on, held to 60 lines and a complexity of 10 by a `clippy.toml` that Brock applies when the repo has none of its own. The comment check fails any `//` or `/* */` comment in a `.rs` file with its `file:line`, and allows `///`, `//!` and a `// SAFETY:` line directly above `unsafe`. A missing cargo fails the lane with a clear message. `gate.cargo` turns the lane off (`enabled: false`), moves it (`path`) or adds clippy flags (`clippyArgs`). A repo with no Brock app can now run `brock gate`: it reads `gate` from `brock.workspace.mjs`, or runs the cargo lane alone when the root has a `Cargo.toml`.
