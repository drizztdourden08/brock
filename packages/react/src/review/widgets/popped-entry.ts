/* @layer renderer-shell @kind logic */
import type { PoppedWidget } from '@drizztdourden08/tessera/composites';
import { useWidgetLayoutStore } from '../../widgets/useWidgetLayoutStore';

const poppedEntry = (id: string): PoppedWidget | null =>
  useWidgetLayoutStore.getState().layout.popped.find((p) => p.id === id) ?? null;

export { poppedEntry };
