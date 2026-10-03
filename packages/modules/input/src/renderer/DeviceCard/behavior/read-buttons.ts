/* @layer renderer-shell @kind logic */
import type { PressedGridItem } from '@drizztdourden08/tessera/composites';
import type { InputIconFamily } from '@drizztdourden08/tessera/primitives';
import { controlIcon } from '../../../compounds/CalibrationPanel';
import { SDL_BUTTON_NAMES } from '../../../input.constants';
import type { ButtonReading } from '../DeviceCard.type';

const labelOf = (label: string | undefined, name: string): string => (label === undefined || label === '' ? name : label);

const itemOf = (family: InputIconFamily, name: string, label: string): PressedGridItem => {
  const icon = controlIcon(family, 'button', name);
  return icon ? { id: name, icon, title: label } : { id: name, label, title: name };
};

const readButtons = (buttons: readonly boolean[], hasButton: readonly boolean[], labels: readonly string[], family: InputIconFamily): ButtonReading => {
  const present = SDL_BUTTON_NAMES.map((name, index) => ({ name, index })).filter(({ index }) => hasButton[index]);
  const items = present.map(({ name, index }) => itemOf(family, name, labelOf(labels[index], name)));
  const pressed = present.filter(({ index }) => buttons[index]).map(({ name }) => name);
  return { items, pressed };
};

export { readButtons };
