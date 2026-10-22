/* @layer renderer-shell @kind component */
import { useContext } from 'react';
import { SideNavLayout } from '@drizztdourden08/tessera/composites';
import { ScreenStateScope } from '../../screen-state-scope';
import { useWindowNav } from './behavior/useWindowNav';
import { windowNavKey } from './behavior/window-nav-key';
import type { SideNavWindowProps } from './SideNavWindow.type';

const SideNavWindow = (props: SideNavWindowProps) => {
  const { def, ctx } = props;
  const scope = useContext(ScreenStateScope);
  const { config, item, select } = useWindowNav(def, ctx.params);

  return (
    <SideNavLayout
      narrow={def.narrow}
      paneScroll={def.scroll ?? 'page'}
      nav={{ config, activeId: item.id, onSelect: select, storageKey: windowNavKey(scope), ariaLabel: def.label }}
    >
      {item.render({ ...ctx, active: item.id, select })}
    </SideNavLayout>
  );
};

export { SideNavWindow };
