/* @layer core @kind logic */
import type { McpSerialQueue } from './mcp.type';

const createSerialQueue = (): McpSerialQueue => {
  let tail: Promise<void> = Promise.resolve();
  let waiting = 0;
  const run = async <T>(job: () => T | Promise<T>): Promise<T> => {
    waiting += 1;
    const turn = tail;
    let release = (): void => undefined;
    tail = new Promise<void>((resolve) => {
      release = resolve;
    });
    await turn;
    try {
      return await job();
    } finally {
      waiting -= 1;
      release();
    }
  };
  return { run, pending: () => waiting };
};

export { createSerialQueue };
