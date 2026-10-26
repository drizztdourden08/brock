/* @layer electron-main @kind logic */
import type { InvokeMap, InvokeApi } from '@drizztdourden08/brock-core/ipc';
import { invokeCoded } from './invoke-coded';

const buildInvoke = <M extends InvokeMap>(map: M): InvokeApi<M> =>
  Object.fromEntries(
    Object.entries(map).map(([method, channel]) => [method, (...args: unknown[]) => invokeCoded(channel, args)]),
  ) as unknown as InvokeApi<M>;

export { buildInvoke };
