/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { useShowContext } from '../screens/show/useShowContext';
import { availableToolbars } from './toolbar-available';
import type { ToolbarDef } from './toolbar.type';

const useAvailableToolbars = (definitions: readonly ToolbarDef[]): readonly ToolbarDef[] => {
  const show = useShowContext();
  return useMemo(() => availableToolbars(definitions, show), [definitions, show]);
};

export { useAvailableToolbars };
