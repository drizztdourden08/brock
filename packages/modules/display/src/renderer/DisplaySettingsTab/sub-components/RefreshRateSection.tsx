/* @layer renderer-shell @kind component */
import { useCallback, useState } from 'react';
import { SettingsSection } from '@drizztdourden08/tessera/composites';
import { Button, Text } from '@drizztdourden08/tessera/primitives';
import { effectiveHz } from '../../../rates/effective-hz';
import { useDisplayStore } from '../../useDisplayStore';
import { useRefreshRate } from '../../useRefreshRate';
import { refreshRateRows } from '../behavior/refresh-rate-rows';
import { selectedRate } from '../behavior/selected-rate';
import type { DisplaySectionProps } from '../DisplaySettingsTab.type';
import { ChangeRateDialog } from './ChangeRateDialog';
import { RateReadout } from './RateReadout';

const RefreshRateSection = (props: DisplaySectionProps) => {
  const { settings, onChange } = props;
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
      {applying ? 'Changing...' : 'Change refresh rate'}
    </Button>
  );
  const rows = refreshRateRows({ settings, status, selected, readout, changeButton, onSynced: handleSynced, onTarget: handleTarget });

  return (
    <>
      <SettingsSection title="Refresh rate" description="A multiple of 60 shows every frame of 60 Hz content for the same time." rows={rows}>
        {status.lastError ? <Text variant="caption" className="display-tab__warning">{status.lastError}</Text> : undefined}
      </SettingsSection>
      <ChangeRateDialog open={confirming} targetHz={selected} currentHz={currentHz} onConfirm={handleConfirm} onCancel={handleCancel} />
    </>
  );
};

export { RefreshRateSection };
