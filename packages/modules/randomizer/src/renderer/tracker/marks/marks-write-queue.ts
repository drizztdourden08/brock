/* @layer renderer-shell @kind logic */
const marksWriteQueue: { tail: Promise<void> } = { tail: Promise.resolve() };

export { marksWriteQueue };
