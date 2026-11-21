/* @layer renderer-shell @kind component */
import { useCallback, useState } from 'react';
import { msg } from '@drizztdourden08/brock-core/i18n';
import { useText } from '@drizztdourden08/brock-react';
import { SettingsSection } from '@drizztdourden08/tessera/composites';
import { Button, Text } from '@drizztdourden08/tessera/primitives';
import { effectiveHz } from '../../../rates/effective-hz';
import { useDisplayStore } from '../../useDisplayStore';
import { useRefreshRate } from '../../useRefreshRate';
import { DISPLAY_ROW_COPY, DISPLAY_SECTION_COPY } from '../DisplaySettingsTab.constants';
import { refreshRateRows } from '../behavior/refresh-rate-rows';
import { selectedRate } from '../behavior/selected-rate';
import type { DisplaySectionProps } from '../DisplaySettingsTab.type';
import { ChangeRateDialog } from './ChangeRateDialog';
import { RateReadout } from './RateReadout';

const RefreshRateSection = (props: DisplaySectionProps) => {
  const { settings, onChange } = props;
  const text = useText();
  const info = useRefreshRate();
  const status = useDisplayStore((s) => s.status);
  const applying = useDisplayStore((s) => s.applying);
  const applyRate = useDisplayStore((s) => s.applyRate);
  const [confirming, setConfirming] = useState(false);
  const selected = selectedRate(settings.syncedRateTargetHz, status.availableRates);
  const currentHz = effectiveHz(info) ?? status.currentHz;

  const handleSynced = useCallback((syncedRateInFullscreen: boolean) => { onChange({ syncedRateInFullscreen }); }, [onChange]);
  const handleTarget = useCallback((value: string) => { onChange({ syncedRateTargetHz: Number(value) }); }, [onChange]);
  const handleOpen = useCallback(() => { setConfirming(true); }, []);
  const handleCancel = useCallback(() => { setConfirming(false); }, []);
  const handleConfirm = useCallback(() => {
    setConfirming(false);
    void applyRate(selected);
  }, [applyRate, selected]);

  const canChange = status.supported && status.availableRates.length > 0 && !applying;
  const readout = <RateReadout currentHz={currentHz} />;
  const changeButton = (
    <Button variant="secondary" disabled={!canChange} onClick={handleOpen}>
      {applying ? text(msg('display:button.changing')) : text(DISPLAY_ROW_COPY.changeRate.label)}
    </Button>
  );
  const rows = refreshRateRows({ text, settings, status, selected, readout, changeButton, onSynced: handleSynced, onTarget: handleTarget });

  return (
    <>
      <SettingsSection title={text(DISPLAY_SECTION_COPY.refreshRate.title)} description={text(DISPLAY_SECTION_COPY.refreshRate.description)} rows={rows}>
        {status.lastError ? <Text variant="caption" className="display-tab__warning">{status.lastError}</Text> : undefined}
      </SettingsSection>
      <ChangeRateDialog open={confirming} targetHz={selected} currentHz={currentHz} onConfirm={handleConfirm} onCancel={handleCancel} />
    </>
  );
};

export { RefreshRateSection };
