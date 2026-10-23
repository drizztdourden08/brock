/* @layer electron-main @kind logic */
import type { AskFn } from './ask.type';
import { ASK_TIMEOUT_MS } from './ask.constants';
import { askWithin } from './ask-within';

const ask: AskFn = (win, channel, ...args) => askWithin(ASK_TIMEOUT_MS, win, channel, ...args);

export { ask };
