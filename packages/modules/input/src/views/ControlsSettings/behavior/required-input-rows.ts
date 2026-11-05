/* @layer renderer-components @kind logic */
import { createElement } from 'react';
import type { SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import type { ControlsLabels, RequiredInput } from '../ControlsSettings.type';
import { RequiredInputState } from '../sub-components/RequiredInputState';

const requiredInputRows = (inputs: readonly RequiredInput[], labels: ControlsLabels): SettingsSectionRow[] =>
  inputs.map((input) => ({
    id: `required-${input.type}`,
    title: input.label,
    noDescription: true,
    hint: input.connected ? labels.inputConnected(input.label) : labels.inputNotConnected(input.label),
    input: {
      kind: 'custom',
      control: createElement(RequiredInputState, {
        iconSrc: input.iconSrc,
        connected: input.connected,
        connectedLabel: labels.statusConnected,
        disconnectedLabel: labels.statusNotConnected,
      }),
    },
  }));

export { requiredInputRows };
