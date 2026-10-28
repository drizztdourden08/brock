/* @layer electron-main @kind logic */
import { on } from 'events';
import type { IncomingMessage } from 'electron';

const chunksOf = (response: IncomingMessage): AsyncIterable<Uint8Array> => ({
  [Symbol.asyncIterator]: () => {
    const events = on(response, 'data', { close: ['end', 'aborted'] })[Symbol.asyncIterator]();
    return {
      next: async () => {
        const step = await events.next();
        return step.done === true ? { done: true, value: undefined } : { done: false, value: (step.value as [Uint8Array])[0] };
      },
      return: async () => {
        await events.return?.();
        return { done: true, value: undefined };
      },
    };
  },
});

export { chunksOf };
