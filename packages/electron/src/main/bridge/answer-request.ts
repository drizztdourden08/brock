/* @layer electron-main @kind logic */
import type { BridgeArgsCheck, BridgeReply, BridgeRequest, BridgeSession } from './bridge.type';
import { BRIDGE_FAILED } from './bridge.constants';
import { BridgeError } from './bridge-error';
import { parseJson } from './parse-json';

const passes = (validate: BridgeArgsCheck | null, args: readonly unknown[]): boolean => {
  if (!validate) return true;
  try {
    return validate(args);
  } catch {
    return false;
  }
};

const answerRequest = async ({ id, channel, args }: BridgeRequest, session: BridgeSession): Promise<BridgeReply> => {
  const route = session.routes.get(channel);
  if (!route) return { id, ok: false, error: `no handler is registered for "${channel}"` };
  const list = parseJson(args);
  if (!Array.isArray(list) || !passes(route.validate, list)) return { id, ok: false, error: `invalid arguments for "${channel}"` };
  try {
    return { id, ok: true, value: await route.call(list) };
  } catch (error) {
    session.onError(channel, error);
    return { id, ok: false, error: error instanceof BridgeError ? error.message : BRIDGE_FAILED };
  }
};

export { answerRequest };
