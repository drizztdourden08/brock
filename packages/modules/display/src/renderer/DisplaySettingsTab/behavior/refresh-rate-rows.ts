/* @layer renderer-shell @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { SettingsOption, SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import { DISPLAY_ROW_COPY } from '../DisplaySettingsTab.constants';
import type { RefreshRateRowsInput } from '../DisplaySettingsTab.type';

const rateOption = (hz: number, text: (value: Text) => string): SettingsOption => ({
  value: String(hz),
  label: text(msg('display:rate.hz', { hz })),
  hint: text(hz % 60 === 0 ? msg('display:rate.hint.multiple') : msg('display:rate.hint.uneven')),
});

const refreshRateRows = (input: RefreshRateRowsInput): SettingsSectionRow[] => {
  const { text, settings, status, selected, readout, changeButton, onSynced, onTarget } = input;
  const rates = status.availableRates;
  const syncedDescription = status.supported || !status.unsupportedReason
    ? DISPLAY_ROW_COPY.syncedRateInFullscreen.description
    : status.unsupportedReason;
  return [
    {
      id: 'detectedRate',
      content: readout,
      description: text(DISPLAY_ROW_COPY.detectedRate.description),
      hint: text(DISPLAY_ROW_COPY.detectedRate.hint),
    },
    {
      id: 'syncedRateInFullscreen',
      title: text(DISPLAY_ROW_COPY.syncedRateInFullscreen.label),
      description: text(syncedDescription),
      hint: text(DISPLAY_ROW_COPY.syncedRateInFullscreen.hint),
      disabled: !status.supported,
      input: { kind: 'toggle', value: settings.syncedRateInFullscreen, onChange: onSynced },
    },
    {
      id: 'syncedRateTargetHz',
      title: text(DISPLAY_ROW_COPY.syncedRateTargetHz.label),
      description: text(DISPLAY_ROW_COPY.syncedRateTargetHz.description),
      hint: text(DISPLAY_ROW_COPY.syncedRateTargetHz.hint),
      disabled: rates.length === 0,
      input: { kind: 'segmented', value: String(selected), options: rates.map((hz) => rateOption(hz, text)), onChange: onTarget },
    },
    {
      id: 'changeRate',
      title: text(DISPLAY_ROW_COPY.changeRate.label),
      content: changeButton,
      description: text(DISPLAY_ROW_COPY.changeRate.description),
      hint: text(DISPLAY_ROW_COPY.changeRate.hint),
    },
  ];
};

export { refreshRateRows };
