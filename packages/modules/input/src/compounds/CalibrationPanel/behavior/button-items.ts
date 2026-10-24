/* @layer renderer-shell @kind logic */
import type { PressedGridItem } from '../../PressedGrid';
import type { InputIconFamily } from '@drizztdourden08/tessera/primitives';
import { controlIcon } from './control-icon';

const buttonItems = (items: readonly PressedGridItem[], family: InputIconFamily): PressedGridItem[] =>
  items.map((item) => ({ ...item, icon: item.icon ?? controlIcon(family, 'button', item.id) ?? undefined }));

export { buttonItems };
