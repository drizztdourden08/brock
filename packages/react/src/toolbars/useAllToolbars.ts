/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { uniqueById } from '../collections/unique-by-id';
import { NO_TOOLBARS } from './toolbar.constants';
import type { ToolbarDef } from './toolbar.type';

const useAllToolbars = (fromModules: readonly ToolbarDef[], fromApp: readonly ToolbarDef[] = NO_TOOLBARS): readonly ToolbarDef[] =>
  useMemo(() => uniqueById([...fromModules, ...fromApp]), [fromModules, fromApp]);

export { useAllToolbars };
