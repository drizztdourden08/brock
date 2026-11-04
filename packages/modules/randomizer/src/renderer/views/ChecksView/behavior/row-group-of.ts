/* @layer renderer-shell @kind logic */
import { NO_SPHERE_GROUP, NO_SPHERE_ORDER, SPHERE_PREFIX, STATUS_MAP, STATUS_ORDER } from '../ChecksView.constants';
import type { RowGroup, RowSubject, RowsInput } from './check-row.type';

const rowGroupOf = (input: RowsInput): ((subject: RowSubject) => RowGroup) => {
  const { provider, reading, feed, grouping } = input;
  const spheres = grouping === 'sphere' ? provider.sphereOf?.(feed.placement) : undefined;
  return ({ key, region, status }) => {
    const regionName = reading.world.regions.get(region)?.name ?? region;
    if (grouping === 'region') return { label: regionName, order: 0 };
    if (grouping === 'status') return { label: STATUS_MAP[status].label, order: STATUS_ORDER.indexOf(status) };
    if (grouping === 'sphere') {
      const sphere = spheres?.get(key);
      return sphere === undefined ? { label: NO_SPHERE_GROUP, order: NO_SPHERE_ORDER } : { label: `${SPHERE_PREFIX} ${sphere}`, order: sphere };
    }
    return { label: provider.groupOf?.(key, grouping) ?? regionName, order: 0 };
  };
};

export { rowGroupOf };
