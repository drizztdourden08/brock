/* @layer renderer-shell @kind logic */
import type { FramePainted } from './renderer-boot.type';

const framePainted = (): FramePainted => {
  let resolve: () => void = () => undefined;
  const promise = new Promise<void>((done) => { resolve = done; });
  return { promise, resolve };
};

export { framePainted };
