/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { ContextMenu } from '@drizztdourden08/tessera/composites';
import type { MenuGroup } from '@drizztdourden08/tessera/composites';
import { listCommands } from '../../../commands/list-commands';
import { useCommandState } from '../../../commands/useCommandState';
import { closeContextMenu } from '../../close-context-menu';
import { CONTEXT_MENU_NAME } from '../../context-menu.constants';
import type { OpenContextMenuProps } from '../../context-menu.type';
import { resolveEntries } from '../../resolve-entries';

const OpenContextMenu = (props: OpenContextMenuProps) => {
  const { open } = props;
  const state = useCommandState();
  const groups = useMemo((): MenuGroup[] => {
    if (open === null) return [];
    const defs = new Map(listCommands(state).map((def) => [def.id, def]));
    return [{ id: 'context-menu', items: resolveEntries(open.entries, { defs, state, context: open.context }) }];
  }, [open, state]);

  return <ContextMenu open={open !== null} {...(open === null ? {} : { point: open.point })} groups={groups} label={open?.label ?? CONTEXT_MENU_NAME} longPress={false} onClose={closeContextMenu} />;
};

export { OpenContextMenu };
