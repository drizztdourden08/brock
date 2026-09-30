/* @layer renderer-shell @kind hook */
import { useUpdaterStore } from '../../useUpdaterStore';
import type { UpdateBadgeModel } from '../UpdateBadge.type';

const useUpdateBadge = (): UpdateBadgeModel => {
  const shown = useUpdaterStore((s) => s.status === 'available' && s.info !== null);
  const onOpen = useUpdaterStore((s) => s.openDialog);
  return { shown, onOpen };
};

export { useUpdateBadge };
