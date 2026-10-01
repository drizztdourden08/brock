/* @layer renderer-shell @kind logic */
import { ICONS } from '@drizztdourden08/tessera/primitives';
import type { IconName } from '@drizztdourden08/tessera/primitives';

const isIconName = (value: string): value is IconName => Object.hasOwn(ICONS, value);

export { isIconName };
