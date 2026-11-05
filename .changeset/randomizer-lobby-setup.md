---
'@drizztdourden08/brock-randomizer': minor
---

The randomizer module now ships the Archipelia lobby setup and the profile fields. `LobbySetup` and its draft helpers (`useLanServers`, `useBrowsedLobbies`, `useLobbyCheck`, `useNetworkAccess`) read the module's own lobby client and LAN bridge. `ArchipeliaConnection` is a ready connection body: a game registers it under `views.connection` for its lobby mode. `lobbyConnectionFieldsOf`, `lobbyRowChip`, `buildLobbyFacts`, `lobbyStatusLine` and `randomizerFactsOf` build the saved fields, the row chip and the profile facts.
