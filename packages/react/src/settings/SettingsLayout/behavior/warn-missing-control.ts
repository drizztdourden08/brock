/* @layer renderer-shell @kind logic */
import { getAppLog } from '../../../log/get-app-log';

const warned = new Set<string>();

const warnMissingControl = (key: string, value: unknown): void => {
  if (!import.meta.env.DEV || warned.has(key)) return;
  warned.add(key);
  getAppLog().log('app', `Settings row "${key}" draws nothing: no control fits its ${typeof value} value. Give it a control, or draw it with renderControl.`, 'warn');
};

export { warnMissingControl };
