/* @layer electron-main @kind logic */
import { screen } from 'electron';
import { readFileSync } from 'fs';
import type { WindowConfig } from '@drizztdourden08/brock-core/product';
import { stripBom } from '@drizztdourden08/brock-core/storage';
import type { WindowState } from './window-state.type';
import { appendMainLog } from '../logs/append-main-log';
import { windowStatePath } from './window-state-path';

const defaultState = (config: WindowConfig): WindowState => ({
  width: config.defaultSize.width,
  height: config.defaultSize.height,
  isMaximized: false,
  isFullscreen: false,
});

const isOnScreen = (x: number, y: number): boolean =>
  screen.getAllDisplays().some((d) => {
    const area = d.workArea;
    return x >= area.x - 50 && x < area.x + area.width - 50 && y >= area.y - 50 && y < area.y + area.height - 50;
  });

const dimension = (value: unknown, min: number, fallback: number): number =>
  typeof value === 'number' && value >= min ? value : fallback;

const coordinate = (value: unknown): number | undefined => (typeof value === 'number' ? value : undefined);

const fromSaved = (saved: Partial<WindowState>, config: WindowConfig, fallback: WindowState): WindowState => {
  const state: WindowState = {
    width: dimension(saved.width, config.minSize.width, fallback.width),
    height: dimension(saved.height, config.minSize.height, fallback.height),
    isMaximized: saved.isMaximized === true,
    isFullscreen: saved.isFullscreen === true,
    x: coordinate(saved.x),
    y: coordinate(saved.y),
  };
  if (state.x !== undefined && state.y !== undefined && !isOnScreen(state.x, state.y)) {
    state.x = undefined;
    state.y = undefined;
  }
  return state;
};

const loadWindowState = (config: WindowConfig): WindowState => {
  const fallback = defaultState(config);
  try {
    const saved = JSON.parse(stripBom(readFileSync(windowStatePath(), 'utf-8'))) as Partial<WindowState>;
    return fromSaved(saved, config, fallback);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      appendMainLog('warn', `[window-state] Failed to read ${windowStatePath()}, using defaults: ${String(err)}`);
    }
    return fallback;
  }
};

export { loadWindowState };
