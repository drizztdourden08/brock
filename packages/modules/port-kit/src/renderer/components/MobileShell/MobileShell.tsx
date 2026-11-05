/* @layer renderer-shell @kind component */
import { useCallback, useMemo } from 'react';
import { useBrock, useVolumeStore, useWidgetMenuEntries } from '@drizztdourden08/brock-react';
import type { MenuEntry } from '@drizztdourden08/brock-react';
import { Drawer } from '@drizztdourden08/tessera/composites';
import { useMobileBack } from './behavior/useMobileBack';
import { runMenuEntry } from './behavior/run-menu-entry';
import { MobileMenuDrawer } from './sub-components/MobileMenuDrawer';
import { MOBILE_DRAWER_LABEL } from './MobileShell.constants';
import type { MobileShellProps } from './MobileShell.type';
import './MobileShell.css';

const MobileShell = ({ extraEntries = [], fps = 0, label = MOBILE_DRAWER_LABEL }: MobileShellProps) => {
  const { menu } = useBrock();
  const widgetEntries = useWidgetMenuEntries();
  const { value, muted, toggleMute } = useVolumeStore();
  const { open, close } = useMobileBack();
  const entries = useMemo(
    () => [...menu, ...extraEntries, { key: 'widgets', label: 'Widgets', children: [...widgetEntries] }],
    [menu, extraEntries, widgetEntries],
  );
  const pick = useCallback((entry: MenuEntry) => {
    close();
    runMenuEntry(entry);
  }, [close]);

  return (
    <Drawer open={open} onClose={close} side="right" label={label}>
      <MobileMenuDrawer entries={entries} fps={open ? fps : 0} isMuted={muted || value <= 0} onToggleMute={toggleMute} onPick={pick} />
    </Drawer>
  );
};

export { MobileShell };
