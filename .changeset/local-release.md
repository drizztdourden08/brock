---
'@drizztdourden08/brock-thread': minor
---

Add `brock release --local [--channel latest]`, the release step with no GitHub. It cuts `release/local-<version>`, runs `changeset version`, holds back until the release note passes (exit 2, then run it again), packs every changed public package with `pnpm pack` into `~/.coord/releases/<project>/<channel>/<version>/` with `notes.md` and `release.json` (written last), and opens a local pull request record. It never merges. The last line printed is the `release.json` path.
