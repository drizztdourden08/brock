/* @layer electron-main @kind test */
import { describe, expect, it } from 'vitest';
import { EventEmitter } from 'events';
import { chunksOf } from '../src/main/network/response-chunks';

const drain = async (response: EventEmitter): Promise<number[]> => {
  const seen: number[] = [];
  for await (const chunk of chunksOf(response)) seen.push(...chunk);
  return seen;
};

const later = (run: () => void): void => {
  setTimeout(run, 0);
};

describe('response chunks', () => {
  it('yields every chunk and ends on end', async () => {
    const response = new EventEmitter();
    later(() => {
      response.emit('data', Uint8Array.from([1, 2]));
      response.emit('data', Uint8Array.from([3]));
      response.emit('end');
      response.emit('close');
    });
    expect(await drain(response)).toEqual([1, 2, 3]);
  });

  it('rejects when the connection is aborted part way', async () => {
    const response = new EventEmitter();
    later(() => {
      response.emit('data', Uint8Array.from([1]));
      response.emit('aborted');
    });
    await expect(drain(response)).rejects.toThrow(/connection was cut/);
  });

  it('rejects when the stream closes without an end', async () => {
    const response = new EventEmitter();
    later(() => {
      response.emit('data', Uint8Array.from([1]));
      response.emit('close');
    });
    await expect(drain(response)).rejects.toThrow(/closed before the answer was complete/);
  });

  it('rejects when the stream reports an error', async () => {
    const response = new EventEmitter();
    later(() => response.emit('error', new Error('socket hang up')));
    await expect(drain(response)).rejects.toThrow(/socket hang up/);
  });
});
