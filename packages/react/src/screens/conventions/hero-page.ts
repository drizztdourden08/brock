/* @layer renderer-shell @kind logic */
import type { HubPage } from '../../hub/hub.type';
import { renderHero } from '../kinds/render-hero';
import { iconNode } from './icon-node';
import { HOME_LABEL, KIND_ICONS } from './screens.constants';
import type { BucketDef } from './screens-config.type';
import type { HeroEntry } from './screen-tree.type';

const heroPage = (bucket: BucketDef, entry: HeroEntry): HubPage => ({
  id: entry.id,
  label: entry.meta?.title ?? HOME_LABEL,
  icon: iconNode(entry.meta?.icon ?? KIND_ICONS.hero),
  fullBleed: true,
  shortcut: entry.meta?.shortcut,
  render: renderHero(entry.component, bucket),
});

export { heroPage };
