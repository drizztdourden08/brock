/* @layer renderer-shell @kind component */
import { useEffect, useMemo } from 'react';
import { ToolbarDock } from '@drizztdourden08/tessera/composites';
import { toolbarRenderer } from '../toolbar-renderer';
import { useToolbarLayoutStore } from '../useToolbarLayoutStore';
import type { ToolbarHostProps } from './ToolbarHost.type';

const ToolbarHost = ({ toolbars, children }: ToolbarHostProps) => {
  const layout = useToolbarLayoutStore((s) => s.layout);
  const setLayout = useToolbarLayoutStore((s) => s.setLayout);
  useEffect(() => useToolbarLayoutStore.getState().setDefinitions(toolbars), [toolbars]);
  const renderToolbar = useMemo(() => toolbarRenderer(toolbars), [toolbars]);
  return (
    <ToolbarDock layout={layout} onLayoutChange={setLayout} definitions={toolbars} renderToolbar={renderToolbar}>
      {children}
    </ToolbarDock>
  );
};

export { ToolbarHost };
