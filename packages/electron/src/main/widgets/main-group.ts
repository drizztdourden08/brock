/* @layer electron-main @kind logic */
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import type { WidgetWindowGroup } from '@drizztdourden08/brock-core';
import { stripBom } from '@drizztdourden08/brock-core/storage';
import { emit } from '../ipc/emit';
import { appendMainLog } from '../logs/append-main-log';
import { getUserDataPath } from '../paths/get-user-data-path';
import { getMainWindow } from '../window/get-main-window';
import { MAIN_GROUP_FILE } from './widget-windows.constants';

let current: WidgetWindowGroup | null = null;
let loaded = false;

const filePath = (): string => getUserDataPath('config', MAIN_GROUP_FILE);

const read = (): WidgetWindowGroup | null => {
  try {
    const raw = JSON.parse(stripBom(readFileSync(filePath(), 'utf-8'))) as { group?: unknown };
    return typeof raw.group === 'string' && raw.group !== '' ? raw.group : null;
  } catch {
    return null;
  }
};

const get = (): WidgetWindowGroup | null => {
  if (!loaded) {
    current = read();
    loaded = true;
  }
  return current;
};

const set = (group: WidgetWindowGroup | null): void => {
  current = group;
  loaded = true;
  try {
    mkdirSync(dirname(filePath()), { recursive: true });
    writeFileSync(filePath(), JSON.stringify({ group }, null, 2), 'utf-8');
  } catch (err) {
    appendMainLog('error', `[window-group] Failed to save: ${String(err)}`);
  }
  const main = getMainWindow();
  if (main && !main.isDestroyed()) emit(main, 'widget:mainGroup', group);
};

const mainGroup = { get, set };

export { mainGroup };
