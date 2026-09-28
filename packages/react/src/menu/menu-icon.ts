/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { Icon, ICONS } from '@drizztdourden08/tessera/primitives';
import type { IconName } from '@drizztdourden08/tessera/primitives';

const isIconName = (value: string): value is IconName => Object.hasOwn(ICONS, value);

const menuIcon = (icon: ReactNode): ReactNode =>
  typeof icon === 'string' && isIconName(icon) ? createElement(Icon, { name: icon }) : icon;

export { menuIcon };
