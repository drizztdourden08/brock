/* @layer renderer-shell @kind logic */
import { DRAWN_WIDGET_SELECTOR } from '../widget.constants';
import { useActiveWidgetStore } from './useActiveWidgetStore';

const drawn = (id: string): boolean => {
  for (const element of document.querySelectorAll(DRAWN_WIDGET_SELECTOR)) {
    if (element.getAttribute('data-widget-id') === id) return true;
  }
  return false;
};

const activeWidget = (): string | null => {
  const { id, verify } = useActiveWidgetStore.getState();
  if (id === null) return null;
  return verify && !drawn(id) ? null : id;
};

export { activeWidget };
