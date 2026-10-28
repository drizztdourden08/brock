/* @layer renderer-shell @kind logic */
import type { ChangeSource } from './subscribe-snapshots.type';

const subscribeSnapshots = <T>(read: () => T, sources: readonly ChangeSource[], listener: (snapshot: T) => void): (() => void) => {
  let last = JSON.stringify(read());
  const check = (): void => {
    const next = read();
    const key = JSON.stringify(next);
    if (key === last) return;
    last = key;
    listener(next);
  };
  const stops = sources.map((source) => source(check));
  return () => {
    for (const stop of stops) stop();
  };
};

export { subscribeSnapshots };
