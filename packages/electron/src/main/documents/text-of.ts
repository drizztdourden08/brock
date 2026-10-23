/* @layer electron-main @kind logic */
const textOf = (text: unknown): string => {
  if (typeof text !== 'string') throw new Error('A document text write needs a string');
  return text;
};

export { textOf };
