/* @layer electron-main @kind logic */
const readCappedBody = async (body: AsyncIterable<Uint8Array> | null, maxBytes: number): Promise<Uint8Array> => {
  const chunks: Uint8Array[] = [];
  let total = 0;
  if (body !== null) {
    for await (const chunk of body) {
      total += chunk.length;
      if (total > maxBytes) throw new Error(`net.read stopped: the answer is over ${maxBytes} bytes`);
      chunks.push(chunk);
    }
  }
  const bytes = new Uint8Array(total);
  let at = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, at);
    at += chunk.length;
  }
  return bytes;
};

export { readCappedBody };
