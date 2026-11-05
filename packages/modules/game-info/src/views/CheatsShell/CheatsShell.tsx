/* @layer renderer-shell @kind component */
import { useWidgetPref } from '@drizztdourden08/brock-react';
import { Box, EmptyState, Tabs } from '@drizztdourden08/tessera/primitives';
import { activeTabOf } from './behavior/active-tab-of';
import { CHEATS_TAB_PREF, CHEATS_WIDGET_ID } from './CheatsShell.constants';
import type { CheatsShellProps } from './CheatsShell.type';
import './CheatsShell.css';

const CheatsShell = ({ tabs, enabled, offReason, defaultTab }: CheatsShellProps) => {
  const [stored, setStored] = useWidgetPref<string>(CHEATS_WIDGET_ID, CHEATS_TAB_PREF, defaultTab ?? '');
  if (!enabled) return <EmptyState message={offReason} />;
  const active = activeTabOf(tabs, stored, defaultTab);
  return (
    <Box className="cheats-shell">
      <Tabs tabs={tabs.map(({ id, label }) => ({ id, label }))} activeTab={active?.id ?? ''} onTabChange={setStored} />
      <Box className="cheats-shell__content">{active?.render()}</Box>
    </Box>
  );
};

export { CheatsShell };
