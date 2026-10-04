/* @layer renderer-shell @kind logic */
import type { SettingsOption, SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import { SYNCED_DESCRIPTION } from '../DisplaySettingsTab.constants';
import type { RefreshRateRowsInput } from '../DisplaySettingsTab.type';

const rateOption = (hz: number): SettingsOption => ({
  value: String(hz),
  label: `${hz} Hz`,
  hint: hz % 60 === 0 ? 'A multiple of 60, so every frame of 60 Hz content stays on screen for the same time.' : 'Not a multiple of 60, so 60 Hz content can stutter.',
});

const refreshRateRows = (input: RefreshRateRowsInput): SettingsSectionRow[] => {
  const { settings, status, selected, readout, changeButton, onSynced, onTarget } = input;
  const rates = status.availableRates;
  return [
    {
      id: 'detectedRate',
      content: readout,
      description: 'The rate the display runs at now.',
      hint: 'Measured from how fast the app draws frames, so it can read a little off the rate the display reports.',
    },
    {
      id: 'syncedRateInFullscreen',
      title: 'Synced rate in fullscreen',
      description: status.supported || !status.unsupportedReason ? SYNCED_DESCRIPTION : status.unsupportedReason,
      hint: 'On, fullscreen borrows the target rate and hands the old rate back when it ends. The desktop keeps its own rate.',
      disabled: !status.supported,
      input: { kind: 'toggle', value: settings.syncedRateInFullscreen, onChange: onSynced },
    },
    {
      id: 'syncedRateTargetHz',
      title: 'Target refresh rate',
      description: 'The rate the synced mode and the change button use.',
      hint: 'Pick a rate the display offers. A multiple of 60 suits content made at 60 frames a second.',
      disabled: rates.length === 0,
      input: { kind: 'segmented', value: String(selected), options: rates.map(rateOption), onChange: onTarget },
    },
    {
      id: 'changeRate',
      title: 'Change refresh rate',
      content: changeButton,
      description: 'Set the display to the target rate now and leave it there.',
      hint: 'Asks first. The screen goes black for a second while it switches, and the rate stays after the app closes.',
    },
  ];
};

export { refreshRateRows };
