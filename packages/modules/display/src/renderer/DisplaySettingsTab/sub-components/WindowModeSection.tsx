/* @layer renderer-shell @kind component */
import { useCallback, useMemo } from 'react';
import { useText } from '@drizztdourden08/brock-react';
import { SettingsSection } from '@drizztdourden08/tessera/composites';
import type { SettingsOption, SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import { Text } from '@drizztdourden08/tessera/primitives';
import type { WindowMode } from '../../../display.type';
import { useDisplayStore } from '../../useDisplayStore';
import { monitorOptions } from '../behavior/monitor-options';
import { DISPLAY_ROW_COPY, DISPLAY_SECTION_COPY, WINDOW_MODE_COPY } from '../DisplaySettingsTab.constants';
import type { DisplaySectionProps } from '../DisplaySettingsTab.type';

const WindowModeSection = (props: DisplaySectionProps) => {
  const { settings, onChange } = props;
  const text = useText();
  const monitors = useDisplayStore((s) => s.monitors);
  const lastError = useDisplayStore((s) => s.windowMode?.lastError ?? '');
  const options = useMemo(() => monitorOptions(monitors, text), [monitors, text]);
  const modes = useMemo<SettingsOption[]>(
    () => WINDOW_MODE_COPY.map((mode) => ({ value: mode.value, label: text(mode.label), hint: text(mode.hint) })),
    [text],
  );
  const handleMode = useCallback((windowMode: string) => { onChange({ windowMode: windowMode as WindowMode }); }, [onChange]);
  const handleMonitor = useCallback((displayMonitor: string) => { onChange({ displayMonitor }); }, [onChange]);

  const rows = useMemo<SettingsSectionRow[]>(() => [
    {
      id: 'windowMode',
      title: text(DISPLAY_ROW_COPY.windowMode.label),
      description: text(DISPLAY_ROW_COPY.windowMode.description),
      hint: text(DISPLAY_ROW_COPY.windowMode.hint),
      input: { kind: 'segmented', value: settings.windowMode, options: modes, onChange: handleMode },
    },
    {
      id: 'displayMonitor',
      title: text(DISPLAY_ROW_COPY.displayMonitor.label),
      description: text(DISPLAY_ROW_COPY.displayMonitor.description),
      hint: text(DISPLAY_ROW_COPY.displayMonitor.hint),
      input: { kind: 'select', value: settings.displayMonitor, options, onChange: handleMonitor },
    },
  ], [text, settings.windowMode, settings.displayMonitor, modes, options, handleMode, handleMonitor]);

  return (
    <SettingsSection title={text(DISPLAY_SECTION_COPY.window.title)} description={text(DISPLAY_SECTION_COPY.window.description)} rows={rows}>
      {lastError ? <Text variant="caption" className="display-tab__warning">{lastError}</Text> : undefined}
    </SettingsSection>
  );
};

export { WindowModeSection };
