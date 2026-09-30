/* @layer renderer-shell @kind logic */
import type { PressedGridItem } from '@drizztdourden08/tessera/composites';
import { SDL_BUTTON_NAMES } from '../../../input.constants';
import type { ButtonReading } from '../DeviceCard.type';

const labelOf = (label: string | undefined, name: string): string => (label === undefined || label === '' ? name : label);

const readButtons = (buttons: readonly boolean[], hasButton: readonly boolean[], labels: readonly string[]): ButtonReading => {
  const present = SDL_BUTTON_NAMES.map((name, index) => ({ name, index })).filter(({ index }) => hasButton[index]);
  const items: PressedGridItem[] = present.map(({ name, index }) => ({ id: name, label: labelOf(labels[index], name), title: name }));
  const pressed = present.filter(({ index }) => buttons[index]).map(({ name }) => name);
  return { items, pressed };
};

export { readButtons };
