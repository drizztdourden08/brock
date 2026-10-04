---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-electron': minor
'@drizztdourden08/brock-react': minor
---

A built-in Performance widget every app gets, closed by default and listed in the Widgets menu: the renderer (frame rate and frame time, long tasks, event loop lag, JS heap, DOM nodes), every process from main (CPU and memory per process, main process memory, uptime, windows and widget windows with their sync and group, IPC calls per second, runtime versions, GPU compositing) and the app state (version, screen and route, profile, open widgets, modules, errors and warnings since start). Its options set the refresh and the sections shown, sampling stops while it is off screen, and Copy snapshot puts the numbers on the clipboard for a bug report. The new `diagnostics:getProcesses` channel (`getProcessDiagnostics`) feeds it, and the review opens it and checks the numbers move.
