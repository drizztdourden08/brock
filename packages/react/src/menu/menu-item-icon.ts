/* @layer renderer-shell @kind logic */
import { createElement, isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Span } from '@drizztdourden08/tessera/primitives';
import type { IconName } from '@drizztdourden08/tessera/primitives';
import { isIconName } from './is-icon-name';

const menuItemIcon = (icon: ReactNode): IconName | ReactElement | undefined => {
  if (typeof icon === 'string') return isIconName(icon) ? icon : createElement(Span, null, icon);
  return isValidElement(icon) ? icon : undefined;
};

export { menuItemIcon };
