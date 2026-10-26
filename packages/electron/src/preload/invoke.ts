/* @layer electron-main @kind logic */
import type { InvokeFn } from './bridge.type';
import { invokeCoded } from './invoke-coded';

const invoke: InvokeFn = (channel, ...args) => invokeCoded(channel, args) as never;

export { invoke };
