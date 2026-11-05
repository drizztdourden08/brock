/* @layer core @kind constants */
import { AXIS_INDEX, BUTTON_INDEX } from '../../family/sdl-capabilities.constants';
import type { SdlButtonName } from '../../pad/sdl-button-name.type';
import type { SdlAxisName } from '../../sdl/sdl-buttons.type';

const BUTTON_BY_INDEX = new Map<number, SdlButtonName>(
  (Object.keys(BUTTON_INDEX) as SdlButtonName[]).map(name => [BUTTON_INDEX[name], name]),
);

const AXIS_BY_INDEX = new Map<number, SdlAxisName>(
  (Object.keys(AXIS_INDEX) as SdlAxisName[]).map(name => [AXIS_INDEX[name], name]),
);

const TRIGGER_AXIS_NAMES: readonly SdlAxisName[] = ['LEFT_TRIGGER', 'RIGHT_TRIGGER'];

export { AXIS_BY_INDEX, BUTTON_BY_INDEX, TRIGGER_AXIS_NAMES };
