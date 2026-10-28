---
"@drizztdourden08/brock-thread": patch
---

Fix three things in `worktree remove`. Git's "Function not implemented" error is no longer shown when Brock's own delete handles the folder; it prints one plain line, and git's message only if the removal fails. It now deletes the branch of an upgrade throwaway (`brock-<version>`, with only `Upgrade Brock to <version>` commits) even when it was never pushed. `worktree remove <path>` clears a leftover folder under the worktrees folder that git no longer lists, without following links or touching anything outside it.
