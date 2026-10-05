---
'@drizztdourden08/brock-react': patch
---

Guided tours use Tessera 0.22's own parts in place of Brock's shims. The title bar is kept live with `keep`: it stays usable and undimmed for the whole tour, also when the lit part is inside it, with no lift and no inert moving of Brock's own (the MutationObserver is gone). Steps that end on a tour event or a context are Tessera `advance: 'wait'` steps, so Next hides there too, and a click target apart from the lit part is Tessera's `clickTarget`. Tessera now places the bubble, so it stays in the window beside a tall target, and keeps the mascot off the lit part. Escape is Tessera's, in the capture phase: it closes the tour and no longer reaches the shell, so the screen under the tour stays open.
