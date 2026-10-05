/* @layer renderer-shell @kind logic */
import { toast } from '@drizztdourden08/tessera/composites';

const dismissToast = (id: string): void => toast.dismiss(id);

export { dismissToast };
