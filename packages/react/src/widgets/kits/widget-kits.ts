/* @layer renderer-shell @kind logic */
import { useWidgetKitStore } from './useWidgetKitStore';

const store = () => useWidgetKitStore.getState();

const widgetKits = {
  open: (id: string): void => store().open(id),
  openWidget: (id: string): void => store().openMember(id),
  close: (): void => store().close(),
  toggle: (id: string): void => store().toggle(id),
  reset: (id: string): void => store().reset(id),
  active: (): string | null => store().active,
  isOpen: (id: string): boolean => store().active === id,
};

export { widgetKits };
