/* @layer electron-main @kind logic */
import { EventEmitter } from 'events';
import type { BootEventMap } from './boot-state.type';

const bootEvents = new EventEmitter<BootEventMap>();

export { bootEvents };
