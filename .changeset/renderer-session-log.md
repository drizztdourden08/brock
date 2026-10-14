---
'@drizztdourden08/brock-react': minor
---

The renderer writes its log to `Data/debug/session.log` and catches what nothing else did. `BrockApp` sends the app log there in batches through `debug:appendSessionLog` (the channel existed with no writer), and turns uncaught errors and unhandled promise rejections into error entries of the app log, in the main window and in each widget window. `sessionLog={false}` stops the writing; `catchGlobalErrors` and `writeSessionLog` are exported for an app with its own log bus.
