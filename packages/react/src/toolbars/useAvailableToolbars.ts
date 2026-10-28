/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { useRuleContext } from '../widgets/useRuleContext';
import { availableToolbars } from './available-toolbars';
import type { ToolbarDef } from './toolbar.type';

const useAvailableToolbars = (definitions: readonly ToolbarDef[]): readonly ToolbarDef[] => {
  const show = useRuleContext();
  return useMemo(() => availableToolbars(definitions, show), [definitions, show]);
};

export { useAvailableToolbars };
