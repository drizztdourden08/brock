/* @layer renderer-components @kind logic */
import type { SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import type { ResolvedControlsLabels } from '../ControlsSettings.type';

const hapticsRows = (
  haptics: { enabled: boolean; onChange: (on: boolean) => void },
  labels: ResolvedControlsLabels,
): SettingsSectionRow[] => [
  {
    id: 'haptics',
    title: labels.hapticsTitle,
    description: labels.hapticsDescription,
    keywords: 'haptics rumble vibration controller',
    input: { kind: 'toggle', value: haptics.enabled, onChange: haptics.onChange },
  },
];

export { hapticsRows };
