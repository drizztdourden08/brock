/* @layer renderer-shell @kind logic */
import type { AskContract, AskHandler, ChannelRef } from '@drizztdourden08/brock-core';
import { requireHostApi } from './require-host-api';

const answer = <K extends keyof AskContract>(channel: K | ChannelRef<K>, handler: AskHandler<K>): (() => void) =>
  requireHostApi().answer(typeof channel === 'object' ? channel.channel : channel, handler);

export { answer };
