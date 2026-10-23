/* @layer renderer-shell @kind logic */
const toArrayBuffer = (data: Uint8Array): ArrayBuffer =>
  data.byteOffset === 0 && data.byteLength === data.buffer.byteLength
    ? (data.buffer as ArrayBuffer)
    : (data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer);

export { toArrayBuffer };
