/* @layer renderer-shell @kind logic */
import { uniqueById } from '../../../collections/unique-by-id';
import { joinRoute } from '../../../navigation/join-route';
import { iconNode } from '../../../screens/conventions/icon-node';
import type { HubLiveSource, HubPage, LivePage } from '../../hub.type';
import { liveBadge } from './live-badge';

const livePageOf = (holder: HubPage, source: HubLiveSource, item: LivePage): HubPage => ({
  id: joinRoute(holder.id, item.key),
  label: item.title,
  icon: iconNode(item.icon ?? source.meta.icon),
  badge: liveBadge(item.badge),
  keywords: source.meta.keywords,
  liveRef: { source: holder.id, key: item.key },
  render: item.render,
});

const emptyPageOf = (holder: HubPage, source: HubLiveSource): HubPage => ({
  id: holder.id,
  label: source.meta.empty,
  icon: iconNode(source.meta.icon),
  disabled: true,
  render: () => null,
});

const expandLive = (holder: HubPage, items: readonly LivePage[]): HubPage[] => {
  const { live } = holder;
  if (live === undefined) return [holder];
  const listed = uniqueById(items.filter((item) => item.key !== '').map((item) => livePageOf(holder, live, item)));
  return listed.length === 0 ? [emptyPageOf(holder, live)] : listed;
};

export { expandLive };
