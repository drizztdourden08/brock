/* @layer electron-main @kind logic */
import { types } from 'util';

const bytesOf = (data: unknown, what: string): Uint8Array => {
  if (!types.isAnyArrayBuffer(data)) throw new Error(`${what} needs bytes`);
  return new Uint8Array(data);
};

export { bytesOf };
