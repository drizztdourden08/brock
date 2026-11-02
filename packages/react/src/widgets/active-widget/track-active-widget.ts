/* @layer renderer-shell @kind logic */
import { DRAWN_WIDGET_SELECTOR } from '../widget.constants';
import { useActiveWidgetStore } from './useActiveWidgetStore';

const setActive = (id: string | null, verify: boolean): void => useActiveWidgetStore.setState({ id, verify });

const widgetOf = (target: Element): string | null => target.closest(DRAWN_WIDGET_SELECTOR)?.getAttribute('data-widget-id') ?? null;

const trackInMain = (doc: Document): (() => void) => {
  const onTouch = (event: Event): void => {
    if (event.target instanceof Element) setActive(widgetOf(event.target), true);
  };
  doc.addEventListener('pointerdown', onTouch, true);
  doc.addEventListener('focusin', onTouch, true);
  return () => {
    doc.removeEventListener('pointerdown', onTouch, true);
    doc.removeEventListener('focusin', onTouch, true);
  };
};

const trackInWindow = (doc: Document, id: string): (() => void) => {
  const view = doc.defaultView;
  if (view === null) return () => undefined;
  const onFocus = (): void => setActive(id, false);
  const onBlur = (): void => setActive(null, false);
  if (doc.hasFocus()) onFocus();
  view.addEventListener('focus', onFocus);
  view.addEventListener('blur', onBlur);
  return () => {
    view.removeEventListener('focus', onFocus);
    view.removeEventListener('blur', onBlur);
    onBlur();
  };
};

const trackActiveWidget = (doc: Document, windowWidget: string | null = null): (() => void) =>
  (windowWidget === null ? trackInMain(doc) : trackInWindow(doc, windowWidget));

export { trackActiveWidget };
