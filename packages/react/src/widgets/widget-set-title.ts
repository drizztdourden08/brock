/* @layer renderer-shell @kind logic */
import { knownWidget } from './widget-known';
import { useWidgetTitleStore } from './useWidgetTitleStore';

const setWidgetTitle = (id: string, text: string | null): void => {
  knownWidget(id);
  useWidgetTitleStore.getState().set(id, text);
};

export { setWidgetTitle };
