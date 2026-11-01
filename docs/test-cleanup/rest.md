# Test clean-up: the rest of Brock

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

## Verdicts

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
| packages/electron/tests/bridge-push.keep.test.ts | keep | K2 | 4 | 4 |
| packages/electron/tests/bridge-windows-acl-async.keep.test.ts | keep | K4 | 11 | 11 |
| packages/electron/tests/bridge-windows-acl.keep.test.ts | keep | K4 | 4 | 4 |
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
| packages/electron/tests/helper-bridge.keep.test.ts | keep | K4/K2 | 11 | 11 |
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
| packages/electron/tests/restart-handoff.keep.test.ts | keep | K3 | 17 | 17 |
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
| packages/modules/tools/tests/tools-probe.keep.test.ts | keep | K1 | 8 | 8 |
| packages/modules/tools/tests/tools.keep.test.ts | trim | K1/S2/E2 | 10 | 9 |
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
| packages/thread/tests/server-target.keep.test.mjs | keep | K1 | 5 | 5 |
| packages/thread/tests/target-for-cwd.keep.test.mjs | keep | K1 | 3 | 3 |
| packages/thread/tests/tessera-before.keep.test.mjs | keep | K1 | 4 | 4 |
| packages/thread/tests/thread-base.keep.test.mjs | trim | E2 | 10 | 8 |
| packages/thread/tests/upgrade-monorepo.keep.test.mjs | keep | K1 | 8 | 8 |
| packages/thread/tests/upgrade-report.keep.test.mjs | keep | K1 | 2 | 2 |
| packages/thread/tests/worktree-prefix.keep.test.mjs | trim | E2 | 11 | 6 |

## Critical deleted

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

## Undecided

- electron/bridge-push and helper-bridge use short real sleeps (50 to 100 ms) around real sockets. They are tagged standard and left as they are, W7 is only half fixed.
- electron/process-job and process-job-limits keep a 15 s poll window for real processes. It is a poll limit, not a test timeout.
- Counts of cases in a table of cases (it.each) are one per call, not per row.
