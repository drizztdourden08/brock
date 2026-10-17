---
'@drizztdourden08/brock-react': minor
---

Escape on a window now closes it, and Escape with no window open reopens the last one closed. This changes what every app does on Escape.

- With a screen window open (a hub, a page, a sub-page, any `ScreenWindow`), Escape closes it in one press. It no longer goes up to the page, then to the hub home, before closing. Back, Alt+Left and the mouse Back button still walk the page history.
- With nothing open, Escape reopens the window closed last, on the page, tab or sub-page it was on, with its page history and the scroll offsets of its scroll areas. The last closed window is kept in the saved navigation (`closed`), so it comes back after a restart too. When no window was closed, or the last one is not allowed any more (a dev-only screen with developer tools off, a screen that needs a profile with none active), Escape opens the home screen as before, or the profiles route without a profile.
- Inner surfaces still take Escape first: a dropdown, a menu, a popover, a dialog, the palette, a tour, a text field with text in it. A title bar the keyboard revealed in full screen keeps its own Escape too, so leaving it does not reopen a window.
- New: `nav.reopen()` and the store's `reopen()`, `ClosedScreen`, `closed` in `SavedNavigation`, and the `'reopen'` `EscapeAction` (`reopenAvailable` in `EscapeState`). `nav.escape()` closes the open screen, or reopens the last one when none is open, and returns whether it did something.
- Removed: the store's `escapeTo` and `setEscapeTo`, which held where Escape went up to. An app that called `setEscapeTo` can drop the call.
- The review follows: the `buckets` step checks that Escape closes each hub from its last page in one press (`<hub>-escape`), that the next Escape reopens it on that page (`<hub>-escape-reopen`) at its scroll offset (`<hub>-reopen-scroll`, captured as `bucket-<hub>-reopened`); `<hub>-escape-up` is gone. The `escape-home` step checks that Escape reopens the last closed window (`escape-reopens-last`, captured as `escape-reopen`), then that it opens home when there is none to reopen (`escape-opens-home`).
