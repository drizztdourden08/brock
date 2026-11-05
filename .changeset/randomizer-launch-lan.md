---
'@drizztdourden08/brock-randomizer': minor
---

The module now carries the launch connect and LAN discovery glue. The main entry adds `createRandomizerMain({ mdns })` with the LAN handlers (beacon listener, optional injected mDNS browser, firewall status and allow) and `launchRendererFlags(argv)`. The preload bridge adds `lan`. The renderer entry adds `launchConnect`, `launchesConnection` and `awaitLaunchConnection`, driven by a `LaunchConnectHost` the game supplies. The `--ap-connect` and `--lobby-join` parsers are exported from the archipelago entry.
