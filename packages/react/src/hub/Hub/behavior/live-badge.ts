/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import type { LiveBadge } from '../../hub.type';
import { LiveBadgeView } from '../sub-components/LiveBadge';

const liveBadge = (badge: LiveBadge | undefined): ReactNode => (badge === undefined ? undefined : createElement(LiveBadgeView, { badge }));

export { liveBadge };
