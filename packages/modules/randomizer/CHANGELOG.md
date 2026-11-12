# @drizztdourden08/brock-randomizer

## 0.121.0

### Minor Changes

- 0e226f6: The Archipelago network status gains the items sent to other players, hint points, the reconnect attempt and next retry time, the ping mean and sample count, and the tracker link progress of each player. Tracker links now follow the connection: a drop closes them and resets the roster, a reconnect reopens them, and a player's online state reads null until the server says otherwise.

  A received item from a negative location now names the server as its sender.

  A drop now closes the tracker links before the roster resets, so the roster asks again after the reconnect. A location scout lost to a drop is sent again on the next connect.

  The roster no longer sends '!players', so connecting no longer echoes it in every player's chat; online reads null until a Join, Part or tracker link says otherwise.

- bcc848f: The randomizer module now carries the Archipelia lobby client, the lobby socket and the Archipelago world export. A game plugs in through the new `ArchipelagoGame.archipelia` hook and plain inputs to the export functions. New `./preload` subpath exposes `window.api.randomizer` with the lobby socket and the save-files call.
- 33ce702: The randomizer session survives a paused core. Roll may be async and gets a RollContext. The world takes a WorldStamp. A poll.loaded hook asks for a rebaseline. registerRandomizerGame starts the runtime. Option defs carry choices, sections and hints, and a game options body gets the step props. A new ./memory subpath ships. Port-kit sessions take prepareAssets. Profile build hooks may be async. The isDisabled function gets the composed lock cause, and useLockCauseOf reads it.
- 046598d: The Connection step of the profile wizard now shows for any mode that has an entry in `views.connection`. An entry is either a body component, as before, or a `ConnectionView`: `{ Body, validate?, summary? }`. Both hooks get the connection slice values and the wizard values. The online mode keeps its server fields, its checks and its summary when the game gives no entry for it. The review lists the connection of a custom mode with its summary.

  `game.roll` now runs for every mode except online. `RollContext` carries the `mode` and the `connection` values of the wizard, as an opaque record the game reads. The wizard passes them on `CreateProfileOptions.randomizerConnection`, and other callers can pass them the same way.

  `roll` may return `joinedRoll(result)`, a `RollJoined` (`{ kind: 'joined', result }`), in place of a placement. No placement is written then. `game.onJoined(result, { profileId, config })` runs once the profile is created. A roll that returns a placement works as before. `isJoinedRoll` tells the two apart.

- 78b61a4: The randomizer module exports generic Archipelago adapter defaults (`idAdaptersOf`, `isFromServer`, `receivedOrderBySender`, `substituteForeign`) and the generic `deliverServerItem`, so a game no longer copies them.
- 19467a7: New `./archipelago` subpath with the Archipelago client types, plus `RandomizerGame.archipelago`, the online mode and its connection fields.
- 8dbd094: The checks tracker is generalized. A game fills it through optional `TrackerProvider` hooks: `artOf`, `facets`, `facetsOf`, `kindOf`, `badgesOf` and `statusesOf`, and `TrackerGrouping` takes a `description`. The checks view gains summary counts, status, kind and tag filters, and compact, detailed and card layouts. It shows a placeholder when `artOf` returns null. The spoiler page uses the same view. A game that sets the new optional `inventory` provider (`InventoryProvider`, layouts of areas, rows and tiered slots) gets an inventory widget. A game without it carries no inventory widget.
- e5d4133: A game connection body now gets the connection record as its value, and its patches go to that record. The renderer entry exports CONNECTION_SLICE, the wizard key of that record.
- 6c5b104: `GameWorldDef` takes an optional `seedValues(request)` hook. Its values fill `world.seedValues`, so rules can read seed nodes and the exported apworld answers them through `pre_rolled`.
- 904231b: `views.optionsStep` and `views.optionSubSteps` are removed. Use `views.optionTabs` and `views.optionsAside`.
- 7d77d92: A randomizer game can list extra wizard modes with an id, a label and a rank through the new `modes` field.
- dc9ed12: The module now carries the launch connect and LAN discovery glue. The main entry adds `createRandomizerMain({ mdns })` with the LAN handlers (beacon listener, optional injected mDNS browser, firewall status and allow) and `launchRendererFlags(argv)`. The preload bridge adds `lan`. The renderer entry adds `launchConnect`, `launchesConnection` and `awaitLaunchConnection`, driven by a `LaunchConnectHost` the game supplies. The `--ap-connect` and `--lobby-join` parsers are exported from the archipelago entry.
- 5c4d9b9: The archipelago entry exports openLobbyLink with its LobbyLink and LobbyLinkHandlers types, and the renderer entry exports the JoinFormOptions and JoinOutcome types of joinFromForm.
- 8bc0a84: The randomizer module now ships the Archipelia lobby setup and the profile fields. `LobbySetup` and its draft helpers (`useLanServers`, `useBrowsedLobbies`, `useLobbyCheck`, `useNetworkAccess`) read the module's own lobby client and LAN bridge. `ArchipeliaConnection` is a ready connection body: a game registers it under `views.connection` for its lobby mode. `lobbyConnectionFieldsOf`, `lobbyRowChip`, `buildLobbyFacts`, `lobbyStatusLine` and `randomizerFactsOf` build the saved fields, the row chip and the profile facts.
- 4bc7c8b: The randomizer log passes a line id (autoStart, armed, rerollFailed) as a third argument, so a game's own log can route those lines to another channel.
- 336cd72: Games can word the boot log lines through the optional `logText` on the game contract, and the boot gate result now carries the raw `detail` of a block.
- 5de71cd: Randomizer game modes take an optional when rule, and the wizard falls back to local when the chosen mode is hidden.
- 03cfe46: Add the randomizer module with its world model, seeded rng and schema checks.
- 64aee57: The randomizer module provides the online notice settings (`isNoticeKindShown`, `ONLINE_NOTICE_DEFAULTS`, `noticeSettingKey`), the online settings rows (`onlineSettingsSections`), and the `ArchipelagoFiles` view with its `ArchipelagoFilesSlot` run panel, which saves the player yaml and the world package to a picked folder.
- 47bed9c: The default options tab now renders each option as a row with a tag, a description, a control that follows the option kind and an optional pool impact cell, grouped by option group, with an Upcoming tab for options not yet implemented. OptionDef gains kind, range, group, description, details and implementation, and the renderer exports RandomizerOptionRow, OptionGroupList, OptionTabBody, UpcomingTabBody, PoolImpactCell and SpriteTileSet.
- 1118717: The options step and the Options page now share one options panel with a tab per section (or per `views.optionTabs` entry), a changed count on each tab and an optional `views.optionsAside`. A tab can bring its own `Body`. `views.connection[mode]` replaces the connection step body for a mode. `RollContext` gains `onProgress`, surfaced as `useRollProgress`. New exports `useOptionTab` and `randomizerReviewSections` serve an app's own wizard review. `views.optionsStep` and `views.optionSubSteps` are deprecated in favour of `optionTabs`.
- 657a652: RandomizerTypeRegistry takes an options slot, like frozenSettings. A game that sets it gets its own type for RandomizerProfileConfig.options; without it the type stays Record<string, unknown>.
- 17c731e: `addRandomizerPages` entries can carry a route, an order and a `when` predicate, and an entry whose key is a built-in page id (run, options, network, online, logs, spoiler) replaces that page in place.
- 869d990: The Run page is a dashboard grid: Summary, Progress, Recent activity, Players, Settings, then the game's run panels with their spans. A game run panel may be a plain component or a RunPanelDef with an id, title, span and Body. The Network page uses the same grid. The Logs page classifies entries with generic activity kinds, then the game's logRules. Labels gain counters, events and kinds. The dashboard building blocks (DashboardCard, StatTiles, tallyTile, sessionToneOf, formatTime) are exported from the renderer.
- 8075c58: Add the randomizer game contract, profile types, session and memory types, main profile hooks and the game registry.
- 69408a1: The `./session` export is main-process safe again. `createLocalSessionFactory`, `createOnlineSessionFactory`, `useSessionStore`, `startSession`, `stopActiveSession`, `currentRun`, `readPlacement`, `writePlacement`, `gateRandomizerBoot`, `startSessionRuntime` and `appRandomizerLog` reached `@drizztdourden08/brock-react`, so they now come from `@drizztdourden08/brock-randomizer/renderer`.
- 984bf8a: New `@drizztdourden08/brock-randomizer/test-kit` entry with the Archipelago test helpers a game's tests import: the fake server, the protocol harness with its fake core, and the apworld oracle rig, spoiler parser and forward replay.
- 6d4f75b: The randomizer renderer gains the tracker and run UI that apps used to write themselves. `CheckToasts` announces a check found and an online room notice, and reads the registered game's tracker. `DeliveryQueueIndicator` lists the items waiting to be delivered, fed by the delivery queue through `useDeliveryQueue`. `ProfileRandomizerTab` shows a run's seed, type and connection facts and its options, changed or all, with the shared option rows. The core entry exports `randomSeed`, which returns 16 hex characters from the platform crypto. The wizard review summary is already covered by `randomizerReviewSections`.
- b9c3974: New `./tracker` subpath with the tracker provider contract and its types, plus the `tracker`, `Checks` and `checksWidget` slots on the randomizer game.
- 4d900c3: Run panels take an actions slot, and run panels and option tabs now receive the mode and the ROM file name. The options aside shows as an extra tab on narrow panels, and a game's log rules now match before the default ones.
- 002b52a: The inventory and checks widget slots now also set padding, icon and popOut, through one shared `WidgetSlot` type. The inventory widget shows a notice above the grid when the tracker has an `artOf` and no slot has art, with the text taken from `inventory.missingArtNotice`.
- 036f7f9: The world kit now covers collection state, reachable regions, event sweeps, location checks and rule compile with a K-typed helper registry.
- 862617a: Add `createWorldKit<K>()`, which returns the rule builders, combinators, `always`, `never` and the main fill phase bound to one set of world keys.
- 6107040: The randomizer module now ships a generic Archipelago world model. worldModelOf takes a fill world, the option values and a set of hooks the game passes in, and returns the model the apworld loader reads. preRolledOf wraps it as the pre-rolled block. plainOptionValue and snapshotOfPlainOptions turn plain player-file values into option values against a game's option catalog.
- 1204737: A SpriteTileItem takes an optional badge number, shown at the top right of its tile, for a pick order. A tile without a sprite shows the item's name instead of an empty image.

### Patch Changes

- fc626de: New brock-core subpath `util` with the shared `mulberry32` and `itemAt`. The msu, input and randomizer modules now import them from core instead of keeping their own copies.
- 48bec99: Wizard step bodies get `onSubStepChange`. The randomizer options panel tab strip works while the wizard passes `subStep`, and reports each pick so the stepper can follow.
- 3e56930: Add createSpriteStore and spriteBaseUrl to port-kit, a manifest driven store for extracted sprites served through a product scheme. The randomizer renderer now exports defaultOptionTabs.
- ea48271: A slot that has DeathLink off now turns the DeathLink tag off, even when the connection asked for it.

  A refused session now disarms the game.

- 9857bb4: The world subpath no longer loads the profile augment, so a game that declares its own randomizer profile field can import it.
- 62b03f7: The run summary reads option entries without a cast, so apps that augment the options type with a plain interface typecheck.
- Updated dependencies [4fdf3fc]
- Updated dependencies [fc626de]
- Updated dependencies [eca6521]
- Updated dependencies [33ce702]
- Updated dependencies [a1382a3]
- Updated dependencies [11fca93]
- Updated dependencies [48bec99]
- Updated dependencies [de3e01a]
- Updated dependencies [8403f85]
- Updated dependencies [19f0362]
- Updated dependencies [9d171e3]
- Updated dependencies [2238ad1]
- Updated dependencies [24626e9]
- Updated dependencies [36c43fe]
- Updated dependencies [ad2d364]
- Updated dependencies [c56e771]
- Updated dependencies [054cf0c]
  - @drizztdourden08/brock-core@0.121.0
  - @drizztdourden08/brock-electron@0.121.0
  - @drizztdourden08/brock-react@0.121.0
