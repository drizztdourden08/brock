/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import type { PageBackdrop } from '../../../screens/conventions/screens-config.type';
import { HubBackdrop } from '../sub-components/HubBackdrop';

const backdropNode = (backdrop: PageBackdrop | undefined): ReactNode => {
  if (backdrop === undefined) return undefined;
  if (backdrop.kind === 'none') return null;
  if (backdrop.kind === 'node') return backdrop.node;
  return createElement(HubBackdrop, { backdrop });
};

export { backdropNode };
