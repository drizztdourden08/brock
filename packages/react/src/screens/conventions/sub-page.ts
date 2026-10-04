/* @layer renderer-shell @kind logic */
import type { HubSubPage } from '../../hub/hub.type';
import { renderSub } from '../kinds/render-sub';
import { entryLabel } from './entry-label';
import { hubHeader } from './hub-header';
import { iconNode } from './icon-node';
import { KIND_ICONS } from './screens.constants';
import type { BucketDef } from './screens-config.type';
import type { SubEntry } from './screen-tree.type';

const subPage = (bucket: BucketDef, entry: SubEntry): HubSubPage => ({
  id: entry.id,
  label: entryLabel(entry),
  icon: iconNode(entry.meta?.icon ?? KIND_ICONS.sub),
  path: entry.meta?.path ?? entry.id,
  header: hubHeader(entry.meta?.header),
  render: renderSub(entry.component, bucket),
});

export { subPage };
