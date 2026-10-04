/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { DropdownMenu } from '@drizztdourden08/tessera/composites';
import { toMenuGroups } from '../../menu/to-menu-groups';
import { useNavigation } from '../../navigation/useNavigation';
import { useTitleBarMenuStore } from '../useTitleBarMenuStore';

const TitleBarMenuHost = () => {
  const open = useTitleBarMenuStore((s) => s.open);
  const hide = useTitleBarMenuStore((s) => s.hide);
  const { open: openScreen } = useNavigation();
  const anchorRef = useMemo(() => ({ current: open?.anchor ?? null }), [open]);
  const groups = useMemo(() => (open ? toMenuGroups(open.items, { openScreen }) : []), [open, openScreen]);
  if (!open?.anchor) return null;
  return <DropdownMenu key={open.id} groups={groups} anchorRef={anchorRef} side="below" align="start" onClose={hide} />;
};

export { TitleBarMenuHost };
