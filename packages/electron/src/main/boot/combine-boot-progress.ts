/* @layer electron-main @kind logic */
import type { BootProgress } from '@drizztdourden08/brock-core/boot';
import type { SplashProgressView } from '../../splash-preload/splash-bridge.type';
import type { BootSide } from './boot-state.type';
import { EMPTY_PROGRESS, RENDERER_RESERVE_WEIGHT } from './reveal.constants';

const combineBootProgress = (main: BootProgress | null, renderer: BootProgress | null, lastSide: BootSide): SplashProgressView => {
  const own = main ?? EMPTY_PROGRESS;
  const other = renderer ?? { ...EMPTY_PROGRESS, total: RENDERER_RESERVE_WEIGHT };
  const active = lastSide === 'renderer' && renderer ? renderer : own;
  const total = own.total + other.total;
  return { fraction: Math.min(1, (own.done + other.done) / total), label: active.label, detail: active.detail };
};

export { combineBootProgress };
