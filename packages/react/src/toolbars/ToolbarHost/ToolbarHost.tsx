/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { ToolbarDock } from '@drizztdourden08/tessera/composites';
import { toolbarRenderer } from '../toolbar-renderer';
import { useRegisterToolbars } from '../useRegisterToolbars';
import { useToolbarLayoutStore } from '../useToolbarLayoutStore';
import { useHostClaim } from './behavior/useHostClaim';
import type { ToolbarHostProps } from './ToolbarHost.type';

const ToolbarHost = ({ toolbars, children }: ToolbarHostProps) => {
  const owns = useHostClaim();
  const registered = useToolbarLayoutStore((s) => s.definitions);
  const layout = useToolbarLayoutStore((s) => s.layout);
  const setLayout = useToolbarLayoutStore((s) => s.setLayout);
  useRegisterToolbars(owns ? toolbars : undefined);
  const definitions = toolbars ?? registered;
  const renderToolbar = useMemo(() => toolbarRenderer(definitions), [definitions]);
  if (!owns) return <>{children}</>;
  return (
    <ToolbarDock layout={layout} onLayoutChange={setLayout} definitions={definitions} renderToolbar={renderToolbar}>
      {children}
    </ToolbarDock>
  );
};

export { ToolbarHost };
