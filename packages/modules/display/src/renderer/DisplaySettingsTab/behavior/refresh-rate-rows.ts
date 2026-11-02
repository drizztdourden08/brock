/* @layer renderer-shell @kind logic */
import type { SettingsOption, SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import { DISPLAY_ROW_COPY, SYNCED_DESCRIPTION } from '../DisplaySettingsTab.constants';
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
      description: DISPLAY_ROW_COPY.detectedRate.description,
      hint: DISPLAY_ROW_COPY.detectedRate.hint,
    },
    {
      id: 'syncedRateInFullscreen',
      title: DISPLAY_ROW_COPY.syncedRateInFullscreen.label,
      description: status.supported || !status.unsupportedReason ? SYNCED_DESCRIPTION : status.unsupportedReason,
      hint: DISPLAY_ROW_COPY.syncedRateInFullscreen.hint,
      disabled: !status.supported,
      input: { kind: 'toggle', value: settings.syncedRateInFullscreen, onChange: onSynced },
    },
    {
      id: 'syncedRateTargetHz',
      title: DISPLAY_ROW_COPY.syncedRateTargetHz.label,
      description: DISPLAY_ROW_COPY.syncedRateTargetHz.description,
      hint: DISPLAY_ROW_COPY.syncedRateTargetHz.hint,
      disabled: rates.length === 0,
      input: { kind: 'segmented', value: String(selected), options: rates.map(rateOption), onChange: onTarget },
    },
    {
      id: 'changeRate',
      title: DISPLAY_ROW_COPY.changeRate.label,
      content: changeButton,
      description: DISPLAY_ROW_COPY.changeRate.description,
      hint: DISPLAY_ROW_COPY.changeRate.hint,
    },
  ];
};

export { refreshRateRows };
