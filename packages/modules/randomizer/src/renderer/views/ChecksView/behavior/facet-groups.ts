/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { TagPickerGroup } from '@drizztdourden08/tessera/primitives';
import type { TrackerProvider } from '../../../../tracker';

const facetGroups = (provider: TrackerProvider<unknown>, text: (value: Text) => string): TagPickerGroup[] =>
  (provider.facets ?? []).map((group) => ({
    id: group.id,
    label: text(group.label),
    options: group.options.map((option) => ({ value: option.id, label: text(option.label) })),
  }));

export { facetGroups };
