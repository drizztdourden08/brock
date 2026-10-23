/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { Badge } from '@drizztdourden08/tessera/primitives';
import { LIVE_BADGES } from '../../hub.constants';
import type { LiveBadge } from '../../hub.type';

const liveBadge = (badge: LiveBadge | undefined): ReactNode => {
  if (badge === undefined) return undefined;
  const { color, label } = LIVE_BADGES[badge];
  return createElement(Badge, { variant: 'dot', color, label });
};

export { liveBadge };
