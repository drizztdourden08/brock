/* @layer renderer-shell @kind logic */
import { useToastStore } from './useToastStore';

const dismissToast = (id: string): void => useToastStore.getState().dismiss(id);

export { dismissToast };
