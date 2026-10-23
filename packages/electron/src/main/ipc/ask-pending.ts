/* @layer electron-main @kind logic */
import type { PendingAsk } from './ask.type';

const pendingAsks = new Map<number, PendingAsk>();

export { pendingAsks };
