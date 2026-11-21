/* @layer renderer-components @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { ControlsLabels, ResolvedControlsLabels } from '../ControlsSettings.type';

const resolveLabels = (labels: ControlsLabels, text: (value: Text) => string): ResolvedControlsLabels =>
  Object.fromEntries(
    Object.entries(labels).map(([key, value]) => [
      key,
      typeof value === 'function' ? (name: string) => text(value(name)) : text(value),
    ]),
  ) as ResolvedControlsLabels;

export { resolveLabels };
