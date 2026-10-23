/* @layer electron-main @kind logic */
import type { BridgeReply, BridgeRequest, BridgeRouteFn } from './bridge.type';
import { BRIDGE_PROTOCOL } from './bridge.constants';

const messageOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

const answerRequest = async (request: BridgeRequest, routes: ReadonlyMap<string, BridgeRouteFn>): Promise<BridgeReply> => {
  const { id, channel } = request;
  if (request.v !== BRIDGE_PROTOCOL) return { id, ok: false, error: `the bridge speaks protocol ${BRIDGE_PROTOCOL}, not ${request.v}` };
  const route = routes.get(channel);
  if (!route) return { id, ok: false, error: `no handler is registered for "${channel}"` };
  try {
    return { id, ok: true, value: await route(request.args) };
  } catch (error) {
    return { id, ok: false, error: messageOf(error) };
  }
};

export { answerRequest };
