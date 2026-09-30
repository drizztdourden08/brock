/* @layer electron-main @kind logic */
import { emit } from '../ipc/emit';
import { widgetWindowControl } from './widget-window-control';

const sendReviewPref = (id: string, key: string, value: unknown): boolean => {
  const win = widgetWindowControl.windowOf(id);
  if (!win) return false;
  emit(win, 'review:widgetPref', key, value);
  return true;
};

export { sendReviewPref };
