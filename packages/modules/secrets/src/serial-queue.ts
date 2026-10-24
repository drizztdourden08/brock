/* @layer core @kind logic */
const createSerialQueue = (): (<T>(job: () => Promise<T>) => Promise<T>) => {
  let tail: Promise<unknown> = Promise.resolve();
  return (job) => {
    const run = tail.then(job, job);
    tail = run.then(() => undefined, () => undefined);
    return run;
  };
};

export { createSerialQueue };
