/* @layer electron-main @kind logic */
import type { BootTaskEvent } from '@drizztdourden08/brock-core/boot';
import type { BootSide } from '../boot/boot-state.type';
import { logBoot } from './boot-timing';

const logBootTask = (side: BootSide, event: BootTaskEvent): void => {
  const own = event.state === 'start' ? '' : ` (${event.ms}ms)`;
  const why = event.message ? `: ${event.message}` : '';
  logBoot(`${side} task ${event.id} ${event.state}${own}${why}`);
};

export { logBootTask };
