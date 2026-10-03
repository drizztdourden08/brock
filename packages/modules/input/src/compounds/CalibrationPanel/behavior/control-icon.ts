/* @layer renderer-shell @kind logic */
import { INPUT_ICONS, gamepadInputIcon } from '@drizztdourden08/tessera/primitives';
import type { InputIconFamily, InputIconSource } from '@drizztdourden08/tessera/primitives';
import { SDL_CONTROL_IDS, STICK_ICON_NAMES } from '../CalibrationPanel.constants';
import type { InputGlyphKind } from '../sub-components/InputGlyph.type';

const stickIcon = (family: InputIconFamily, name: string): InputIconSource | null => {
  const glyphs: Readonly<Record<string, unknown>> = INPUT_ICONS[family];
  const found = STICK_ICON_NAMES[name]?.find((candidate) => Object.hasOwn(glyphs, candidate));
  return found === undefined ? null : ({ family, name: found } as InputIconSource);
};

const controlIcon = (family: InputIconFamily, kind: InputGlyphKind, name: string): InputIconSource | null => {
  if (kind === 'stick') return stickIcon(family, name);
  return gamepadInputIcon(family, SDL_CONTROL_IDS[name] ?? name);
};

export { controlIcon };
