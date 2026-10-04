/* @layer renderer-shell @kind hook */
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import { UPDATE_ACTION } from './update-action.constants';
import { useUpdaterStore } from './useUpdaterStore';

const useUpdateAction = (): WindowTitleBarAction => {
  const available = useUpdaterStore((s) => s.status === 'available' && s.info !== null);
  const openDialog = useUpdaterStore((s) => s.openDialog);
  const checkAndOpen = useUpdaterStore((s) => s.checkAndOpen);
  const { id, label, icon } = UPDATE_ACTION;
  return {
    id,
    label,
    icon,
    bar: 'status',
    status: available ? UPDATE_ACTION.available : undefined,
    tone: 'secondary',
    onSelect: available ? openDialog : checkAndOpen,
  };
};

export { useUpdateAction };
