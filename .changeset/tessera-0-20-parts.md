---
'@drizztdourden08/brock-react': patch
---

Brock uses the Tessera 0.20 parts in place of its own stand-ins:

- Reset layout, and any menu entry with `confirm`, is a Tessera `DropdownMenu` item of `kind: 'confirm'`: the first press asks in the danger tone and keeps the menu open, the second runs it. `confirm: true` takes Tessera's words (Click again to reset layout), a string its own. Brock's check item stand-in and `useMenuConfirmStore` are gone.
- `WidgetHost` passes `WidgetManager` and its gates `contextActive={(definition) => …}`, stable with `useCallback`, answering from the context registry, and no longer hides context widgets itself.
- A title bar `kind: 'menu'` item takes `tone` and `effect`, like a button or a status.
- The hub search and palette mascots and the hero mascot are `<AnimatedMascot brand="auto">` on Tessera's state machine: the hero waves once and blends into idle, and a search with no match cuts in with `alert` on each new query and settles into `worried`. The hero's fallback `BrandMark` passes `ground="dark"`.
- ToastHost, SettingPathField (now on `PathInput`), the boot failure splash, the shortcuts help and the diagnostics preview import their parts from `/composites`.
