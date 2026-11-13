/* @layer renderer-components @kind component */
import { useCallback, useMemo } from 'react';
import { Tabs } from '@drizztdourden08/tessera/primitives';
import type { NarrowTabId } from '../ControlsSettings.type';
import type { ControlsNarrowTabsProps } from './ControlsNarrowTabs.type';

const ControlsNarrowTabs = ({ labels, active, onChange }: ControlsNarrowTabsProps) => {
  const items = useMemo(() => [
    { id: 'profiles', label: labels.tabProfiles },
    { id: 'bindings', label: labels.tabBindings },
    { id: 'devices', label: labels.tabDevices },
  ], [labels]);
  const handleChange = useCallback((id: string) => onChange(id as NarrowTabId), [onChange]);
  return <Tabs tabs={items} activeTab={active} onTabChange={handleChange} />;
};

export { ControlsNarrowTabs };
