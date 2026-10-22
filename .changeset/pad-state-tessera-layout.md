---
'@drizztdourden08/brock-input': minor
'@drizztdourden08/brock-react': minor
---

The input module now uses the Tessera 0.50 controller types instead of its own copy. A `PadState` is now `{ slots, extras }`. `slots` holds the 20 Tessera slot ids with `pressed`, `value`, `x` and `y`. The ten extra controls (`extra.misc2` to `extra.misc6`, the four paddles and the touchpad) are no longer slots. They come as `extras`, a list of `{ id, label, pressed }` items shaped like Tessera's `ControllerExtra`, so `pad.slots` and `pad.extras` go straight into `ControllerLayout`. `onPadState` and `usePadState` carry the new shape. Read `pad.slots['face.south']` where you read `pad['face.south']` before. `CONTROLLER_SLOT_IDS` is no longer exported by the input module, import it from Tessera. Requires Tessera 0.50.0.
