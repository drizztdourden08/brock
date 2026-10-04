<!-- @layer docs @kind doc -->
# Widget window resize review (2026-10-04)

Full review of how Brock resizes widget windows and the main window, from the OS drag to the final bounds, written after two fixes passed the headless review but failed under a real mouse. The owner runs Windows 11 on a 4K display at 200% scaling.

The owner's setup: the logs widget is popped out and snapped flush to the left edge of the main window. Its right edge touches main's left edge, the bottoms line up, and logs is shorter than main.

| # | Symptom |
|---|---|
| 1 | Dragging logs' top edge up works until its top reaches main's top y, then both windows start resizing in other directions |
| 2 | Even in that case, logs looks shifted a few pixels left the moment the resize starts, and no longer touches main |
| 3 | Any other edge or corner, on either window, goes wrong at once |

Moving and snapping were fine. Only resizing was broken.

## Measured on the owner's machine

The analysis below rests on measurements, not on the Electron docs. A scratch Electron 42.11.8 app opened a `titleBarStyle: 'hidden'` window (like main) at DIP (700, 150, 800, 600) and a `frame: false` window (like a widget) at (400, 350, 300, 400), owned by the first, on Windows 11 26200 at 3840x2160 and 200%. A script then drove a real OS sizing loop with `SetCursorPos` and `mouse_event`, 5 physical pixels per step, and logged every event.

| Fact | Evidence |
|---|---|
| `newBounds` in `will-resize` is the raw window rectangle, with the invisible resize borders, not `getBounds()` | first event of a top drag: `getBounds()` (400, 350, 300, 400), `newBounds` (394, 350, 312, 406). The left, right and bottom borders are 6 DIP (12 px); the top has none. The main window shows the same 6/0/6/6 |
| The left, right and bottom resize grips sit in that invisible band, outside the visible window; the top grip is inside | a press 2 DIP inside the right or bottom edge started nothing; 3 DIP outside started a resize; 2 DIP inside the top worked |
| `details.edge` is right and includes `top` | `top`, `left`, `right`, `bottom` reported as dragged, though the type lists no `top` |
| The dragged side of `newBounds` follows the cursor from the drag start, whatever the handler did before | `preventDefault()` on steps 3 to 6 froze the window; step 7 proposed top 340, the cursor's place, and the window jumped there |
| After `preventDefault()` plus `setBounds(R)`, the next proposal keeps R's raw rectangle on the sides not dragged | a handler that set `R = newBounds` saw x go 394, 388, 382 and width 312, 324, 336: the window grew 6 DIP per side per step |
| `setBounds` inside `will-resize` fires `resize` then `move` synchronously, inside the handler | both events logged with the handler still on the stack |
| A `setBounds` on a window in its own sizing loop, from outside its `will-resize`, is replayed when the drag ends | a `setTimeout` moved logs to x 370 at step 5; the drag went on; after `resized` the window jumped back to (370, 348, 300, 403) |
| A resize ends with `resized` only, never `moved` | no `moved` in any resize log |
| The first `WM_SIZING` of a drag carries no cursor movement | steps 1 to 3 of every run proposed the start rectangle |
| An odd physical cursor row rounds the far edge | the OS placed the top at 348 with height 403, so the bottom read 751 for one step |
| `getContentBounds()` is 1 DIP narrower on the left than `getBounds()` on both window kinds | (701, 150, 799, 600) against (700, 150, 800, 600) |

## Event flow before the fix

Widget window, one drag of an edge:

1. Mouse down on a grip. Windows enters its modal sizing loop for the window (`WM_ENTERSIZEMOVE`).
2. On each mouse move Windows sends `WM_SIZING` with its tracked raw rectangle: the dragged side from the cursor, the others from its last rectangle. Electron converts it to DIP with `ScreenToDIPRect` and emits `will-resize(event, newBounds, { edge })`.
3. `attach-widget-window.ts` called `windowGuide.touch('resizing')`, then `resizeBounds(id, newBounds, edge)`.
4. `resizeBounds` read `current = getBounds()` and the other windows through `edgeWindows` (main through `getBounds()`, widgets through their cached `entry.last`), then `planResize`.
5. `planResize` fitted main's aspect lock when the dragged window was main, snapped the edges named by `edge` with `resizeSnap`, then ran `sharedEdgeResize(current, snapped, others)`.
6. `sharedEdgeResize` treated every side whose line differed between `current` and the proposal as moved, and for each one took every window whose facing edge was flush with it, moving that edge to the new line.
7. `applyMoves` started `towHold` (400 ms) and `setBounds` on each partner through `placeMember`, which set `entry.towed`, `entry.last` and scheduled a bounds report.
8. When the planned rectangle equalled `newBounds`, the handler returned and Windows applied its own rectangle. Otherwise it called `preventDefault()` and `setBounds(planned)`.
9. Every `setBounds` fired `resize` and `move` at once. On a widget, `move` ran `followLive`, which towed the windows linked to it unless `towHold` was held, and `watchDragIn`, which could fade the window and tell the renderer about a drag over the app.
10. On main, `move` and `resize` scheduled a tow on `setImmediate`, which ran `towLinked('main', normal, now)` on every linked widget unless `towHold` was held.
11. Mouse up: `WM_EXITSIZEMOVE`. Electron emitted `resized`, then replayed any pending `setBounds`. `resized` ran `settleWindow`, which towed linked windows from `entry.last` to now, dropped links no longer flush, and scheduled a debounced report (300 ms) to the renderer.

Main window: the same loop. `followMainGroup` ran `resizeBounds('main', ...)` in step 3, and, once the renderer set an aspect lock, `aspect-ratio.ts` added a second `will-resize` listener that fitted the ratio with `ratioBounds(getBounds(), newBounds)` when the first had not prevented the event. Nothing ended a main resize.

## Invariants each piece assumed

| Piece | Assumed |
|---|---|
| `resizeBounds`, `planResize` | `newBounds` and `getBounds()` are in one coordinate system, so a side that differs between them is a side the user moved |
| `resizeSnap` | the edge named by `details.edge` is the only one to move; the lines of the other windows hold still |
| `sharedEdgeResize` | the windows flush with a moved side are the ones that should follow, measured fresh on every event |
| `edgeWindows` | `entry.last` is live, though `move` is the only thing refreshing it during a resize |
| `towLinked`, `followLive`, main's tow | a window moved or resized because its anchor did, so a link should drag it along |
| `towHold` | a 400 ms window covers any burst of programmatic moves |
| `settleWindow` | `entry.last` is the bounds before the gesture, so `last` to `now` is the gesture |
| `aspect-ratio.ts` | `newBounds` has the window's size, so fitting it to the ratio keeps the window's size |
| Renderer | bounds flow main to renderer only (`widget:bounds`); `widget:popOut` for an open window never moves it |

## Where the pieces fought

| Place | What happens | Effect |
|---|---|---|
| Raw `newBounds` against `getBounds()` | every proposal differs from the window by 6 DIP on the left, right and bottom; `sharedEdgeResize` reads those sides as moved | a flush neighbour's facing edge is pushed 6 DIP at the first step |
| `setBounds(planned)` inside `will-resize` | `planned` was built from the raw proposal, so it adds the borders to the visible size; the next proposal starts from that bigger rectangle | the window grows 6 DIP per side per step, and its neighbours are pushed along |
| `preventDefault` then `setBounds` | needed to keep a rectangle the OS did not propose, safe on its own; the harm came only from feeding it raw values | |
| `resize` and `move` from a programmatic `setBounds` | fired inside the handler: `followLive` towed the windows linked to the dragged one, main's tow ran on the next tick | `towHold` hid the tow while partners moved, and let it run again once no partner moved for 400 ms |
| Main's tow and a widget resize | main resized as a partner fires `resize`, then tows every widget linked to it, including the one being dragged when the hold has run out; a `setBounds` on that window is then replayed at mouse up | a jump back to a stale rectangle after release |
| A widget's tow and main's resize | a widget whose `move` fires as a partner of main runs `followLive` and tows its own links | chains of windows shifting |
| Edges that become flush mid-drag | `sharedEdgeResize` took partners fresh on every event, so a window whose edge the dragged side reached mid-drag joined; the cached `entry.last` of the others lagged | partners appeared and vanished during one drag |
| Aspect ratio | fitted on raw `newBounds` in both `planResize` and `aspect-ratio.ts`, so a locked main grew the same way; main moved by a partner had no ratio, which was intended | |
| Renderer bounds | the renderer stores `widget:bounds`; `widget:popOut` for an open window only raises it, so nothing from the renderer reaches an open window during a drag | no fight; kept that way |
| Debounced reports | `placeMember` scheduled a report on each step; it reads `getBounds()` when it fires, so it carries live bounds, never stale ones | no fight |
| `watchDragIn` | ran on every `move` of a resized widget and could fade it and show the drop zone when the cursor crossed the app | unwanted signals during a resize |

## Pixels, scaling and frameless quirks at 200%

- One DIP is 2 physical pixels. Electron converts the OS rectangle with `ScreenToDIPRect`: origin floored, far edge from the enclosing rectangle. A window placed by `setBounds` always sits on even physical pixels, so it reads back exactly. A window placed by the OS at an odd cursor row reads one DIP taller for that step.
- Both window kinds have `WS_THICKFRAME` and a client area stretched over the whole window, so `getBounds()` is the visible rectangle. The OS rectangle in `WM_SIZING` keeps the invisible resize borders, 6 DIP left, right and bottom, none on top. The drop shadow is drawn in that band and has no part in any value Electron returns.
- The few pixels of symptom 2 are those borders: 6 DIP, 12 physical pixels. They are not the shadow and not rounding.
- `getContentBounds()` differs from `getBounds()` by 1 DIP on the left. Brock compares windows with `getBounds()` on both sides, through `boundsOf`, and must keep doing so.
- `details.edge` names the grip the user holds, `top` included. The type in `electron.d.ts` leaves `top` out. On macOS the docs say only `bottom` (vertical) and `right` (horizontal) are reported, so the edge alone does not name the side there.

## Root causes

1. `will-resize` gives the raw OS rectangle and Brock treated it as `getBounds()`. Every proposal shows the left, right and bottom sides moved by 6 DIP. Symptom 2: the shared-edge code pushed main's facing edge 6 DIP right at the first step, opening a gap that reads as logs moving left. Symptom 3 for edges far from any snap line: the same gap at the start of every drag, on either window.
2. Brock fed the raw rectangle back through `setBounds`. Once snapping changed a proposal, the planned rectangle carried the borders into the visible window, and the OS kept that bigger rectangle for the next proposal: 6 DIP more per side on every step, with the flush neighbour pushed each time. Symptom 1: snapping starts when logs' top comes within 14 DIP of main's top, and the runaway starts with it. Symptom 3 for the bottom edges: the bottoms line up, so snapping, and the runaway, start at the first step.
3. Each event re-derived everything from current state: the moved sides from `getBounds()` against the proposal, the partners from whatever was flush at that moment, the others from a stale `entry.last`. A side counted as moved because of the borders, or a window that became flush mid-drag, changed the plan between two steps. Part of symptoms 1 and 3.
4. Programmatic `setBounds` calls re-entered towing and snapping through `move` and `resize`, and only a 400 ms timer kept them apart. Towing a window during its own sizing loop is replayed by Electron at mouse up. Part of symptom 1 ("both windows"), and jumps after release.
5. Nothing marked the start or the end of a resize, so no part of the code knew a drag was in progress. The guide closed on `resized`, the tow baseline and the cached bounds were never reset for main, and the renderer heard drag-over signals from a resize. Background to all three.

## The fix

One resize session per drag, in `resize-session.ts`.

1. The first `will-resize` of a window opens a session. It records the dragged window's `getBounds()`, the first raw proposal, the sides being dragged, and the main aspect lock.
2. Followers are captured once, at that moment: every visible window whose facing edge is flush, within 1 DIP, with a side of the dragged window and overlaps it along that side. A window that becomes flush later never joins; it is only a snap line. Main never follows while its aspect lock is on.
3. Each step places the dragged sides at their start line plus how far the raw proposal moved since the first event. The borders cancel out, and the first step changes nothing, so there is no shift at the start.
4. The step keeps the window's minimum size, fits main's aspect lock when main is the dragged window, snaps only the dragged sides to the other windows' lines (a follower is no snap line along the axis it follows), then clamps each moved side so every follower keeps its minimum size.
5. Followers take the line of the side they follow, from their start bounds. With Ctrl held they go back to their start bounds and nothing snaps.
6. The handler always calls `preventDefault()` and `setBounds` the visible rectangle it planned, so the OS never applies a raw rectangle.
7. While a session is open, towing, link checks, drag-over signals and bounds reports are off. Main's tow skips any change made during a session.
8. `resized` closes the session: cached bounds are refreshed, links that are no longer flush are dropped, and one report per touched window goes to the renderer.
9. `aspect-ratio.ts` no longer listens to `will-resize`; main's ratio is applied inside the session.

The simulator in `packages/electron/tests/window-sim` models Electron's window loop with the measured behaviour (raw rectangle with 6/0/6/6 borders, cursor-driven dragged side, `preventDefault` semantics, synchronous `resize` and `move`, replay of pending bounds at mouse up, `resized` at the end, minimum sizes) and drives the real Brock handlers. `resize-drag.keep.test.ts` replays the owner's drags; it failed on 22 of 23 cases before the fix.
