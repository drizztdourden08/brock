/* @layer renderer-shell @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { englishText } from '../../../../text/english-text';
import { NO_SPHERE_GROUP, NO_SPHERE_ORDER, STATUS_DEFS, STATUS_ORDER } from '../ChecksView.constants';
import type { RowGroup, RowSubject, RowsInput } from './check-row.type';

const rowGroupOf = (input: RowsInput): ((subject: RowSubject) => RowGroup) => {
  const { provider, reading, feed, grouping, text = englishText } = input;
  const spheres = grouping === 'sphere' ? provider.sphereOf?.(feed.placement) : undefined;
  return ({ key, region, status }) => {
    const regionName = reading.world.regions.get(region)?.name ?? region;
    if (grouping === 'region') return { label: regionName, order: 0 };
    if (grouping === 'status') return { label: text(STATUS_DEFS[status].label), order: STATUS_ORDER.indexOf(status) };
    if (grouping === 'sphere') {
      const sphere = spheres?.get(key);
      return sphere === undefined ? { label: text(NO_SPHERE_GROUP), order: NO_SPHERE_ORDER } : { label: text(msg('randomizer:checks.sphere', { sphere })), order: sphere };
    }
    return { label: provider.groupOf?.(key, grouping) ?? regionName, order: 0 };
  };
};

export { rowGroupOf };
