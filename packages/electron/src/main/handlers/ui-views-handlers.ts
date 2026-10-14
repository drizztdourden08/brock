/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';
import { createUiViewsStore } from './ui-views-store';

const uiViewsHandlers: HandlerGroup = {
  id: 'uiViews',
  register: ({ handle, files }) => {
    const views = createUiViewsStore(files);
    handle('uiViews:load', () => views.load());
    handle('uiViews:save', (_e, data) => views.save(data));
    handle('uiViews:patch', (_e, entries) => views.patch(entries));
  },
};

export { uiViewsHandlers };
