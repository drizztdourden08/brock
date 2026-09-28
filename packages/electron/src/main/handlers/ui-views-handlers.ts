/* @layer electron-main @kind logic */
import { readJson, writeJson } from '@drizztdourden08/brock-core/storage';
import type { HandlerGroup } from '../types/main-context.type';
import { UI_VIEWS_FILE } from './ui-views-handlers.constants';

const uiViewsHandlers: HandlerGroup = {
  id: 'uiViews',
  register: ({ handle, files }) => {
    handle('uiViews:load', () => readJson<Record<string, unknown>>(files, UI_VIEWS_FILE, {}));
    handle('uiViews:save', (_e, data) => writeJson(files, UI_VIEWS_FILE, data));
  },
};

export { uiViewsHandlers };
