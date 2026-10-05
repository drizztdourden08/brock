---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-lint-config': minor
'@drizztdourden08/create-brock': minor
---

Guided tours are part of every Brock app, drawn by Tessera's `GuidedTour` and presented by the app's brand mascot. A tour is a file: `src/tours/<id>.tour.ts` default-exports `defineTour({ id, title, steps, trigger? })`. `brock sync`, `brock dev`, `brock build` and the renderer Vite plugin write `.brock/tours.ts`, `BrockApp` takes it as `tours`, and `RendererModule.tours` adds a module's tours. `brock structure` checks the folder, and `brock-lint-config` lets tour files default-export.

A step lights a Tessera target or a Brock one (`{ shell: 'menu' | 'search' | 'report-bug' | 'title-bar' | 'screen' }`, `{ widget: '<id>' }`, `{ setting: '<key>' }`). Before it shows it can `open` a screen or hub page, open a `widget`, set a `context` and run `before(ctx)`, which may be async. `advanceOn` waits for a click (`{ click: target }`), a tour event (`tours.emit(name)`) or a context change. Each step can name the mascot's state.

`tours.start(id)`, `tours.stop()`, `tours.next()`, `tours.back()` and `useTour()` drive tours. Completion and the last step are kept per profile in `ui-views.json`, so a finished tour doesn't come back by itself. `trigger: 'first-run'` starts a tour once, the first time a profile opens the app, after the boot and the splash. Menu > Take the tour (in Help when the app has a Help group, else in Advanced) and a search palette action per tour start them. Escape closes a tour, and the other shell shortcuts wait while one is open. The title bar stays usable over the tour. The menu knows a `help` section.

The review gets a `tours` step: it runs every tour end to end, clicks through interactive steps, captures each step and checks that the tour is kept as completed and that Escape closes it.

The template ships `welcome.tour.ts`, a four-step first-run tour of the menu, the search, the Notes widget (which waits for a click) and Settings. The 0.27.0 `tour-files` migration adds `tours={appTours}` and its import to `src/main.tsx`.
