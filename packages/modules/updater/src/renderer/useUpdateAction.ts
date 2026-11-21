/* @layer renderer-shell @kind hook */
import { useText } from '@drizztdourden08/brock-react';
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import { UPDATE_ACTION } from './update-action.constants';
import { useUpdaterStore } from './useUpdaterStore';
import { useSelfUpdateHost } from './useSelfUpdateHost';

const useUpdateAction = (): WindowTitleBarAction | null => {
  const text = useText();
  const host = useSelfUpdateHost();
  const available = useUpdaterStore((s) => s.status === 'available' && s.info !== null);
  const openDialog = useUpdaterStore((s) => s.openDialog);
  const checkAndOpen = useUpdaterStore((s) => s.checkAndOpen);
  const { id, label, icon } = UPDATE_ACTION;
  if (!host) return null;
  return {
    id,
    label: text(label),
    icon,
    bar: 'status',
    status: available ? text(UPDATE_ACTION.available) : undefined,
    tone: 'secondary',
    onSelect: available ? openDialog : checkAndOpen,
  };
};

export { useUpdateAction };
