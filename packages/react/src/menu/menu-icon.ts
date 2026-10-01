/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { Icon } from '@drizztdourden08/tessera/primitives';
import { isIconName } from './is-icon-name';

const menuIcon = (icon: ReactNode): ReactNode =>
  typeof icon === 'string' && isIconName(icon) ? createElement(Icon, { name: icon }) : icon;

export { menuIcon };
