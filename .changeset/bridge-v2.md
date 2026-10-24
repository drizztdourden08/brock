---
'@drizztdourden08/brock-electron': minor
---

Bridge v2 (protocol 2). `ctx.bridge.open()` and `ctx.bridge.close()` open and close the helper bridge at run time, each open with a new secret and endpoint; `bridge.openOnBoot: false` keeps it closed until the app opens it. `bridge.handleWith(route, (call, ...args) => ...)` gives handlers `call.connectionId`, and `bridge.onOpen`, `bridge.onClose` and `bridge.connections()` follow clients. `bridge.emit(event, ...args)` and `bridge.emitTo(connectionId, event, ...args)` push events, which the helper hears with `client.on(event, listener)` after `client.connect()`. The client authenticates with the session key before any request, and every server message is signed with it, pushes with their own counter. `BridgeError` takes `{ code, data }`, which reach the client as fields; other errors stay masked, and Brock's codes are in `BRIDGE_CODES`. `helperLaunch(name)` sets `BROCK_BRIDGE_FILE` to this app's discovery file.
