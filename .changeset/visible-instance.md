---
'@drizztdourden08/brock-core': patch
'@drizztdourden08/brock-electron': patch
'@drizztdourden08/brock-react': patch
'@drizztdourden08/brock-thread': patch
---

A visible instance launch now acts like a user launch. `--instance` and `--profile` only pick an identity, so a launch with just those no longer counts as an automation launch: `worktree launch <name> none --visible` shows the start-up prompts, the first-run tour, the dialogs and the folder questions, and the window is held on close like any app window. A hidden launch still passes `--no-focus` and stays automated. A named instance still takes no single-instance lock, writes no window state, no last profile and no Linux desktop entry. Upgrading: an app that relied on `--instance` alone to silence prompts must pass `--no-focus` or another automation flag too.
