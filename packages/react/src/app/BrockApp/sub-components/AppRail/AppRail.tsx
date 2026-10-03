/* @layer renderer-shell @kind component */
import { SideNav } from '@drizztdourden08/tessera/composites';
import { useRailEntries } from '../../../../shell/ScreenRail/behavior/useRailEntries';
import type { AppRailProps } from './AppRail.type';

const AppRail = (props: AppRailProps) => {
  const { screens, home, groups } = props;
  const { config, activeId, select } = useRailEntries(screens, home, groups);
  return <SideNav variant="rail" config={config} activeId={activeId} onSelect={select} ariaLabel="Screens" />;
};

export { AppRail };
