/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { useToolbarLayoutStore } from './useToolbarLayoutStore';
import type { ToolbarDef } from './toolbar.type';

const useRegisterToolbars = (toolbars: readonly ToolbarDef[] | undefined): void => {
  useEffect(() => {
    if (toolbars !== undefined) useToolbarLayoutStore.getState().setDefinitions(toolbars);
  }, [toolbars]);
};

export { useRegisterToolbars };
