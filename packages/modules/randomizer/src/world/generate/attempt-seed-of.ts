/* @layer core @kind logic */
const attemptSeedOf = (seed: string, attempt: number): string =>
  (attempt === 0 ? seed : `${seed}#retry${attempt}`);

export { attemptSeedOf };
