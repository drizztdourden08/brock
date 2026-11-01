# Test clean-up: packages/build and packages/create-brock

Verdicts against `ai-config/docs/test-standard.md`. A case is one `it` or `test` call.
Branch: test-cleanup/build. Nothing was run in this pass (no tests, lint or typecheck); the
lead's checker runs them.

## Counts

| | before | after |
|---|---|---|
| files | 166 | 133 |
| cases | 1025 | 676 |
| tagged critical | 0 | 518 |
| tagged standard | 0 | 79 |
| tagged e2e | 0 | 79 |

Verdicts: 50 keep, 83 trim, 33 delete. No test was tagged before this pass.

Rules used for deletes: W10 for per-migration tests (every migration up to 0.97.1 has
shipped, the package is 0.116.0), W1 for tests that assert generated or source text, W4 for
extra states of one behavior, W5 for constants and re-exports, W6 for mock-call-only tests.
Tests that spawn a process, run a real build or use real git are tagged e2e (E2) or deleted.
Codemod tests that load the TypeScript compiler are tagged standard.

## Verdicts

| file | verdict | rule | cases before | cases after |
|---|---|---|---|---|
| adopt-gitignore.keep.test.mjs | keep | K3 | 2 | 2 |
| adopt-knip-config.keep.test.mjs | trim | K1+K3 | 6 | 4 |
| adopt-tessera-config.keep.test.mjs | trim | K2+K3 | 9 | 7 |
| android-back-edge.keep.test.mjs | trim | K3 | 3 | 2 |
| android-module-sides.keep.test.mjs | trim | K1 | 8 | 4 |
| app-config-options.keep.test.mjs | keep | K1+K4 | 11 | 11 |
| app-gate.keep.test.mjs | trim | K1+K4 | 11 | 7 |
| app-look-cache.keep.test.mjs | keep | K1 | 5 | 5 |
| app-theme-css.keep.test.mjs | trim | K1 | 11 | 9 |
| attest-per-file.keep.test.mjs | trim | K2 | 5 | 3 |
| base-screen-migration.keep.test.ts | delete | W10 | 3 | 0 |
| brand-icons-record.keep.test.mjs | keep | K1 | 4 | 4 |
| brand-ignores.keep.test.mjs | keep | K3 | 6 | 6 |
| brand-palette.keep.test.mjs | trim | K2 | 5 | 2 |
| brand-rim-icons.keep.test.mjs | keep | K1 | 3 | 3 |
| bridge-protocol-2-migration.keep.test.mjs | delete | W10 | 3 | 0 |
| brock-compounds-migration.keep.test.ts | delete | W10 | 5 | 0 |
| brock-dir-type-checked-migration.keep.test.mjs | delete | W10 | 3 | 0 |
| brock-palette-migration.keep.test.ts | delete | W10 | 3 | 0 |
| brock-pin.keep.test.ts | trim | K3 | 7 | 5 |
| bucket-backdrop-file.keep.test.mjs | keep | K1 | 4 | 4 |
| build-options.keep.test.mjs | trim | K1+K2 | 11 | 10 |
| build-reuse-plugin.keep.test.mjs | trim | K1 | 10 | 5 |
| build-reuse-portable.keep.test.mjs | trim | K1 | 4 | 3 |
| build-reuse.keep.test.mjs | keep | K1 | 9 | 9 |
| build-stale.keep.test.mjs | keep | K1 | 4 | 4 |
| capacitor-config-scripts.keep.test.mjs | keep | K4 | 2 | 2 |
| catalog-yaml-quote.keep.test.mjs | trim | K1+K3 | 7 | 5 |
| compose-workflows.keep.test.ts | trim | K1 | 12 | 5 |
| controller-components-migration.keep.test.ts | delete | W10 | 4 | 0 |
| controllers-bucket-migration.keep.test.ts | delete | W10 | 5 | 0 |
| convention-constants-files.keep.test.mjs | trim | K1 | 4 | 2 |
| core-date-helpers.keep.test.mjs | delete | W10 | 2 | 0 |
| declared-externals-cache.keep.test.mjs | keep | K1+K4 | 2 | 2 |
| design-package-migration.keep.test.mjs | trim | K1 | 7 | 2 |
| dev-only-surfaces.keep.test.mjs | trim | K1+E2 | 9 | 7 |
| dock-hero-migrations.keep.test.ts | delete | W10 | 2 | 0 |
| doctor-report.keep.test.ts | keep | K1 | 4 | 4 |
| documents-access-async.keep.test.mjs | delete | W10 | 2 | 0 |
| drop-window-groups-migration.keep.test.ts | delete | W10 | 1 | 0 |
| electron-fuses.keep.test.mjs | trim | K4 | 5 | 4 |
| ensure-electron-never-forces.keep.test.mjs | trim | K3+K4 | 3 | 2 |
| ensure-synced-later.keep.test.mjs | keep | K1+K3 | 3 | 3 |
| escape-to-removed.keep.test.mjs | delete | W10 | 2 | 0 |
| filetype-icons-real-brand.keep.test.mjs | trim | S4 | 3 | 2 |
| filetype-icons.keep.test.mjs | keep | K1+K2 | 6 | 6 |
| first-adoption.keep.test.mjs | keep | K1+K4 | 4 | 4 |
| gate-cargo.keep.test.mjs | trim | K1+E2 | 17 | 14 |
| guide-parts.keep.test.mjs | keep | K1 | 2 | 2 |
| guide-problems.keep.test.mjs | keep | K3 | 3 | 3 |
| guide-run-dirs.keep.test.mjs | keep | K1+S2 | 4 | 4 |
| half-build.keep.test.mjs | keep | K1+K4 | 5 | 5 |
| handlers-review-sync.keep.test.mjs | trim | K1 | 4 | 3 |
| helper-build.keep.test.mjs | keep | E2+K1 | 3 | 3 |
| hero-kinds-migration.keep.test.ts | delete | W10 | 1 | 0 |
| hub-page-header-off.keep.test.mjs | delete | W10 | 4 | 0 |
| import-specifiers.keep.test.mjs | keep | K1 | 4 | 4 |
| installer-template.keep.test.mjs | trim | K1+K2+K4 | 21 | 18 |
| knip-app-scope.keep.test.mjs | keep | E2+K1 | 3 | 3 |
| knip-brock-dependencies.keep.test.mjs | keep | K1+E2 | 5 | 5 |
| launch-app-for-test.keep.test.mjs | trim | K3 | 3 | 2 |
| launch-waits-for-prewarm.keep.test.mjs | delete | W6 | 2 | 0 |
| lazy-registries.keep.test.mjs | keep | K1+E2 | 7 | 7 |
| light-ground-removed.keep.test.mjs | delete | W10 | 3 | 0 |
| lint-batches.keep.test.mjs | trim | K1+E2 | 11 | 8 |
| lint-cheap.keep.test.mjs | trim | K1+E2 | 13 | 9 |
| live-pages-scan.keep.test.mjs | trim | K1 | 5 | 3 |
| main-context-window-show.keep.test.mjs | delete | W10 | 5 | 0 |
| main-module-path.keep.test.mjs | trim | E2 | 2 | 1 |
| main-process-guard.keep.test.mjs | trim | K4 | 10 | 6 |
| markdownlint-config-in-apps.keep.test.mjs | trim | K1+S2 | 5 | 4 |
| menu-config-problems.keep.test.mjs | trim | K1 | 7 | 6 |
| migration-folder-version.keep.test.mjs | delete | W1 | 1 | 0 |
| optimize-deps.keep.test.mjs | keep | K1 | 7 | 7 |
| os-integration-packaging.keep.test.mjs | keep | K2 | 9 | 9 |
| package-icons.keep.test.mjs | keep | K1 | 2 | 2 |
| platform-targets.keep.test.ts | keep | K1+K3 | 7 | 7 |
| prewarm-deps-skip.keep.test.mjs | keep | S2 | 3 | 3 |
| prose-generated-files.keep.test.mjs | delete | W2 | 4 | 0 |
| publish-packages.keep.test.mjs | trim | K1+K2+K3+K4+E2 | 21 | 15 |
| published-package-names.keep.test.mjs | trim | K1 | 5 | 3 |
| release-notes.keep.test.mjs | trim | K1 | 9 | 5 |
| release-step-permissions.keep.test.mjs | trim | K4 | 11 | 7 |
| release-tag-step.keep.test.mjs | keep | E2 | 2 | 2 |
| release-workflow-logic.keep.test.ts | trim | K1+E2 | 12 | 8 |
| repo-owner.keep.test.mjs | keep | K1 | 3 | 3 |
| resolve-app-dir.keep.test.mjs | trim | K1 | 7 | 5 |
| run-one-migration.keep.test.mjs | trim | K1 | 2 | 1 |
| screen-kinds-scan.keep.test.mjs | trim | K1 | 4 | 2 |
| screen-settings-migrations.keep.test.ts | delete | W10 | 4 | 0 |
| screens-scan.keep.test.mjs | trim | K1 | 15 | 11 |
| screens-search-meta.keep.test.mjs | keep | K1 | 2 | 2 |
| server-app.keep.test.mjs | keep | K1+K4 | 8 | 8 |
| server-build.keep.test.mjs | trim | E2+K4 | 9 | 6 |
| server-cjs-globals.keep.test.mjs | trim | E2 | 2 | 1 |
| server-config-types.keep.test.ts | delete | W5 | 1 | 0 |
| server-hardening.keep.test.mjs | trim | K4 | 17 | 12 |
| server-managed-files.keep.test.mjs | trim | K2+K3 | 6 | 3 |
| server-options.keep.test.mjs | keep | K1 | 4 | 4 |
| server-packaging.keep.test.mjs | trim | K2 | 8 | 6 |
| server-scaffold.keep.test.mjs | trim | E2 | 10 | 3 |
| server-staging.keep.test.mjs | trim | K2+K4 | 11 | 10 |
| server-starter.keep.test.mjs | keep | K3 | 5 | 5 |
| server-workflows.keep.test.mjs | trim | K1+K4 | 25 | 12 |
| setting-action-tone-migration.keep.test.ts | delete | W10 | 5 | 0 |
| settings-function-seeds.keep.test.mjs | keep | K1 | 4 | 4 |
| setup-splash.keep.test.mjs | trim | K1+K4 | 10 | 9 |
| shared-build-no-vite.keep.test.mjs | keep | E2 | 3 | 3 |
| shared-build-placed.keep.test.mjs | keep | E2+K1 | 3 | 3 |
| shared-build.keep.test.mjs | trim | E2+K1 | 7 | 5 |
| shared-deps-cache.keep.test.mjs | trim | K1+K3+S3 | 11 | 10 |
| shared-deps-start.keep.test.mjs | trim | E2 | 2 | 1 |
| shared-deps-store-path.keep.test.mjs | keep | K1 | 3 | 3 |
| shared-deps-vite.keep.test.mjs | trim | E2 | 2 | 1 |
| shortcut-helpers-removed.keep.test.mjs | delete | W10 | 3 | 0 |
| silhouette-from-tessera-migration.keep.test.mjs | delete | W10 | 3 | 0 |
| site-apps.keep.test.mjs | trim | K1+S2 | 10 | 10 |
| site-options.keep.test.mjs | trim | K1+K4+K2 | 7 | 7 |
| site-routes.keep.test.mjs | trim | E2+K1 | 16 | 10 |
| splash-page.keep.test.mjs | trim | K4+K1+K2 | 13 | 3 |
| standards-extension.keep.test.mjs | trim | K1 | 8 | 6 |
| standards-lint-deps.keep.test.ts | delete | W10 | 1 | 0 |
| startup-files.keep.test.mjs | trim | K2+K1 | 8 | 5 |
| template-brand.keep.test.mjs | trim | K1 | 2 | 1 |
| tessera-command.keep.test.mjs | keep | K2+S3 | 4 | 4 |
| tessera-config-keys.keep.test.mjs | keep | K1+S4+S2 | 9 | 9 |
| tessera-copy-map.keep.test.mjs | keep | K1 | 3 | 3 |
| tessera-copy.keep.test.mjs | trim | E2+K4 | 8 | 7 |
| tessera-entry.keep.test.mjs | keep | K1+K5 | 2 | 2 |
| tessera-menu-migrations.keep.test.ts | delete | W10 | 2 | 0 |
| tessera-mismatch.keep.test.mjs | keep | K1 | 5 | 5 |
| tessera-moves.keep.test.mjs | trim | K1 | 12 | 10 |
| tessera-part-moves-migration.keep.test.ts | delete | W10 | 13 | 0 |
| tessera-removed-members.keep.test.mjs | keep | K1 | 3 | 3 |
| tessera-renames-code.keep.test.mjs | keep | K1+K3 | 7 | 7 |
| tessera-renames.keep.test.mjs | keep | K1+K3+K2 | 10 | 10 |
| tessera-typed-properties.keep.test.mjs | trim | K1 | 7 | 6 |
| tessera-usage-renames.keep.test.mjs | trim | K1 | 7 | 5 |
| tessera-wildcard-props.keep.test.mjs | trim | K1 | 7 | 5 |
| test-env-workflows.keep.test.mjs | trim | K2+K4 | 7 | 5 |
| testing-helpers.keep.test.mjs | trim | K1 | 8 | 7 |
| title-bar-actions-migration.keep.test.ts | delete | W10 | 6 | 0 |
| title-bar-files.keep.test.mjs | trim | K1 | 6 | 3 |
| title-font.keep.test.mjs | trim | K1 | 3 | 1 |
| toolbar-files.keep.test.mjs | trim | K1 | 8 | 2 |
| tooling-migrations.keep.test.ts | delete | W10 | 17 | 0 |
| tour-files.keep.test.mjs | trim | K1 | 8 | 4 |
| update-badge-migration.keep.test.ts | delete | W10 | 1 | 0 |
| upgrade-migrations.keep.test.ts | trim | K1 | 14 | 4 |
| verbatim-report.keep.test.mjs | keep | K2 | 2 | 2 |
| vitest-config.keep.test.mjs | trim | K3+E2 | 3 | 2 |
| vitest-workspace-root.keep.test.mjs | trim | K1+E2 | 3 | 2 |
| volume-item-labels.keep.test.mjs | delete | W10 | 3 | 0 |
| widget-files.keep.test.mjs | delete | W10 | 8 | 0 |
| widget-kit-files.keep.test.mjs | trim | K1 | 7 | 3 |
| widget-layout-file.keep.test.mjs | trim | K1 | 6 | 2 |
| wordmark-height-warnings.keep.test.mjs | trim | K1 | 6 | 5 |
| workflow-config-types.keep.test.ts | delete | W2 | 2 | 0 |
| workflow-ownership.keep.test.mjs | trim | K1 | 8 | 6 |
| workflow-steps.keep.test.mjs | trim | K1 | 14 | 13 |
| workflows-tracked.keep.test.mjs | trim | K1+K3+E2 | 8 | 5 |
| workspace-scaffold.keep.test.mjs | trim | K3+K1 | 4 | 2 |
| workspace-shared-steps.keep.test.mjs | trim | K1 | 4 | 3 |
| workspace-targets.keep.test.mjs | keep | K1 | 4 | 4 |
| workspace-workflows.keep.test.mjs | trim | K1+K3 | 12 | 9 |
| write-changed-line-endings.keep.test.mjs | keep | K3 | 4 | 4 |

The last three create-brock files are server-scaffold, template-brand and workspace-scaffold; all other rows are in packages/build/tests.

## Critical deleted

Deleted cases that touched K1 to K5 logic, each with the reason it is safe to drop.

- app-gate.keep.test.mjs: lists the files that differ, rewrites them, then passes - ran real clang-format only when installed (machine luck); runner exit code and summary line no longer tested, an e2e case could be re-added
- app-gate.keep.test.mjs: leaves code written in the house style as it is - tests clang-format itself against the managed style, skipped without the tool
- app-gate.keep.test.mjs: names the package to pin when there is none - only an error message, and the path spawns clang-format --version
- android-module-sides.keep.test.mjs: match each native method of Sdl3Bridge with a JNI export of the same package - reads Java and C source text (W1); a mismatch would crash on device, no other test checks it
- android-module-sides.keep.test.mjs: register the plugin names the renderer looks up - reads source text of plugin and constants files (W1)
- android-back-edge.keep.test.mjs: runs in the Android scaffold and names the event the Capacitor host listens for - reads the react host source for the event name (W1); drift would silently drop the back gesture
- adopt-tessera-config.keep.test.mjs: points $schema into the package that installs Tessera - same schema-path logic as the kept app/root case
- adopt-tessera-config.keep.test.mjs: keeps each app views in its own src for a monorepo with no design package yet - state variant of the monorepo case plus a console prose check
- app-theme-css.keep.test.mjs: keeps src/theme.css for a config that holds only $schema - same fallback branch as the no-config case
- app-theme-css.keep.test.mjs: falls back to src/theme.css with a Tessera that has no config entry - compatibility with a Tessera older than the required 0.46
- attest-per-file.keep.test.mjs: expands the globs once, drops bundles and repeats - asserts text lines of a generated shell script (W1)
- attest-per-file.keep.test.mjs: writes each bundle beside its own file - asserts generated env and shell text (W1)
- build-reuse-plugin.keep.test.mjs: builds again when the config key changes - reuseKey unit tests already cover a config change
- build-reuse-plugin.keep.test.mjs: builds again for another mode, and when the env file of the mode changes - real Vite build per case; only the env value case stays e2e
- build-reuse-plugin.keep.test.mjs: builds again for other build options - options are part of the reuse key, covered by reuseKey logic
- build-reuse-plugin.keep.test.mjs: builds again when the package.json of a bundled dependency changes its entry - real Vite build; module stamp unit tests cover file changes
- build-reuse-plugin.keep.test.mjs: builds again when a file the config imports changes - real Vite build; same stamp path as module changes
- build-reuse-portable.keep.test.mjs: builds again when an untracked file appears beside a module and shadows its import - same shadow-import rule is kept as e2e in build-reuse-plugin
- catalog-yaml-quote.keep.test.mjs: quotes what a plain scalar cannot hold - exact quoting forms; the round trip through a YAML parser still guards correctness
- catalog-yaml-quote.keep.test.mjs: quotes a value YAML would read as another type - the round trip case already includes 1.2 and other type-ambiguous values
- build-options.keep.test.mjs: a renderer build with a module worker, an extra alias and public/wasm - real Vite build that mostly tests Vite itself (W5)
- convention-constants-files.keep.test.mjs: src/title-bar takes the file lint names beside an item - same rule as the widgets case (W4)
- convention-constants-files.keep.test.mjs: a module folder takes <id>.<kind>.constants.ts - only repeats the structure rule findings (W2)
- compose-workflows.keep.test.ts: runs every action on its Node 24 major and lets packageManager pick pnpm - asserts generated YAML text (W1); an action version drift is not caught by another test
- compose-workflows.keep.test.ts: runs CI on a push to the default branch too, and cancels only pull request runs - asserts generated YAML text (W1)
- launch-waits-for-prewarm.keep.test.mjs: every launch waits for a running prewarm (2 cases) - only asserted a mocked afterPrewarm was called; a real race (launch during prewarm) is not exercised either way, W6
- gate-cargo.keep.test.mjs: fails the gate on a comment even though every cargo step passes - rustCommentProblems and runRustComments stay critical-tested; only the runGate wiring of the comment step is unchecked (needed a spawn)
- gate-cargo.keep.test.mjs: finds cargo on PATH - skipped on win32 and spawned a shell script; the cargo-missing e2e and gateSteps cover findCargo's outcome
- gate-cargo.keep.test.mjs: ships the thresholds of the TypeScript rules - asserted the text of a shipped clippy.toml (constant, W5)
- gate-cargo.keep.test.mjs: clippy default CLIPPY_CONF_DIR via the spawned gate, and clippyArgs/path via spawned cargo (assertions moved to the gateSteps step objects, same facts) - not lost: same facts kept on pure gateSteps
- electron-fuses.keep.test.mjs: keeps the hidden folders of a linked package out of the asar - asserted one string in the builder files list (constant); a regression there would only show in a real pack, which e2e packaging covers
- ensure-electron-never-forces.keep.test.mjs: names the app folder as the install folder when the app is the repo - only checked the wording of the message; the never-force behavior stays in the other two cases
- handlers-review-sync.keep.test.mjs: treats a change in either folder as a reason to sync again - asserted the SYNC_INPUTS constant (W5); a lost folder would leave .brock stale until the next full sync
- dev-only-surfaces.keep.test.mjs: keeps them out of .brock/screens.ts and .brock/search.ts - asserted generated text lines; the production-build e2e proves dev screens are absent from the bundle
- dev-only-surfaces.keep.test.mjs: lists <subject>-handlers.dev.ts in .brock/handlers.main.dev.ts - asserted generated text lines; the production-build e2e covers the dev handler group
- live-pages-scan.keep.test.mjs: is imported at boot and hands its hook to the tree as usePages - asserted generated screens.ts text (W1); scan result for a live page is still tested
- live-pages-scan.keep.test.mjs: feeds the search seed with its title, icon and keywords - asserted generated search.ts text (W1)
- lint-cheap.keep.test.mjs: names the changed files and the merge base - real git plan line; same merge-base file list is kept in the e2e changedFiles case
- lint-cheap.keep.test.mjs: lints the whole tree in CI and says how many files it holds - real git; full-tree listing kept as an e2e in lint-batches
- lint-cheap.keep.test.mjs: has nothing to lint when nothing changed - real git checkout/clean; the empty-list branch of planLint is no longer tested (worst case: lint runs a pointless empty target list)
- lint-cheap.keep.test.mjs: reports why it cannot tell outside a git work tree or without a base branch - real git; the not-a-work-tree fallback stays as an e2e via planLint
- lint-batches.keep.test.mjs: lints "." in one run when git cannot list the tree - duplicate of the lint-cheap fallback case, spawned git
- lint-batches.keep.test.mjs: does not batch a run on named files - trivial paths-mode branch; git init was only scaffolding
- lint-batches.keep.test.mjs: lets BROCK_LINT_MEMORY_MB and a NODE_OPTIONS heap flag win over the full-tree default - same heavyNodeEnv overrides are kept in lint-cheap (BROCK_LINT_MEMORY_MB and user heap flag cases)
- main-module-path.keep.test.mjs: names the main entry as a build input, not a library - config shape (W2/W5); the e2e build proves the worker output works
- main-process-guard.keep.test.mjs: fails a Tessera import and its subpaths; prints the chain through a shared package; leaves a package alone until forbidden; reports each forbidden target once and counts the rest - same guard code path as the kept direct, transitive, forbid-glob and allow cases (W4)
- markdownlint-config-in-apps.keep.test.mjs: still leaves the eslint and stylelint configs to the root - asserted constant list membership (W5); rootOwnedTargets markdownlint decision is tested
- menu-config-problems.keep.test.mjs: moves and hides View like any entry - permutations of one allowed-entry rule (W4), covered by the passes-valid-config case
- installer-template.keep.test.mjs: installerTheme reads the resolved dark theme from tokens.json, lower cased - covered by the palette case (same read path, lower-casing asserted there)
- installer-template.keep.test.mjs: stubColours takes the text colour for the gradient from the look - covered by the first stubColours case (ink asserted in the full table)
- installer-template.keep.test.mjs: stubProductHeader writes every colour, the gradient and the angle as macros - asserted macro text lines (W1/W3); escaping and flag cases kept
- launch-app-for-test.keep.test.mjs: exports waitForAppPage and pageKindOf - re-export/typeof check (W5)
- filetype-icons-real-brand.keep.test.mjs: ships one folder per Bxel extension with an ico, an icns, an svg and the sizes - asserted Tessera's package contents; the kept real-brand copy test fails if any file is missing
- prose-generated-files.keep.test.mjs: whole file (4 cases: hand written file named, generated config skipped, root config read, git env restored) - needs a real git repo and child process so it cannot be critical; the exclusion list is also exercised by the prose gate on every repo
- publish-packages.keep.test.mjs: refuses the same bad packages as the release job - same refusal code path as the kept K4 refusals in the workflows.publish refusals describe
- publish-packages.keep.test.mjs: has no needs and no checkout ref, shares permissions with the release job - job permissions stay covered by the kept "grants contents read and packages write to that job only" case
- resolve-app-dir.keep.test.mjs: runs the cli command from apps/desktop/src and from the repo root - spawned the CLI; resolveAppDir cases in the same file cover the resolution logic
- resolve-app-dir.keep.test.mjs: stops the cli with the app list when two apps are there - spawned the CLI; the kept "fails and lists the apps" case covers the same throw
- server-build.keep.test.mjs: keeps refusing an addon the app itself loads, even when a package is listed - real Vite build; same refusal as the kept native .node addon e2e case
- server-build.keep.test.mjs: honours server.entry - real build; serverEntry resolution is kept as a critical unit case
- server-cjs-globals.keep.test.mjs: does the same in a helper bundle - real build; helper bundles share the node bundle config exercised by the kept server case
- server-hardening.keep.test.mjs: is valid shell (sh -n on postinst) - spawned sh; the kept postinst cases assert the safety checks, and Brock's CI packages a real deb
- server-hardening.keep.test.mjs: stops sync on a reserved id - same serverOptions throw as the kept reserved-id case
- server-hardening.keep.test.mjs: enables and starts only on a first install, only try-restarts on an upgrade - text of a generated script (W1); no executable check existed
- server-managed-files.keep.test.mjs: renders postinst and prerm with the system user and the service - text of generated scripts; account refusal checks are kept in server-hardening
- server-packaging.keep.test.mjs: stops when SHASUMS256.txt disagrees with the pin and writes no tarball - same fetchNodeBinary refusal is kept in server-hardening
- server-packaging.keep.test.mjs: lays out /opt, the unit, the wrapper and the maintainer scripts in the deb tree - deb tree file list; the kept deb case asserts control, postinst and wrapper content
- server-staging.keep.test.mjs: refuses a version that SHASUMS256.txt does not list - sibling of the kept checksum mismatch refusal, same fetch path
- server-workflows.keep.test.mjs: a desktop-only app keeps its workflows byte for byte (3 fixtures) - byte compare of generated yaml (W1); the kept job-list case still shows no server job leaks into desktop apps
- server-workflows.keep.test.mjs: release body links, image job step shape, latest tag, arm64 text, smoke script text - generated yaml text (W1/W3); permissions, SHA pins, QEMU order and job graph are kept
- release-workflow-logic.keep.test.ts: checks the release note in prepare and in CI, and tags only after every build - asserted run strings; git tag/push confined to the release job is no longer asserted
- release-step-permissions.keep.test.mjs: attest: sigstore bundle copy lines, linux-only attest steps, workflow without attest - generated yaml text (W1); permissions, SHA pin, ordering and refusals are kept
- release-notes.keep.test.mjs: prefers the app folder when both hold notes - overlaps the kept fallback and multi-app cases
- published-package-names.keep.test.mjs: wrong subject on a published package; app scope kept when nothing is published - same naming rule as the kept refusal case
- shared-build.keep.test.mjs: keeps an older variant beside a newer one - variant retention only affects cache hit rate, a wrong variant still misses on the changed-file tests
- shared-deps-cache.keep.test.mjs: depsBuildKey gives the same key and starts with the platform - key stability is implied by the store/restore round trips and the moves-with test
- shared-deps-start.keep.test.mjs: is not ready, and Vite bundles, when only another key has an entry - key mismatch is covered by shared-deps-cache misses and store-path key tests
- shared-deps-vite.keep.test.mjs: keys two roots the same and another lockfile apart - covered by store-path key tests and shared-deps-cache depsBuildKey
- site-routes.keep.test.mjs: adds the title and the description when the page has none - injection branch only for pages without head tags, template page always has them; low risk
- site-routes.keep.test.mjs: refuses the path rows 'privacy/', 'a/../b', '-privacy', 'a b' - same validation branch as the kept rows, only boundaries kept
- splash-page.keep.test.mjs: builds the page with the dark ground wordmark of product.icons.wordmark - dark wordmark choice also covered by setup-splash wordmarkSourceOf test
- splash-page.keep.test.mjs: leaves the dark ground to the Tessera palette for a branded app - lookProperties test keeps the dark-only-for-own-colours rule, plugin only forwards it
- startup-files.keep.test.mjs: counts src/startup as a sync input - one constant; a missing entry would show as stale .brock after a new prompt, caught by the freshness tests
- tessera-copy.keep.test.mjs: turns the copy's Badge into Status, never into Tessera's Badge - per-entry rename; the Stepper case keeps the same engine path (names, attributes, import merge)
- tessera-moves.keep.test.mjs: tessera-tier-moves migration and the moves replay together (2 cases) - the migration is a one-off that shipped; importMoves and the replay keep their own idempotency tests
- tessera-typed-properties.keep.test.mjs: array-of-Tessera-type prop rename - same typed-context engine path as the return, argument and JSX cases that stay
- tessera-usage-renames.keep.test.mjs: note-in-place-of-name becomes a to-do; second replay changes nothing - to-do mechanism and replay idempotency are still asserted in the typed-properties and wildcard-props tests
- tessera-wildcard-props.keep.test.mjs: exact note stays its own to-do; second replay changes nothing - the surviving wildcard test already counts every to-do line (7) and the typed-properties test covers replay
- test-env-workflows.keep.test.mjs: sysctl step in quality and review job; userNamespaces alone - generated step text only; the option validation and quality-job placement tests stay
- upgrade-migrations.keep.test.ts: runner second-run no-op and layer-file-exists refusal (custom-layer-rename) - both ran through one-off migrations that shipped long ago; runner version selection and ordering stay
- vitest-workspace-root.keep.test.mjs: render when the app lacks Tessera - variant of the kept real-run test (W4)
- vitest-config.keep.test.mjs: config only for an app with a test script (no-script case) - the kept sync test covers the written and hand-written-left-alone paths
- widget-kit-files.keep.test.mjs: .brock/widget-kits.ts written empty for every app - the kept accepts-a-kit test reads the same renderWidgetsFiles pair
- widget-layout-file.keep.test.mjs: stray non-widget file reported - check findings for strays stay asserted in toolbar, tour and title-bar checks and in the kit test
- workflow-ownership.keep.test.mjs: Velopack delta fetch before Package, small installer - generated release step order text (W3), no logic branch
- workflows-tracked.keep.test.mjs: brock adopt puts !.github/ after .*/ - keepGithubTracked unit test covers the same ordering rule
- workspace-shared-steps.keep.test.mjs: shared ci.yml left alone when brock.workspace.mjs owns it - same sharedWorkflows own-ci path is asserted in workflow-ownership
- workspace-workflows.keep.test.mjs: PR-gated changed job; tag prefix and notes path of a second app; root-app notes - generated YAML text (W3); the notes folder choice and prefix requirement stay
- server-scaffold.keep.test.mjs: main/start text, brock.config record, tsconfig/knip entries, server jobs in workflows, boot-task embed, desktop deps, desktop alone - generated file text (W1/W3); file set and dependency pruning for server and desktop+server stay
- workspace-scaffold.keep.test.mjs: tesseraRange equals the brock-react peer; member keeps markdownlint config - reads package.json and template files (W1)
