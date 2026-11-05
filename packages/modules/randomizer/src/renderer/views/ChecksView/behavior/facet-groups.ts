/* @layer renderer-shell @kind logic */
import type { TagPickerGroup } from '@drizztdourden08/tessera/primitives';
import type { TrackerProvider } from '../../../../tracker';

const facetGroups = (provider: TrackerProvider<unknown>): TagPickerGroup[] =>
  (provider.facets ?? []).map((group) => ({
    id: group.id,
    label: group.label,
    options: group.options.map((option) => ({ value: option.id, label: option.label })),
  }));

export { facetGroups };
