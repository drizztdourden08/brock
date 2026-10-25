/* @layer renderer-shell @kind logic */
import { SDL_BUTTON } from '../../../../../sdl/sdl-buttons.constants';
import type { ResolvedDevice } from '../../../../../family';
import type { SdlButtonName } from '../../../../../pad/sdl-button-name.type';
import type { PositionalTarget } from './positional-capture.type';

const buildPositionalTargets = (resolvedDevice: ResolvedDevice | null): PositionalTarget[] => {
  if (!resolvedDevice) return [];

  return resolvedDevice.controls.map((control) => ({
    id: control.position,
    kind: control.kind,
    label: control.label,
    category: control.category,
    expectedIndex: control.kind === 'button' ? SDL_BUTTON[control.position as SdlButtonName] : null,
  }));
};

export { buildPositionalTargets };
