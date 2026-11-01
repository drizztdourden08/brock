# Test clean-up: packages/react

Verdicts against X:/ai-config/docs/test-standard.md. Case counts are it/test call sites.

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
| documents-folder-port.keep.test.ts | trim | S2 | 6 | 4 |
| documents-port.keep.test.ts | trim | S2 | 8 | 4 |
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

## Critical deleted

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

## Undecided

- startup-prompts-hook, startup-prompts, storage-load-error, settings-value-source, reveal-with-toast: real timers replaced by microtask flushes, unrun; the checker should confirm they pass.
- none (marginal calls: wait-mascot-still deleted as W7/W3; tours-first-run profile-progress merge test kept as K3 though it could be W10 once all installs have migrated).
- lazy-screens, mobile-storage-and-title-bar, navigation-history, profiles-panel, quit-async-guard: setTimeout waits replaced by microtask flush loops, unrun.
