/* @layer electron-main @kind logic */
import type { BridgeArgsCheck, BridgeReply, BridgeRequest, BridgeSession } from './bridge.type';
import { BRIDGE_CODES, BRIDGE_ERROR_DATA_BYTES, BRIDGE_FAILED } from './bridge.constants';
import { BridgeError } from './bridge-error';
import { parseJson } from './parse-json';
import { toJson } from './to-json';

const passes = (validate: BridgeArgsCheck | null, args: readonly unknown[]): boolean => {
  if (!validate) return true;
  try {
    return validate(args);
  } catch {
    return false;
  }
};

const dataOf = (data: unknown): { data?: unknown } => {
  const text = data === undefined ? null : toJson(data);
  return text !== null && Buffer.byteLength(text, 'utf8') <= BRIDGE_ERROR_DATA_BYTES ? { data: parseJson(text) } : {};
};

const failureOf = (id: number, error: unknown): BridgeReply =>
  (error instanceof BridgeError
    ? { id, ok: false, error: error.message, code: error.code, ...dataOf(error.data) }
    : { id, ok: false, error: BRIDGE_FAILED, code: BRIDGE_CODES.failed });

const answerRequest = async ({ id, channel, args }: BridgeRequest, session: BridgeSession, connectionId: string): Promise<BridgeReply> => {
  const route = session.routes.get(channel);
  if (!route) return { id, ok: false, error: `no handler is registered for "${channel}"`, code: BRIDGE_CODES.noHandler };
  const list = parseJson(args);
  if (!Array.isArray(list) || !passes(route.validate, list)) return { id, ok: false, error: `invalid arguments for "${channel}"`, code: BRIDGE_CODES.invalidArguments };
  try {
    return { id, ok: true, value: await route.call(list, { connectionId }) };
  } catch (error) {
    session.onError(channel, error);
    return failureOf(id, error);
  }
};

export { answerRequest };
