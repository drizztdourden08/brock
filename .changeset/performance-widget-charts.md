---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-electron': minor
'@drizztdourden08/brock-react': minor
---

The Performance widget is drawn with Tessera's chart parts.

- A row of `StatTile`s for frame rate, CPU, memory and event loop lag, each with its change since the last sample and a `Sparkline` of the last 60 samples; `Gauge`s for the app's CPU, its share of system memory and the JS heap, sized to fit; a `StackedBar` of memory by process (main, renderer, GPU, utility, widget windows); an Activity list of long tasks, errors and warnings; and every reading in a collapsed Details section.
- A container query puts two tiles a row when docked and four a row, with the gauges beside memory and activity, from 560 px. The widget no longer wraps itself in a `ScrollArea`; the widget body scrolls.
- The refresh and sections options, Copy snapshot and sampling only while shown stay as they were.
- `ProcessDiagnostics` adds `memoryTotalBytes`, and each `ProcessMetric` adds `window`, the Brock window a renderer process draws (`main` or a widget id).
- The review checks that the tiles, sparklines, gauges and memory bar render and move, that the panel adds no scroll box of its own, and captures the widget docked and popped out narrow and wide.
