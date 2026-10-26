/* @layer renderer-shell @kind component */
import { useContextMenuStore } from '../useContextMenuStore';
import { useContextMenuClose } from './behavior/useContextMenuClose';
import { useContextMenuPointer } from './behavior/useContextMenuPointer';
import { OpenContextMenu } from './sub-components/OpenContextMenu';

const ContextMenuHost = () => {
  useContextMenuPointer();
  const open = useContextMenuStore((state) => state.open);
  useContextMenuClose(open !== null);
  return <OpenContextMenu open={open} />;
};

export { ContextMenuHost };
