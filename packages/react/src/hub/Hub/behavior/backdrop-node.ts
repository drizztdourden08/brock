/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { BackdropLayer } from '@drizztdourden08/tessera/primitives';
import type { PageBackdrop } from '../../../screens/conventions/screens-config.type';

const backdropNode = (backdrop: PageBackdrop | undefined): ReactNode => {
  if (backdrop === undefined) return undefined;
  if (backdrop.kind === 'none') return null;
  return createElement(BackdropLayer, { backdrop });
};

export { backdropNode };
