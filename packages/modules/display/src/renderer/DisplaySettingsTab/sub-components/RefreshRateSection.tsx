/* @layer renderer-shell @kind component */
import { useCallback, useMemo, useState } from 'react';
import { SettingsSection } from '@drizztdourden08/tessera/composites';
import { Button, SegmentedControl, Text, Toggle } from '@drizztdourden08/tessera/primitives';
import { effectiveHz } from '../../../rates/effective-hz';
import { useDisplayStore } from '../../useDisplayStore';
import { useRefreshRate } from '../../useRefreshRate';
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
  const rates = status.availableRates;
  const selected = selectedRate(settings.syncedRateTargetHz, rates);
  const currentHz = effectiveHz(info) ?? status.currentHz;
  const rateOptions = useMemo(() => rates.map((hz) => ({ value: String(hz), label: `${hz} Hz` })), [rates]);

  const handleSynced = useCallback((syncedRateInFullscreen: boolean) => { onChange({ syncedRateInFullscreen }); }, [onChange]);
  const handleTarget = useCallback((value: string) => { onChange({ syncedRateTargetHz: Number(value) }); }, [onChange]);
  const handleOpen = useCallback(() => { setConfirming(true); }, []);
  const handleCancel = useCallback(() => { setConfirming(false); }, []);
  const handleConfirm = useCallback(() => {
    setConfirming(false);
    void applyRate(selected);
  }, [applyRate, selected]);

  return (
    <SettingsSection title="Refresh rate" description="A multiple of 60 shows every frame of 60 Hz content for the same time.">
      <RateReadout currentHz={currentHz} />
      <Toggle
        label="Synced rate in fullscreen"
        description={status.supported ? 'Switch the display to the target rate while in fullscreen, and back when fullscreen ends.' : status.unsupportedReason}
        checked={settings.syncedRateInFullscreen}
        disabled={!status.supported}
        onChange={handleSynced}
      />
      <SegmentedControl label="Target refresh rate" value={String(selected)} options={rateOptions} onChange={handleTarget} disabled={!rates.length} />
      <Button variant="secondary" disabled={!status.supported || !rates.length || applying} onClick={handleOpen}>
        {applying ? 'Changing...' : 'Change refresh rate'}
      </Button>
      {status.lastError ? <Text variant="caption" className="display-tab__warning">{status.lastError}</Text> : null}
      <ChangeRateDialog open={confirming} targetHz={selected} currentHz={currentHz} onConfirm={handleConfirm} onCancel={handleCancel} />
    </SettingsSection>
  );
};

export { RefreshRateSection };
