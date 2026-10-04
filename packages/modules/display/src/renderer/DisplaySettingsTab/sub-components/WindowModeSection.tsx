/* @layer renderer-shell @kind component */
import { useCallback, useMemo } from 'react';
import { SettingsSection } from '@drizztdourden08/tessera/composites';
import type { SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import { Text } from '@drizztdourden08/tessera/primitives';
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
  const handleMode = useCallback((windowMode: string) => { onChange({ windowMode: windowMode as WindowMode }); }, [onChange]);
  const handleMonitor = useCallback((displayMonitor: string) => { onChange({ displayMonitor }); }, [onChange]);

  const rows = useMemo<SettingsSectionRow[]>(() => [
    {
      id: 'windowMode',
      title: 'Window mode',
      description: 'Windowed, borderless or fullscreen.',
      hint: 'Pick how the window fills the screen. It changes right away.',
      input: { kind: 'segmented', value: settings.windowMode, options: WINDOW_MODE_OPTIONS, onChange: handleMode },
    },
    {
      id: 'displayMonitor',
      title: 'Screen',
      description: 'The screen the window uses.',
      hint: 'Pick a screen for borderless and fullscreen, or follow the screen the window is on.',
      input: { kind: 'select', value: settings.displayMonitor, options, onChange: handleMonitor },
    },
  ], [settings.windowMode, settings.displayMonitor, options, handleMode, handleMonitor]);

  return (
    <SettingsSection title="Window" description="How the window fills the screen, and which screen it uses." rows={rows}>
      {lastError ? <Text variant="caption" className="display-tab__warning">{lastError}</Text> : undefined}
    </SettingsSection>
  );
};

export { WindowModeSection };
