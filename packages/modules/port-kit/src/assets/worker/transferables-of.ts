/* @layer core @kind logic */
import { TRANSFER_SCAN_DEPTH } from './asset-worker.constants';

const ownBuffer = (view: ArrayBufferView): ArrayBuffer | null =>
  (view.buffer instanceof ArrayBuffer && view.byteOffset === 0 && view.byteLength === view.buffer.byteLength ? view.buffer : null);

const collect = (value: unknown, depth: number, out: Set<ArrayBuffer>): void => {
  if (ArrayBuffer.isView(value)) {
    const buffer = ownBuffer(value);
    if (buffer) out.add(buffer);
    return;
  }
  if (depth >= TRANSFER_SCAN_DEPTH || typeof value !== 'object' || value === null) return;
  for (const child of Array.isArray(value) ? value : Object.values(value)) collect(child, depth + 1, out);
};

const transferablesOf = (value: unknown): ArrayBuffer[] => {
  const out = new Set<ArrayBuffer>();
  collect(value, 0, out);
  return [...out];
};

export { transferablesOf };
