/* @layer renderer-shell @kind logic */
import { holdScreenshot } from './hold-screenshot';
import { BODY_MOUNT_FRAMES, BODY_MOUNT_MS, FRAME_FALLBACK_MS } from './screenshot.constants';
import type { BodyStatus, PendingBody } from './screenshot.type';

const pending = new Map<string, PendingBody>();
const mountedBodies = new Map<string, number>();
const loop = { running: false };

const nextFrame = (fn: () => void): void => {
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(fn);
  else setTimeout(fn, FRAME_FALLBACK_MS);
};

const finish = (key: string): void => {
  pending.get(key)?.release();
  pending.delete(key);
};

const givenUp = (body: PendingBody): boolean => {
  if (performance.now() - body.since >= BODY_MOUNT_MS) return true;
  const status = body.status();
  if (status === 'closed') return true;
  if (status === 'open') body.frames += 1;
  return body.frames >= BODY_MOUNT_FRAMES;
};

const tick = (): void => {
  for (const [key, body] of pending) if (givenUp(body)) finish(key);
  loop.running = pending.size > 0;
  if (loop.running) nextFrame(tick);
};

const request = (key: string, status: () => BodyStatus): void => {
  if (pending.has(key) || (mountedBodies.get(key) ?? 0) > 0) return;
  pending.set(key, { release: holdScreenshot(), status, frames: 0, since: performance.now() });
  if (loop.running) return;
  loop.running = true;
  nextFrame(tick);
};

const mounted = (key: string): (() => void) => {
  mountedBodies.set(key, (mountedBodies.get(key) ?? 0) + 1);
  finish(key);
  return () => {
    const left = (mountedBodies.get(key) ?? 1) - 1;
    if (left > 0) mountedBodies.set(key, left);
    else mountedBodies.delete(key);
  };
};

const bodyHolds = { request, mounted, pending: (): number => pending.size };

export { bodyHolds };
