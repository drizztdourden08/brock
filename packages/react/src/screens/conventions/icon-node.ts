/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { Icon } from '@drizztdourden08/tessera/primitives';
import type { IconName } from '@drizztdourden08/tessera/primitives';

const iconNode = (name: IconName): ReactNode => createElement(Icon, { name });

export { iconNode };
