/* @layer electron-main @kind logic */
const encodeMessage = (value: unknown, maxBytes: number): string | null => {
  try {
    const text = JSON.stringify(value);
    return Buffer.byteLength(text, 'utf8') > maxBytes ? null : `${text}\n`;
  } catch {
    return null;
  }
};

export { encodeMessage };
