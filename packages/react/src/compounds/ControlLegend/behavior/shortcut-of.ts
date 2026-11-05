/* @layer renderer-shell @kind logic */
import { MOUSE_OF } from '../ControlLegend.constants';
import type { ControlHint, ControlShortcut } from '../ControlLegend.type';

const shortcutOf = (hint: ControlHint): ControlShortcut =>
  (hint.glyph === 'key' ? { keys: hint.keyName } : { mouse: MOUSE_OF[hint.glyph] });

export { shortcutOf };
