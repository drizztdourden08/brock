/* @layer renderer-shell @kind logic */
const abortable = <T>(promise: Promise<T>, signal: AbortSignal): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }
    signal.addEventListener('abort', () => reject(signal.reason), { once: true });
    promise.then(resolve, reject);
  });

export { abortable };
