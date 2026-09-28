/* @layer renderer-shell @kind component */
import { useCallback, useMemo } from 'react';
import { SettingsSection } from '@drizztdourden08/tessera/composites';
import { Field, SegmentedControl, Select, Text } from '@drizztdourden08/tessera/primitives';
import type { WindowMode } from '../../../display.type';
import { useDisplayStore } from '../../useDisplayStore';
import { monitorOptions } from '../behavior/monitor-options';
import { WINDOW_MODE_OPTIONS } from '../DisplaySettingsTab.constants';
import type { DisplaySectionProps } from '../DisplaySettingsTab.type';

const WindowModeSection = (props: DisplaySectionProps) => {
  const { settings, onChange } = props;
  const monitors = useDisplayStore((s) => s.monitors);
  const lastError = useDisplayStore((s) => s.windowMode?.lastError ?? '');
  const options = useMemo(() => monitorOptions(monitors), [monitors]);
  const handleMode = useCallback((windowMode: WindowMode) => { onChange({ windowMode }); }, [onChange]);
  const handleMonitor = useCallback((displayMonitor: string) => { onChange({ displayMonitor }); }, [onChange]);

  return (
    <SettingsSection title="Window" description="How the window fills the screen, and which screen it uses.">
      <SegmentedControl label="Window mode" value={settings.windowMode} options={WINDOW_MODE_OPTIONS} onChange={handleMode} />
      <Field label="Screen">
        <Select value={settings.displayMonitor} options={options} onChange={handleMonitor} aria-label="Screen" />
      </Field>
      {lastError ? <Text variant="caption" className="display-tab__warning">{lastError}</Text> : null}
    </SettingsSection>
  );
};

export { WindowModeSection };
