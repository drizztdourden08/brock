# @drizztdourden08/brock

## 0.1.2

### Patch Changes

- Updated dependencies [7f38965]
- Updated dependencies [567636a]
  - @drizztdourden08/brock-build@0.1.2
  - @drizztdourden08/create-brock@0.1.2
  - @drizztdourden08/brock-thread@0.1.2

## 0.1.1

### Patch Changes

- 4a087e8: Tessera now comes from GitHub Packages at ^0.1.0 instead of a sibling checkout, so a fresh clone and CI install without it.
- 97496b7: Apps pin Brock once in `package.json#brock.version`, and sync, adopt and create-brock keep every Brock dependency on it. `brock migrate` runs the migrations Brock packages ship, and `<app> upgrade [version] [--check] [--no-review]` moves an app to a release in its own worktree, proves it with the gate and the headless review, and commits when green. Breaking: BrockApp no longer takes logoSrc or instanceLogoSrc (migration brock-app-logo-src), a non-boolean setting row needs a control (migration base-setting-controls), the built-in About menu entry replaces an app's own (migration menu-built-in-about), and .gitignore gains the files newer Brock generates (migration gitignore-generated-files).
- Updated dependencies [0a52cd7]
- Updated dependencies [568c900]
- Updated dependencies [ade72f8]
- Updated dependencies [9a08468]
- Updated dependencies [f6a334e]
- Updated dependencies [49968cd]
- Updated dependencies [c48024b]
- Updated dependencies [3680727]
- Updated dependencies [e406f70]
- Updated dependencies [fd0a736]
- Updated dependencies [8dec315]
- Updated dependencies [be862b2]
- Updated dependencies [c1c29a0]
- Updated dependencies [bdde234]
- Updated dependencies [8498845]
- Updated dependencies [d78f430]
- Updated dependencies [f62f048]
- Updated dependencies [068a02d]
- Updated dependencies [b1fa12d]
- Updated dependencies [ae6b8e2]
- Updated dependencies [14c3674]
- Updated dependencies [2cc7040]
- Updated dependencies [a8a87be]
- Updated dependencies [e2cf0ee]
- Updated dependencies [97496b7]
  - @drizztdourden08/brock-build@0.1.1
  - @drizztdourden08/brock-thread@0.1.1
  - @drizztdourden08/create-brock@0.1.1
