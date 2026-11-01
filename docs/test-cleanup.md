# Test clean-up

Verdicts against the shared test standard. A case is one `it` or `test` call site; an `it.each` counts as one. Nothing was run in this pass (no tests, lint or typecheck); the checker runs them.
Branch: test-cleanup/all.

## Counts for the whole repo

| | before | after |
|---|---|---|
| files | 604 | 555 |
| cases | 4015 | 3314 |
| tagged critical | 0 | 2553 |
| tagged standard | 0 | 607 |
| tagged e2e | 0 | 154 |
| untagged | 4015 | 0 |

Before: 1310 react, 1025 build and create-brock, 1680 the rest. After counts come from a scan of the final tree, so they can differ by a few cases from the per-part tables below.

## Tag pass

Every critical case was checked for a real process, real git, a socket, a real build, a path outside a temp folder or a real timer.

- Retagged e2e: the two real-file icacls cases in electron (`bridge-windows-acl`, `bridge-windows-acl-async`), the three `tessera-copy` cases (now one e2e case).
- Moved to standard: the real node probes of `tools-probe`, the http server of `tools`, the real launches of `server-target`, the real stub processes of `upgrade-monorepo` (new file `upgrade-monorepo-run`).
- Mocked: icacls in `restart-handoff`.
- Made deterministic (W7): `bridge-push` (vi.waitFor on the outcome), `helper-bridge` (awaited events instead of 50 and 100 ms sleeps).
- Per-test timeouts removed: the 240 s `tessera-copy` beforeAll, ten `timeout: 60_000` options and two 60 s beforeAll limits in react. The preset sets the limits per tag.
- Left as is: `process-job` and `process-job-limits` (e2e, a 15 s poll window for a real process, not a test timeout).

## Part 1: packages/react

Verdicts against the shared test standard (docs/test-standard.md in the config repo). Case counts are it/test call sites.

| | before | after |
|---|---|---|
| files | 203 | 191 |
| cases | 1310 | 1084 |

Removed helper: tests/title-bar-fixtures.ts (no importer left).

| file | verdict | rule | cases before | cases after |
|---|---|---|---|---|
| about-checks.keep.test.ts | keep | K1 | 2 | 2 |
| about-panel-wordmark.keep.test.ts | delete | W1-W10 | 5 | 0 |
| announcer.keep.test.ts | trim | S1 | 5 | 4 |
| app-background.keep.test.ts | delete | W1-W10 | 3 | 0 |
| app-open.keep.test.ts | trim | K1 | 4 | 3 |
| app-review-sizes.keep.test.ts | keep | K1 | 4 | 4 |
| app-review-steps.keep.test.ts | keep | K1 | 3 | 3 |
| bare-card.keep.test.ts | trim | K1 | 6 | 3 |
| bare-hub-pages.keep.test.ts | trim | K1 | 17 | 5 |
| boot-failure-splash.keep.test.ts | trim | S1 | 5 | 2 |
| brand-mascot.keep.test.ts | trim | K1,S1 | 3 | 2 |
| bucket-backdrop-file.keep.test.ts | trim | K1 | 3 | 1 |
| bucket-backdrop-preload.keep.test.ts | keep | K1 | 2 | 2 |
| bug-report-dialog-extensions.keep.test.ts | trim | S1 | 6 | 6 |
| bug-report-dialog.keep.test.ts | keep | S1 | 2 | 2 |
| bug-report-fields.keep.test.ts | keep | K1 | 9 | 9 |
| bug-report-transport.keep.test.ts | keep | K1 | 10 | 10 |
| build-menu.keep.test.ts | keep | K1 | 13 | 13 |
| capability-defaults.keep.test.ts | trim | K1 | 2 | 1 |
| capacitor-host.keep.test.ts | keep | S2 | 7 | 7 |
| channel-api.keep.test.ts | keep | K2 | 2 | 2 |
| chord-exports.keep.test.ts | trim | K1,S1 | 6 | 4 |
| clear-text-field.keep.test.ts | keep | K1 | 4 | 4 |
| command-args.keep.test.ts | keep | K1 | 8 | 8 |
| command-builtin-yield.keep.test.ts | keep | K1 | 7 | 7 |
| command-gate-menus.keep.test.ts | keep | S2 | 4 | 4 |
| command-gates.keep.test.ts | keep | K1 | 7 | 7 |
| command-hold.keep.test.ts | keep | K1 | 7 | 7 |
| command-visible.keep.test.ts | keep | K1 | 7 | 7 |
| command-zones.keep.test.ts | trim | K1 | 8 | 7 |
| commands.keep.test.ts | keep | K1 | 17 | 17 |
| confirm-dialog-choice.keep.test.ts | trim | S1 | 13 | 9 |
| context-menu-entries.keep.test.ts | keep | S2 | 8 | 8 |
| context-menu-keyboard.keep.test.ts | keep | S1 | 6 | 6 |
| context-menu-pointer.keep.test.ts | trim | S1 | 18 | 15 |
| context-menu-registry.keep.test.ts | keep | S2 | 5 | 5 |
| context-menu-selection.keep.test.ts | keep | K1 | 5 | 5 |
| date-display.keep.test.ts | trim | K1,S1 | 4 | 3 |
| debug-text.keep.test.ts | keep | K1 | 6 | 6 |
| developer-tools-switch.keep.test.ts | keep | S2 | 4 | 4 |
| dialogs-control.keep.test.ts | keep | K2 | 10 | 10 |
| dnd-files.keep.test.ts | keep | K4 | 4 | 4 |
| dnd-live-options.keep.test.ts | keep | S1 | 6 | 6 |
| dnd.keep.test.ts | keep | K1 | 6 | 6 |
| dock-layout-reading.keep.test.ts | keep | K1 | 3 | 3 |
| document-title.keep.test.ts | keep | K1,S1,S2 | 4 | 4 |
| documents-port.keep.test.ts | trim | S2, merged with documents-folder-port | 14 | 8 |
| escape-stack.keep.test.ts | trim | K1,S2 | 7 | 6 |
| expose-host-namespace.keep.test.ts | trim | K4 | 2 | 1 |
| finished-jobs.keep.test.ts | keep | K1 | 4 | 4 |
| floating-floor.keep.test.ts | trim | K1 | 5 | 3 |
| header-actions.keep.test.ts | trim | S1 | 4 | 2 |
| hero-art-none.keep.test.ts | trim | K1 | 4 | 1 |
| hero-checks.keep.test.ts | keep | K1 | 4 | 4 |
| hero-size.keep.test.ts | delete | W1-W10 | 2 | 0 |
| host-api.keep.test.ts | delete | W1-W10 | 2 | 0 |
| hub-backdrop.keep.test.ts | delete | W3 | 4 | 0 |
| hub-header-rail-aliases.keep.test.ts | trim | K1 | 7 | 5 |
| hub-hidden-home.keep.test.ts | trim | K1 | 8 | 5 |
| hub-kept-pages.keep.test.ts | keep | S1 | 1 | 1 |
| hub-nav-auto.keep.test.ts | trim | K1,S1 | 5 | 3 |
| hub-nav-top.keep.test.ts | trim | K1 | 6 | 5 |
| hub-sticky-params.keep.test.ts | trim | K1,S2 | 8 | 7 |
| hub-switcher-hidden.keep.test.ts | trim | K1 | 5 | 2 |
| images-task-wordmark.keep.test.ts | keep | S2 | 2 | 2 |
| info-card.keep.test.ts | trim | K1 | 6 | 3 |
| issue-url.keep.test.ts | keep | K1 | 5 | 5 |
| job-options.keep.test.ts | keep | S2 | 5 | 5 |
| job-title-bar.keep.test.ts | trim | K1 | 3 | 2 |
| json-setting-field.keep.test.ts | trim | K1,S1 | 4 | 3 |
| keyed-guard-reducer.keep.test.ts | keep | K1 | 4 | 4 |
| kit-page-forced.keep.test.ts | keep | S2 | 3 | 3 |
| lazy-screens.keep.test.ts | trim | S2 | 9 | 7 |
| live-hub-pages.keep.test.ts | trim | K1,S1 | 16 | 14 |
| menu-bar.keep.test.ts | trim | S1 | 9 | 8 |
| menu-command-chords.keep.test.ts | keep | K1 | 3 | 3 |
| menu-config.keep.test.ts | keep | K1 | 14 | 14 |
| menu-disabled-hooks.keep.test.ts | keep | S2 | 1 | 1 |
| menu-hidden-shortcuts.keep.test.ts | keep | K4 | 2 | 2 |
| menu-layout.keep.test.ts | trim | K1,S2 | 17 | 14 |
| menu-meta-overrides.keep.test.ts | keep | K1 | 8 | 8 |
| menu-view-entry.keep.test.ts | trim | K1 | 18 | 16 |
| mobile-storage-and-title-bar.keep.test.ts | keep | S1 | 2 | 2 |
| module-buckets.keep.test.ts | trim | K1,S2 | 7 | 6 |
| module-settings-tab-ids.keep.test.ts | trim | K1 | 5 | 4 |
| nav-routes.keep.test.ts | keep | K2 | 2 | 2 |
| navigation-history.keep.test.ts | keep | K1,K2,K3 | 15 | 15 |
| page-fill.keep.test.ts | delete | W3 | 2 | 0 |
| palette-confirm.keep.test.ts | trim | S1 | 4 | 3 |
| palette-ranking.keep.test.ts | keep | K1 | 9 | 9 |
| palette-scope.keep.test.ts | keep | K1 | 4 | 4 |
| performance-widget.keep.test.ts | trim | K1 | 12 | 11 |
| pick-file-any-type.keep.test.ts | keep | K1 | 2 | 2 |
| platform-bridge-ports.keep.test.ts | trim | K2 | 4 | 3 |
| popped-widget-disabled.keep.test.ts | trim | S1 | 3 | 2 |
| popped-widgets.keep.test.ts | keep | K1 | 7 | 7 |
| profile-removal.keep.test.ts | keep | K3,K4 | 12 | 12 |
| profiles-panel.keep.test.ts | keep | S1 | 6 | 6 |
| profiles-route.keep.test.ts | keep | K1 | 4 | 4 |
| quit-async-guard.keep.test.ts | keep | K1,K3,K4 | 14 | 14 |
| quit-native-close.keep.test.ts | keep | K1 | 4 | 4 |
| recent-menu-and-recovery.keep.test.ts | keep | K3,S1 | 8 | 8 |
| region-cycling.keep.test.ts | keep | S1 | 5 | 5 |
| region-scope.keep.test.ts | keep | S3 | 5 | 5 |
| release-notes-markdown.keep.test.ts | trim | S1 | 4 | 3 |
| render-error-boundary.keep.test.ts | trim | S1 | 5 | 3 |
| renderer-jobs.keep.test.ts | keep | K1 | 3 | 3 |
| renderer-session-log.keep.test.ts | keep | K1 | 4 | 4 |
| request-quit.keep.test.ts | keep | K4 | 4 | 4 |
| resolve-escape.keep.test.ts | keep | K1 | 5 | 5 |
| reveal-with-toast.keep.test.ts | keep | K1 | 2 | 2 |
| review-await-signal.keep.test.ts | trim | K1 | 11 | 8 |
| review-bucket-show.keep.test.ts | keep | S2 | 2 | 2 |
| review-bug-report-prefill.keep.test.ts | trim | K1 | 5 | 4 |
| review-checks.keep.test.ts | trim | K1 | 29 | 23 |
| review-copy-fixtures.keep.test.ts | keep | K1 | 1 | 1 |
| review-menu-label.keep.test.ts | keep | K1 | 2 | 2 |
| review-menu-path.keep.test.ts | keep | K1 | 1 | 1 |
| review-read-frame.keep.test.ts | keep | K1 | 6 | 6 |
| review-row-hint.keep.test.ts | keep | S2 | 3 | 3 |
| review-step-limit.keep.test.ts | delete | W6 | 3 | 0 |
| screen-kinds.keep.test.ts | keep | K1 | 11 | 11 |
| screen-layer-name.keep.test.ts | trim | K1/S1 (W3 trimmed) | 5 | 3 |
| screen-scroll.keep.test.ts | keep | K1 | 3 | 3 |
| screen-state-restart.keep.test.ts | keep | K3 | 2 | 2 |
| screen-tree.keep.test.ts | trim | K1 | 18 | 17 |
| screenshot-hold.keep.test.ts | keep | K1 | 5 | 5 |
| search-index.keep.test.ts | trim | K1 | 16 | 15 |
| session-fill-watch.keep.test.ts | keep | K1 | 4 | 4 |
| setting-actions.keep.test.ts | trim | K1/K4/S1 | 11 | 9 |
| settings-control.keep.test.ts | trim | K2/K4 | 12 | 11 |
| settings-group-merge.keep.test.ts | keep | K1/S1 | 7 | 7 |
| settings-preview-landmark.keep.test.ts | trim | S1 | 3 | 2 |
| settings-preview-layout.keep.test.ts | trim | S1 (W1/W3/W5 trimmed) | 7 | 1 |
| settings-row-reset.keep.test.ts | keep | K1 | 6 | 6 |
| settings-rows.keep.test.ts | trim | K1 | 18 | 10 |
| settings-save.keep.test.ts | keep | K3 | 3 | 3 |
| settings-shell-gaps.keep.test.ts | trim | K1/K3/S1 | 7 | 4 |
| settings-value-source.keep.test.ts | trim | K1/K3 | 9 | 8 |
| share-with-widgets.keep.test.ts | trim | K1 | 5 | 4 |
| shell-landmarks.keep.test.ts | trim | K2 (W3/W5 trimmed) | 4 | 2 |
| shortcuts-help.keep.test.ts | keep | K1 | 4 | 4 |
| show-flags.keep.test.ts | keep | K1 | 4 | 4 |
| show-rules.keep.test.ts | keep | K1 | 4 | 4 |
| single-profile.keep.test.ts | trim | K1 | 7 | 6 |
| stable-scroll-gutter.keep.test.ts | delete | W1 | 5 | 0 |
| startup-prompts-hook.keep.test.ts | trim | S2 | 4 | 3 |
| startup-prompts.keep.test.ts | keep | K1 | 6 | 6 |
| storage-load-error.keep.test.ts | keep | S1 | 1 | 1 |
| title-bar-disabled.keep.test.ts | trim | K1/S1 | 9 | 8 |
| title-bar-items.keep.test.ts | trim | K1 | 12 | 8 |
| title-bar-menu.keep.test.ts | keep | K1 | 6 | 6 |
| title-bar-no-controls.keep.test.ts | delete | W3 | 2 | 0 |
| title-bar-volume.keep.test.ts | trim | K1 (W3 trimmed) | 7 | 5 |
| to-menu-groups.keep.test.ts | trim | K1 | 4 | 3 |
| toast.keep.test.ts | trim | S1 | 4 | 3 |
| toolbar-host-placement.keep.test.ts | trim | K3 | 8 | 6 |
| toolbar-host-single.keep.test.ts | trim | S1 | 3 | 1 |
| toolbar-items-columns.keep.test.ts | keep | K1/K5 | 11 | 11 |
| toolbar-rules.keep.test.ts | keep | K1 | 6 | 6 |
| toolbar-surface.keep.test.ts | trim | K1/K2/S1 | 12 | 10 |
| toolbars-facade.keep.test.ts | keep | K2 | 11 | 11 |
| toolbars.keep.test.ts | trim | K3 | 15 | 9 |
| tour-host.keep.test.ts | keep | S1 | 5 | 5 |
| tour-intro.keep.test.ts | trim | K1 | 8 | 7 |
| tour-menu-step.keep.test.ts | trim | S2 | 4 | 3 |
| tour-nested-menu.keep.test.ts | trim | S2 | 6 | 4 |
| tour-popped-click.keep.test.ts | keep | S2 | 3 | 3 |
| tour-reset.keep.test.ts | trim | S2 | 7 | 5 |
| tour-shell-parts.keep.test.ts | trim | K1 | 4 | 2 |
| tour-steps.keep.test.ts | keep | K1 | 8 | 8 |
| tours-first-run.keep.test.ts | keep | K3 | 4 | 4 |
| tours.keep.test.ts | keep | K1 | 8 | 8 |
| ui-views-namespaces.keep.test.ts | keep | K3 | 3 | 3 |
| ui-views-scope.keep.test.ts | keep | K3 | 7 | 7 |
| volume-store.keep.test.ts | keep | K1 | 7 | 7 |
| wait-mascot-still.keep.test.ts | delete | W7 | 3 | 0 |
| web-phone-detection.keep.test.ts | trim | S1 | 4 | 3 |
| widget-body-holds.keep.test.ts | trim | S2 | 5 | 3 |
| widget-context-label.keep.test.ts | trim | S1 | 5 | 3 |
| widget-contexts.keep.test.ts | trim | K1 | 9 | 8 |
| widget-developer-group.keep.test.ts | trim | K1 | 4 | 2 |
| widget-disabled.keep.test.ts | keep | K1 | 3 | 3 |
| widget-focus-guard.keep.test.ts | trim | S1 | 15 | 9 |
| widget-kits-exclusive.keep.test.ts | trim | K1 | 10 | 8 |
| widget-kits.keep.test.ts | trim | K1 | 12 | 10 |
| widget-layout-revision.keep.test.ts | keep | K3 | 8 | 8 |
| widget-layout.keep.test.ts | keep | K3 | 10 | 10 |
| widget-make-room.keep.test.ts | keep | K3 | 4 | 4 |
| widget-menu-placement.keep.test.ts | trim | K1 | 11 | 8 |
| widget-order.keep.test.ts | trim | K1 | 7 | 6 |
| widget-pref-relay.keep.test.ts | trim | K1 | 3 | 2 |
| widget-preset.keep.test.ts | trim | K1 | 14 | 11 |
| widget-rules.keep.test.ts | trim | K1 | 15 | 13 |
| widget-state-restart.keep.test.ts | keep | K3 | 4 | 4 |
| widget-window-chrome.keep.test.ts | delete | W3 | 1 | 0 |
| widgets-docked-size.keep.test.ts | trim | K1 | 4 | 2 |
| widgets-facade.keep.test.ts | keep | K2 | 19 | 19 |
| window-api-typing.keep.test.ts | delete | W5 | 2 | 0 |
| window-mascot.keep.test.ts | trim | S1 | 11 | 7 |
| window-sidenav.keep.test.ts | trim | S1 | 8 | 6 |
| workspaces.keep.test.ts | keep | K3 | 7 | 7 |

### Critical deleted

- app-open: default hold ends on the next task (real setTimeout test, removed as W7; K1 behavior now uncovered, the injected-hold test covers the hand-off)
- hub-backdrop: bucket and page-meta backdrop pass-through to the hub (config pass-through, DOM draw; judged W3).
- lazy-screens: lazyComponent loading-state reveal and lazyLoads.idle timeout (both used real timers, W7); the idle scheduling logic has no deterministic test now.
- hub-nav-auto, hub-header-rail-aliases, hub-hidden-home, hub-switcher-hidden: DOM draws of the hub nav, header and switcher removed (W3); the pure showsHubNav, nav config and switcherHubs logic stays covered.
- performance-widget: built-in widget list (W5); platform-bridge-ports: dragOut call-through (W6).
- review-step-limit: mock-called-only test of the host.alive watchdog message (W6); the IPC message itself is not covered by a kept test here.
- Other deletions were duplicate states, markup or constants (W3, W4, W5, W8); none leave K1-K5 logic uncovered.
- window-api-typing.keep.test.ts: typecheck contract (app may declare its own window.api); a regression would surface in each consumer's own typecheck, and the test ran a real tsc program (slow, W5).
- wait-mascot-still.keep.test.ts: review-harness polling of mascot geometry with fake timers; not user data or logic of the shipped app.
- widget-focus-guard: dock-line drag and options-panel focus cases dropped as W4 variants of the kept click/Tab/menu cases.
- widget-kits.keep.test.ts: KitLayer markup tests (data attributes) dropped as W3; kit logic left intact.

### Undecided

- startup-prompts-hook, startup-prompts, storage-load-error, settings-value-source, reveal-with-toast: real timers replaced by microtask flushes, unrun; the checker should confirm they pass.
- none (marginal calls: wait-mascot-still deleted as W7/W3; tours-first-run profile-progress merge test kept as K3 though it could be W10 once all installs have migrated).
- lazy-screens, mobile-storage-and-title-bar, navigation-history, profiles-panel, quit-async-guard: setTimeout waits replaced by microtask flush loops, unrun.

## Part 2: packages/build and packages/create-brock

Verdicts against the shared test standard. A case is one `it` or `test` call.
Branch: test-cleanup/build. Nothing was run in this pass (no tests, lint or typecheck); the
lead's checker runs them.

### Counts

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

### Verdicts

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
| server-workflows.keep.test.mjs | trim | K1+K4, merged with test-env-workflows | 32 | 17 |
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
| tessera-copy.keep.test.mjs | trim | E2+K4, three cases sharing a 240 s beforeAll collapsed into one e2e case | 8 | 5 |
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
| widget-kit-files.keep.test.mjs | trim | K1, merged with widget-layout-file | 13 | 5 |
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

### Critical deleted

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

## Part 3: the rest of Brock

Scope: electron, thread, core, build-cache, lint-config, cli (no tests), plugins/snes and modules/*. React, build and create-brock are not in this file.

Files: 235 before, 230 after. Cases: 1680 before, 1569 after.

Tags after: critical 1307, standard 187, e2e 75, untagged 0.

| package | files before | files after | cases before | cases after |
|---|---|---|---|---|
| core | 25 | 23 | 142 | 122 |
| build-cache | 5 | 5 | 40 | 31 |
| lint-config | 7 | 7 | 24 | 19 |
| thread | 38 | 37 | 241 | 213 |
| plugins/snes | 2 | 2 | 9 | 8 |
| modules/catalog | 2 | 2 | 17 | 17 |
| modules/display | 3 | 3 | 14 | 13 |
| modules/input | 18 | 18 | 116 | 108 |
| modules/port-kit | 13 | 13 | 87 | 85 |
| modules/secrets | 2 | 2 | 13 | 11 |
| modules/tools | 3 | 3 | 19 | 18 |
| modules/updater | 6 | 6 | 28 | 28 |
| electron | 111 | 109 | 930 | 896 |

A case is one it or test call. An it.each counts as one.

### Verdicts

| file | verdict | rule | cases before | cases after |
|---|---|---|---|---|
| packages/build-cache/tests/build-cache.keep.test.mjs | trim | K1/K2/E2/K3 | 15 | 13 |
| packages/build-cache/tests/electron-cache.keep.test.mjs | trim | K4 | 4 | 3 |
| packages/build-cache/tests/review-fixes.keep.test.mjs | trim | E2/K3/K1 | 9 | 6 |
| packages/build-cache/tests/vite-deps-store-link.keep.test.mjs | keep | K1 | 2 | 2 |
| packages/build-cache/tests/vite-deps.keep.test.mjs | trim | K3/K1 | 10 | 7 |
| packages/core/tests/any-type-for.keep.test.ts | keep | K1 | 3 | 3 |
| packages/core/tests/app-error.keep.test.ts | keep | K2/K1 | 12 | 12 |
| packages/core/tests/automation-flags.keep.test.ts | keep | K2 | 7 | 7 |
| packages/core/tests/benign-browser-error.keep.test.ts | keep | K1 | 1 | 1 |
| packages/core/tests/boot-runner.keep.test.ts | trim | K1 | 7 | 6 |
| packages/core/tests/define-channels.keep.test.ts | trim | K2 | 3 | 1 |
| packages/core/tests/feature-resolver.keep.test.ts | keep | K1 | 4 | 4 |
| packages/core/tests/job-emit-log.keep.test.ts | keep | K1 | 2 | 2 |
| packages/core/tests/job-options.keep.test.ts | trim | K1 | 9 | 8 |
| packages/core/tests/jobs.keep.test.ts | keep | K1 | 5 | 5 |
| packages/core/tests/look-resolver.keep.test.ts | keep | K1 | 11 | 11 |
| packages/core/tests/product-boot.keep.test.ts | trim | K1 | 3 | 2 |
| packages/core/tests/product-icons.keep.test.ts | trim | K1 | 11 | 9 |
| packages/core/tests/product-installer.keep.test.ts | keep | K1 | 3 | 3 |
| packages/core/tests/product-mascot.keep.test.ts | trim | K1 | 4 | 2 |
| packages/core/tests/product-net.keep.test.ts | trim | K4 | 7 | 6 |
| packages/core/tests/product-os-integration.keep.test.ts | trim | K4 | 5 | 4 |
| packages/core/tests/product-single-profile.keep.test.ts | delete | W5 | 3 | 0 |
| packages/core/tests/product-title-bar.keep.test.ts | trim | K1 | 4 | 3 |
| packages/core/tests/product-tray.keep.test.ts | trim | K1 | 3 | 1 |
| packages/core/tests/product-widgets.keep.test.ts | delete | W5 | 2 | 0 |
| packages/core/tests/profile-store.keep.test.ts | keep | K3 | 3 | 3 |
| packages/core/tests/redact-secrets.keep.test.ts | keep | K4 | 5 | 5 |
| packages/core/tests/review-baselines.keep.test.ts | trim | K1 | 16 | 15 |
| packages/core/tests/review-report.keep.test.ts | keep | K1 | 9 | 9 |
| packages/electron/tests/app-launch.keep.test.ts | keep | K2/S2 | 9 | 9 |
| packages/electron/tests/app-services.keep.test.ts | keep | K2 | 2 | 2 |
| packages/electron/tests/ask-renderer.keep.test.ts | trim | K2/K4 | 12 | 11 |
| packages/electron/tests/background-launch.keep.test.ts | keep | K1 | 17 | 17 |
| packages/electron/tests/boot-watchdog.keep.test.ts | keep | K1 | 13 | 13 |
| packages/electron/tests/bridge-app.keep.test.ts | keep | S2 | 3 | 3 |
| packages/electron/tests/bridge-discovery.keep.test.ts | keep | K4 | 8 | 8 |
| packages/electron/tests/bridge-hardening.keep.test.ts | keep | K4 | 4 | 4 |
| packages/electron/tests/bridge-push.keep.test.ts | keep | K2, W7 sleep replaced by vi.waitFor | 4 | 4 |
| packages/electron/tests/bridge-windows-acl-async.keep.test.ts | keep | K4, real icacls case retagged e2e | 11 | 11 |
| packages/electron/tests/bridge-windows-acl.keep.test.ts | keep | K4, real icacls case retagged e2e | 4 | 4 |
| packages/electron/tests/bug-report-transport.keep.test.ts | keep | K2 | 9 | 9 |
| packages/electron/tests/capture-frame.keep.test.ts | keep | K1 | 2 | 2 |
| packages/electron/tests/channel-handle.keep.test.ts | trim | K2 | 2 | 1 |
| packages/electron/tests/clipboard-watch.keep.test.ts | keep | K1 | 11 | 11 |
| packages/electron/tests/clipboard.keep.test.ts | keep | K2/K4 | 17 | 17 |
| packages/electron/tests/cluster-fit.keep.test.ts | keep | K1 | 5 | 5 |
| packages/electron/tests/ctrl-release.keep.test.ts | keep | K1 | 6 | 6 |
| packages/electron/tests/data-domain-dirs.keep.test.ts | keep | K4 | 5 | 5 |
| packages/electron/tests/data-domains.keep.test.ts | keep | K3 | 6 | 6 |
| packages/electron/tests/data-transfer.keep.test.ts | keep | K3 | 9 | 9 |
| packages/electron/tests/dev-cache.keep.test.ts | keep | K1 | 4 | 4 |
| packages/electron/tests/document-copy.keep.test.ts | keep | K3/K2/K4 | 15 | 15 |
| packages/electron/tests/document-files.keep.test.ts | keep | K4 | 7 | 7 |
| packages/electron/tests/document-folder-ipc.keep.test.ts | keep | K4 | 2 | 2 |
| packages/electron/tests/document-grant-folder-automation.keep.test.ts | trim | K4 | 15 | 13 |
| packages/electron/tests/document-grant-folder.keep.test.ts | keep | K4 | 13 | 13 |
| packages/electron/tests/document-move-across.keep.test.ts | keep | K3 | 13 | 13 |
| packages/electron/tests/document-recent-ipc.keep.test.ts | keep | K3 | 12 | 12 |
| packages/electron/tests/document-reveal.keep.test.ts | keep | K4 | 8 | 8 |
| packages/electron/tests/document-watch-ipc.keep.test.ts | keep | K4 | 7 | 7 |
| packages/electron/tests/drag-out.keep.test.ts | keep | K4 | 11 | 11 |
| packages/electron/tests/ec-digest-of.keep.test.ts | keep | K1 | 8 | 8 |
| packages/electron/tests/ec-null-digest.keep.test.ts | trim | K1 | 11 | 10 |
| packages/electron/tests/edge-lock.keep.test.ts | keep | K1 | 10 | 10 |
| packages/electron/tests/electron-clipboard.keep.test.ts | keep | K1 | 7 | 7 |
| packages/electron/tests/embed-server.keep.test.ts | keep | K2 | 3 | 3 |
| packages/electron/tests/explicit-show.keep.test.ts | keep | K1 | 9 | 9 |
| packages/electron/tests/file-guard.keep.test.ts | keep | K4 | 6 | 6 |
| packages/electron/tests/folder-autostart.keep.test.ts | trim | K4 | 13 | 11 |
| packages/electron/tests/folder-grant-races.keep.test.ts | keep | K4 | 3 | 3 |
| packages/electron/tests/folder-grants-windows.keep.test.ts | keep | K4 | 5 | 5 |
| packages/electron/tests/folder-grants.keep.test.ts | keep | K4 | 17 | 17 |
| packages/electron/tests/folder-hardening.keep.test.ts | keep | K4 | 16 | 16 |
| packages/electron/tests/folder-listing.keep.test.ts | keep | K4/K3 | 14 | 14 |
| packages/electron/tests/folder-mkdir.keep.test.ts | keep | K4 | 8 | 8 |
| packages/electron/tests/folder-protection.keep.test.ts | keep | K4 | 14 | 14 |
| packages/electron/tests/folder-rename-subtree.keep.test.ts | keep | K4 | 11 | 11 |
| packages/electron/tests/folder-rename.keep.test.ts | keep | K4 | 10 | 10 |
| packages/electron/tests/folder-revoke.keep.test.ts | keep | K4 | 5 | 5 |
| packages/electron/tests/folder-trash.keep.test.ts | keep | K4 | 9 | 9 |
| packages/electron/tests/folder-watch-limits.keep.test.ts | keep | K4/K1 | 5 | 5 |
| packages/electron/tests/folder-watch.keep.test.ts | keep | K1 | 7 | 7 |
| packages/electron/tests/folder-write-classes.keep.test.ts | trim | K4 | 14 | 11 |
| packages/electron/tests/from-app-frame.keep.test.ts | keep | K4 | 3 | 3 |
| packages/electron/tests/headless-fullscreen.keep.test.ts | keep | K1 | 2 | 2 |
| packages/electron/tests/headless-rendering.keep.test.ts | trim | K1 | 6 | 4 |
| packages/electron/tests/helper-bridge.keep.test.ts | keep | K4/K2, W7 sleeps replaced by events | 11 | 11 |
| packages/electron/tests/hold-close-hung.keep.test.ts | keep | K1 | 2 | 2 |
| packages/electron/tests/hold-close.keep.test.ts | keep | K1 | 8 | 8 |
| packages/electron/tests/ipc-coded-errors.keep.test.ts | keep | K2 | 5 | 5 |
| packages/electron/tests/made-folders.keep.test.ts | keep | K4 | 9 | 9 |
| packages/electron/tests/main-dialogs-choose.keep.test.ts | keep | K2 | 6 | 6 |
| packages/electron/tests/main-dialogs.keep.test.ts | keep | K2 | 10 | 10 |
| packages/electron/tests/mark-of-the-web.keep.test.ts | keep | K4 | 4 | 4 |
| packages/electron/tests/mark-on-grant-writes.keep.test.ts | keep | K4 | 2 | 2 |
| packages/electron/tests/memo-by-context.keep.test.ts | keep | K1 | 2 | 2 |
| packages/electron/tests/net-channel-guard.keep.test.ts | keep | K4 | 2 | 2 |
| packages/electron/tests/net-read.keep.test.ts | keep | K4 | 22 | 22 |
| packages/electron/tests/node-entry.keep.test.ts | trim | K2 | 4 | 2 |
| packages/electron/tests/open-external.keep.test.ts | keep | K4 | 6 | 6 |
| packages/electron/tests/open-routing.keep.test.ts | keep | K1 | 6 | 6 |
| packages/electron/tests/os-integration.keep.test.ts | keep | K2 | 8 | 8 |
| packages/electron/tests/pointer-input.keep.test.ts | keep | K2 | 2 | 2 |
| packages/electron/tests/private-files.keep.test.ts | keep | K4 | 3 | 3 |
| packages/electron/tests/process-job-detach.keep.test.ts | keep | K1 | 5 | 5 |
| packages/electron/tests/process-job-limits.keep.test.ts | keep | E2 | 6 | 6 |
| packages/electron/tests/process-job-logfile.keep.test.ts | keep | E2 | 8 | 8 |
| packages/electron/tests/process-job-parts.keep.test.ts | keep | K1/K4 | 17 | 17 |
| packages/electron/tests/process-job-stopper.keep.test.ts | keep | K1 | 4 | 4 |
| packages/electron/tests/process-job.keep.test.ts | keep | E2 | 17 | 17 |
| packages/electron/tests/real-path-of.keep.test.ts | keep | K4 | 4 | 4 |
| packages/electron/tests/recent-documents.keep.test.ts | keep | K3 | 11 | 11 |
| packages/electron/tests/recovery-snapshots.keep.test.ts | trim | K3 | 7 | 6 |
| packages/electron/tests/relay-ask.keep.test.ts | keep | K4 | 7 | 7 |
| packages/electron/tests/remembered-folders.keep.test.ts | keep | K4 | 15 | 15 |
| packages/electron/tests/resize-drag.keep.test.ts | keep | K1 | 12 | 12 |
| packages/electron/tests/response-chunks.keep.test.ts | keep | K1 | 4 | 4 |
| packages/electron/tests/restart-handoff.keep.test.ts | keep | K3, icacls mocked | 17 | 17 |
| packages/electron/tests/review-baselines.keep.test.ts | keep | K1 | 10 | 10 |
| packages/electron/tests/review-watchdog.keep.test.ts | keep | K1 | 11 | 11 |
| packages/electron/tests/screenshot-hold.keep.test.ts | keep | K1 | 11 | 11 |
| packages/electron/tests/server-health.keep.test.ts | keep | K2 | 9 | 9 |
| packages/electron/tests/server-keep-alive.keep.test.ts | keep | E2 | 1 | 1 |
| packages/electron/tests/server-runtime.keep.test.ts | trim | K2 | 7 | 6 |
| packages/electron/tests/show-path.keep.test.ts | keep | K4 | 2 | 2 |
| packages/electron/tests/snap-clusters.keep.test.ts | keep | K1 | 12 | 12 |
| packages/electron/tests/snapped-resize.keep.test.ts | trim | K1 | 20 | 18 |
| packages/electron/tests/stacked-seam.keep.test.ts | delete | W4 | 8 | 0 |
| packages/electron/tests/start-app.keep.test.ts | keep | K2 | 4 | 4 |
| packages/electron/tests/sweep-stale-launch-files.keep.test.ts | keep | K3 | 5 | 5 |
| packages/electron/tests/tray.keep.test.ts | trim | S1/K1 | 10 | 4 |
| packages/electron/tests/ui-views-store.keep.test.ts | keep | K3 | 2 | 2 |
| packages/electron/tests/vet-drop.keep.test.ts | keep | K4 | 4 | 4 |
| packages/electron/tests/widget-pin.keep.test.ts | keep | K1 | 4 | 4 |
| packages/electron/tests/widget-reveal.keep.test.ts | keep | K1 | 5 | 5 |
| packages/electron/tests/widget-windows.keep.test.ts | keep | K1 | 34 | 34 |
| packages/electron/tests/window-icon.keep.test.ts | keep | K1 | 8 | 8 |
| packages/electron/tests/window-snapping.keep.test.ts | keep | K1 | 26 | 26 |
| packages/electron/tests/window-title.keep.test.ts | delete | W6 | 2 | 0 |
| packages/electron/tests/write-atomic.keep.test.ts | keep | K3 | 7 | 7 |
| packages/lint-config/tests/allow.keep.test.mjs | keep | S2 | 3 | 3 |
| packages/lint-config/tests/config-root.keep.test.mjs | trim | K1 | 3 | 2 |
| packages/lint-config/tests/data-kind.keep.test.mjs | trim | S2 | 4 | 3 |
| packages/lint-config/tests/dev-screen-files.keep.test.mjs | keep | S2 | 2 | 2 |
| packages/lint-config/tests/generated-files.keep.test.mjs | trim | K2 | 4 | 3 |
| packages/lint-config/tests/live-hook.keep.test.mjs | trim | S2 | 3 | 2 |
| packages/lint-config/tests/verbatim-kind.keep.test.mjs | trim | S2 | 5 | 4 |
| packages/modules/catalog/tests/catalog-app-hooks.keep.test.ts | keep | K2 | 4 | 4 |
| packages/modules/catalog/tests/catalog.keep.test.ts | keep | K4/K2/S2 | 13 | 13 |
| packages/modules/display/tests/android-display-api.keep.test.ts | keep | K2 | 5 | 5 |
| packages/modules/display/tests/display-host-defaults.keep.test.ts | trim | K1 | 4 | 3 |
| packages/modules/display/tests/koffi-versions.keep.test.ts | keep | S4 | 5 | 5 |
| packages/modules/input/tests/addon-cmake-dir.keep.test.ts | keep | K1 | 5 | 5 |
| packages/modules/input/tests/addon-installed-cache.keep.test.ts | keep | K3 | 5 | 5 |
| packages/modules/input/tests/addon-prebuilt-cache.keep.test.ts | keep | K3 | 5 | 5 |
| packages/modules/input/tests/android-input-api.keep.test.ts | keep | K2 | 8 | 8 |
| packages/modules/input/tests/android-input-host.keep.test.ts | keep | K2 | 4 | 4 |
| packages/modules/input/tests/device-card-actions.keep.test.ts | keep | K1 | 4 | 4 |
| packages/modules/input/tests/device-snapshot.keep.test.ts | keep | K1 | 7 | 7 |
| packages/modules/input/tests/input-main-live.keep.test.ts | keep | K1 | 5 | 5 |
| packages/modules/input/tests/input-singleton.keep.test.ts | keep | S2 | 3 | 3 |
| packages/modules/input/tests/mapping-list.keep.test.ts | keep | K1 | 14 | 14 |
| packages/modules/input/tests/mapping-source.keep.test.ts | keep | K1 | 5 | 5 |
| packages/modules/input/tests/noop-input-api.keep.test.ts | trim | K2 | 5 | 4 |
| packages/modules/input/tests/pad-callout-labels.keep.test.ts | trim | K1 | 14 | 10 |
| packages/modules/input/tests/pad-glyph-icons.keep.test.ts | trim | K2 | 2 | 1 |
| packages/modules/input/tests/pad-lock.keep.test.ts | trim | K4 | 8 | 7 |
| packages/modules/input/tests/pad-slots.keep.test.ts | trim | K1 | 16 | 15 |
| packages/modules/input/tests/pads-during-diagnostics.keep.test.ts | keep | K1 | 4 | 4 |
| packages/modules/input/tests/vibration-shaping.keep.test.ts | keep | K1 | 2 | 2 |
| packages/modules/port-kit/tests/asset-web-worker-job.keep.test.ts | keep | S2 | 7 | 7 |
| packages/modules/port-kit/tests/asset-worker-job.keep.test.ts | keep | S2/E2 | 7 | 7 |
| packages/modules/port-kit/tests/core-hooks.keep.test.ts | keep | K1/S2 | 9 | 9 |
| packages/modules/port-kit/tests/ensure-wasm-sdk.keep.test.ts | trim | K1 | 7 | 5 |
| packages/modules/port-kit/tests/ensure-wasm.keep.test.ts | keep | E2 | 3 | 3 |
| packages/modules/port-kit/tests/identify-rom.keep.test.ts | keep | K1 | 5 | 5 |
| packages/modules/port-kit/tests/named-saves.keep.test.ts | keep | K3 | 7 | 7 |
| packages/modules/port-kit/tests/raw-save-state.keep.test.ts | keep | K3 | 5 | 5 |
| packages/modules/port-kit/tests/rom-store-sources.keep.test.ts | keep | K3 | 9 | 9 |
| packages/modules/port-kit/tests/rom-store.keep.test.ts | keep | K3 | 7 | 7 |
| packages/modules/port-kit/tests/save-slot.keep.test.ts | keep | K3 | 14 | 14 |
| packages/modules/port-kit/tests/wasm-stale.keep.test.ts | keep | K1 | 6 | 6 |
| packages/modules/port-kit/tests/web-worker-scope.keep.test.ts | keep | K2 | 1 | 1 |
| packages/modules/secrets/tests/node-secret-store.keep.test.ts | trim | K3 | 9 | 7 |
| packages/modules/secrets/tests/sign-in-status.keep.test.ts | keep | K4 | 4 | 4 |
| packages/modules/tools/tests/tools-probe.keep.test.ts | keep | K1, real node probes moved to standard | 8 | 8 |
| packages/modules/tools/tests/tools.keep.test.ts | trim | K1/S2/E2, http server only under standard | 10 | 9 |
| packages/modules/tools/tests/use-tool.keep.test.ts | keep | S1 | 1 | 1 |
| packages/modules/updater/tests/describe-version.keep.test.ts | keep | K1 | 2 | 2 |
| packages/modules/updater/tests/install-size.keep.test.ts | keep | K1 | 7 | 7 |
| packages/modules/updater/tests/os-integration-hooks.keep.test.ts | keep | K2 | 2 | 2 |
| packages/modules/updater/tests/release-tags.keep.test.ts | keep | K1 | 2 | 2 |
| packages/modules/updater/tests/update-notice.keep.test.ts | keep | K1 | 9 | 9 |
| packages/modules/updater/tests/version-feed.keep.test.ts | keep | K1 | 6 | 6 |
| packages/plugins/snes/tests/options.keep.test.mjs | trim | K2 | 6 | 5 |
| packages/plugins/snes/tests/wasm.keep.test.mjs | keep | S2 | 3 | 3 |
| packages/thread/tests/automation-flags.keep.test.mjs | keep | K2 | 2 | 2 |
| packages/thread/tests/brock-own-release.keep.test.mjs | delete | W1 | 2 | 0 |
| packages/thread/tests/build-if-stale.keep.test.mjs | trim | K1 | 2 | 1 |
| packages/thread/tests/ci-workflow-run.keep.test.mjs | keep | E2 | 2 | 2 |
| packages/thread/tests/ci-workflow.keep.test.mjs | keep | K1 | 13 | 13 |
| packages/thread/tests/clone-install.keep.test.mjs | keep | K3/S2 | 8 | 8 |
| packages/thread/tests/clone-lock.keep.test.mjs | keep | K5 | 1 | 1 |
| packages/thread/tests/clone-safety.keep.test.mjs | keep | K3/K4 | 7 | 7 |
| packages/thread/tests/dist-problem.keep.test.mjs | keep | K1 | 3 | 3 |
| packages/thread/tests/ensure-app-synced.keep.test.mjs | trim | K1 | 4 | 3 |
| packages/thread/tests/follow-tessera.keep.test.mjs | trim | K1 | 4 | 3 |
| packages/thread/tests/generated-files.keep.test.mjs | trim | K4 | 4 | 3 |
| packages/thread/tests/install-dependencies.keep.test.mjs | keep | K1 | 2 | 2 |
| packages/thread/tests/link-launcher.keep.test.mjs | trim | K2 | 7 | 5 |
| packages/thread/tests/links.keep.test.mjs | trim | K1 | 6 | 5 |
| packages/thread/tests/linux-push.keep.test.mjs | trim | K4/K1 | 13 | 11 |
| packages/thread/tests/local-ci.keep.test.mjs | trim | K3/K1/E2 | 15 | 13 |
| packages/thread/tests/local-mode.keep.test.mjs | trim | K1 | 4 | 3 |
| packages/thread/tests/local-release.keep.test.mjs | trim | E2 | 6 | 5 |
| packages/thread/tests/notes-root.keep.test.mjs | trim | K1 | 7 | 6 |
| packages/thread/tests/pick-base.keep.test.mjs | keep | K1 | 4 | 4 |
| packages/thread/tests/plugins.keep.test.mjs | trim | K1/K4 | 6 | 5 |
| packages/thread/tests/ports.keep.test.mjs | trim | K1 | 9 | 8 |
| packages/thread/tests/prewarm.keep.test.mjs | trim | K1 | 3 | 2 |
| packages/thread/tests/release-notes.keep.test.mjs | trim | K2 | 5 | 4 |
| packages/thread/tests/remove-followup.keep.test.mjs | trim | K4 | 11 | 10 |
| packages/thread/tests/remove-tree.keep.test.mjs | keep | K4 | 10 | 10 |
| packages/thread/tests/replay-lockfile.keep.test.mjs | keep | K1 | 13 | 13 |
| packages/thread/tests/replay.keep.test.mjs | keep | K1 | 11 | 11 |
| packages/thread/tests/review-data.keep.test.mjs | keep | K1 | 2 | 2 |
| packages/thread/tests/safe-delete.keep.test.mjs | keep | K5/K4 | 12 | 12 |
| packages/thread/tests/server-target.keep.test.mjs | keep | K1/S2, real launches moved to standard | 5 | 5 |
| packages/thread/tests/target-for-cwd.keep.test.mjs | keep | K1 | 3 | 3 |
| packages/thread/tests/tessera-before.keep.test.mjs | keep | K1 | 4 | 4 |
| packages/thread/tests/thread-base.keep.test.mjs | trim | E2 | 10 | 8 |
| packages/thread/tests/upgrade-monorepo.keep.test.mjs | keep | K1, pure cases only | 8 | 6 |
| packages/thread/tests/upgrade-monorepo-run.keep.test.mjs | new | S2, real stub processes split out | 0 | 2 |
| packages/thread/tests/upgrade-report.keep.test.mjs | keep | K1 | 2 | 2 |
| packages/thread/tests/worktree-prefix.keep.test.mjs | trim | E2 | 11 | 6 |

### Critical deleted

Deleted cases that touched K1 to K5 ground, each with its reason. Whole files come first.

- core/product-single-profile (file): only product defaults, W5. The product type guards the shape.
- core/product-widgets (file): only product defaults, W5.
- thread/brock-own-release (file): tied to this repo's own release steps, no KEEP rule, W8.
- electron/stacked-seam (file): same shared-edge cases as snapped-resize, edge-lock and window-snapping, W4.
- electron/window-title (file): only asserts that a mock setter was called, W6.
- core/boot-runner "runs independent tasks together": relied on real timing, W7.
- core/define-channels "yields the contract types", "types the renderer methods": type level only, W2.
- core/job-options "forwards nothing when the registry has no sink": mock call check, W6.
- core/product-boot, product-icons (2), product-mascot (2), product-net, product-os-integration, product-title-bar, product-tray (2): defaults and pass-through of config, W5.
- core/review-baselines "a bless passes and says ...": same bless path as its neighbour, W4.
- build-cache/build-cache "shares one module": checks a re-export, W5.
- build-cache/electron-cache "misses another version": same key rule as the hit case, W4.
- build-cache/review-fixes "carries the output layout version": a constant, W5. "stores from a detached process", "records running, then done": real process or timing, W7.
- build-cache/vite-deps "stores a pre-bundle made in a shared-store", "keeps entries for another build key", "stores from a process of its own": same store rule in other states, or a child process, W4 and W7.
- lint-config/config-root "marks a verbatim file when ESLint runs": repeats a lint rule, W2.
- lint-config/data-kind, generated-files, live-hook, verbatim-kind (one case each): same rule as a kept case in another state, W4.
- thread (build-if-stale, ensure-app-synced, follow-tessera, generated-files, link-launcher x2, links, linux-push x2, local-ci x2, local-mode, local-release, notes-root, plugins, ports, prewarm, release-notes, remove-followup, thread-base x2, worktree-prefix x4): the same rule in a second state (W4), a child process or real git run that now lives in an e2e case (W7), or a mock call check (W6). Boundary cases of each rule stay.
- electron/ask-renderer, channel-handle: type level checks, W2.
- electron/ec-null-digest "passes an explicit algorithm through unchanged": third pass-through of the same rule, W4.
- electron/document-grant-folder-automation, folder-autostart, folder-write-classes, headless-rendering, node-entry, snapped-resize, recovery-snapshots, tray: W4 or W5 repeats, such as "know the paths on their own", a constant. Two more are W1: node-entry and server-runtime read source files to walk imports, so the Electron-free rule belongs to lint. "are refused in a parallel burst" (folder-write-classes) went for ordering luck and a 60 s timeout, W7. The refusal itself is still covered by "are refused by name, whatever the folder".
- modules (display-host-defaults, input noop-input-api, pad-callout-labels, pad-glyph-icons, pad-lock, pad-slots, port-kit ensure-wasm-sdk, secrets node-secret-store, tools tools, snes options): defaults (W5), a duplicate state (W4), a layout case (W3), a source read (W1), or a case that spawns a tool (tar, a Windows shell) with no fast path (W7).

### Undecided

- electron/process-job and process-job-limits keep a 15 s poll window for real processes. It is a poll limit, not a test timeout.
- Counts of cases in a table of cases (it.each) are one per call, not per row.
