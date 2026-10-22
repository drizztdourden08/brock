/* @layer core @kind test */
import { mkdtempSync, existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PAD_LOCK_FILE } from '../src/main/pad-lock.constants';
import { createPadLock } from '../src/main/pad-lock';

describe('the pad lock', () => {
  let dir = '';
  const alive = new Set<number>();
  const heldBy = (): number => (JSON.parse(readFileSync(join(dir, PAD_LOCK_FILE), 'utf8')) as { pid: number }).pid;
  const lockAt = (pid: number, product = 'App') => createPadLock({ product, dir, pid, isAlive: (p) => alive.has(p) });

  beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'pad-lock-')); alive.clear(); });
  afterEach(() => { rmSync(dir, { recursive: true, force: true }); });

  it('lets a live launch claim a free pad and records the holder', () => {
    expect(lockAt(10, 'Probe').claim(false)).toEqual({ ok: true });
    expect(JSON.parse(readFileSync(join(dir, PAD_LOCK_FILE), 'utf8'))).toMatchObject({ pid: 10, product: 'Probe' });
  });

  it('refuses a live launch while another running instance holds the pad', () => {
    alive.add(20);
    lockAt(20, 'Owner').claim(true);
    const claim = lockAt(10).claim(false);
    expect(claim).toMatchObject({ ok: false, holder: { pid: 20, product: 'Owner' } });
  });

  it('refuses a second live launch too', () => {
    alive.add(10);
    lockAt(10).claim(false);
    expect(lockAt(11).claim(false).ok).toBe(false);
  });

  it('takes over a stale lock whose process is gone', () => {
    lockAt(20).claim(true);
    expect(lockAt(10).claim(false)).toEqual({ ok: true });
    expect(heldBy()).toBe(10);
  });

  it('takes over an unreadable lock file', () => {
    writeFileSync(join(dir, PAD_LOCK_FILE), 'not json');
    expect(lockAt(10).claim(false)).toEqual({ ok: true });
  });

  it('lets a normal launch take the pad from anyone', () => {
    alive.add(10);
    lockAt(10).claim(false);
    expect(lockAt(20, 'Owner').claim(true)).toEqual({ ok: true });
    expect(heldBy()).toBe(20);
  });

  it('releases only its own lock', () => {
    const mine = lockAt(10);
    mine.claim(false);
    lockAt(20).claim(true);
    mine.release();
    expect(existsSync(join(dir, PAD_LOCK_FILE))).toBe(true);
    const owner = lockAt(20);
    owner.release();
    expect(existsSync(join(dir, PAD_LOCK_FILE))).toBe(false);
  });

  it('never throws when the folder cannot be written', () => {
    const blind = createPadLock({ product: 'App', dir: join(dir, 'missing', 'deeper'), pid: 10 });
    expect(blind.claim(false)).toEqual({ ok: true });
    expect(() => blind.release()).not.toThrow();
  });
});
