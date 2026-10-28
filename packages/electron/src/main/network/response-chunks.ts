/* @layer electron-main @kind logic */
import { on } from 'events';
import type { EventEmitter } from 'events';

const fail = (response: EventEmitter, reason: string): void => {
  response.emit('error', new Error(`net.read stopped: ${reason}`));
};

const chunksOf = (response: EventEmitter): AsyncIterable<Uint8Array> => ({
  [Symbol.asyncIterator]: () => {
    let ended = false;
    response.once('end', () => {
      ended = true;
    });
    response.once('aborted', () => fail(response, 'the connection was cut'));
    response.once('close', () => {
      if (!ended) fail(response, 'the connection closed before the answer was complete');
    });
    const events = on(response, 'data', { close: ['end'] })[Symbol.asyncIterator]();
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
