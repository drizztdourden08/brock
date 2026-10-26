---
'@drizztdourden08/brock-thread': minor
---

Worktree names can carry a prefix, so two coordination boards that share one checkout stop colliding. Set `worktrees: { prefix: 'web' }` in `defineWorkspace`, the `BROCK_WORKTREE_PREFIX` environment variable, or pass `--prefix` to `worktree create`. `--prefix` wins over the variable, and the variable over the config. `worktree create feat` then makes the folder `web-feat` on the branch `agent/web-feat`, and a name that already starts with the prefix is left as it is. Every worktree verb, `launch` and `pr` accept the name with or without the prefix, and still reach a worktree made before the prefix by its bare name. With no prefix nothing changes.
