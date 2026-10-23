/* @layer electron-main @kind logic */
import type { AskOutcome } from '@drizztdourden08/brock-core/ipc';
import type { SendFn, SubscribeFn } from './bridge.type';
import type { Answerer } from './create-answerer.type';

const failureOf = (err: unknown): string => {
  const message = typeof err === 'object' && err !== null && 'message' in err ? err.message : err;
  return typeof message === 'string' ? message : String(message);
};

const createAnswerer = (listen: SubscribeFn, reply: SendFn): Answerer => {
  const handlers = new Map<string, (...args: unknown[]) => unknown>();

  const run = async (channel: string, args: unknown[]): Promise<AskOutcome> => {
    const handler = handlers.get(channel);
    if (!handler) return { ok: false, message: `no handler is registered for "${channel}"` };
    try {
      return { ok: true, value: await handler(...args) };
    } catch (err) {
      return { ok: false, message: failureOf(err) };
    }
  };

  listen('ask:request', (id, channel, args) => {
    void run(channel, args).then((outcome) => reply('ask:reply', id, outcome));
  });

  return (channel, handler) => {
    const entry = handler as (...args: unknown[]) => unknown;
    handlers.set(channel, entry);
    return () => {
      if (handlers.get(channel) === entry) handlers.delete(channel);
    };
  };
};

export { createAnswerer };
