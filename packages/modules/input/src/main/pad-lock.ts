/* @layer electron-main @kind logic */
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { PadClaim, PadHolder, PadLock, PadLockOptions } from './pad-lock.type';
import { PAD_LOCK_FILE } from './pad-lock.constants';

const processIsAlive = (pid: number): boolean => {
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return (err as NodeJS.ErrnoException).code === 'EPERM';
  }
};

const readHolder = (file: string): PadHolder | null => {
  try {
    const parsed = JSON.parse(readFileSync(file, 'utf8')) as Partial<PadHolder>;
    if (typeof parsed.pid !== 'number') return null;
    return { pid: parsed.pid, product: String(parsed.product ?? 'unknown'), since: String(parsed.since ?? '') };
  } catch {
    return null;
  }
};

const createPadLock = ({ product, dir = tmpdir(), pid = process.pid, isAlive = processIsAlive }: PadLockOptions): PadLock => {
  const file = join(dir, PAD_LOCK_FILE);
  const record = JSON.stringify({ pid, product, since: new Date().toISOString() } satisfies PadHolder);

  const write = (flag: 'w' | 'wx'): boolean => {
    try {
      writeFileSync(file, record, { flag });
      return true;
    } catch (err) {
      return (err as NodeJS.ErrnoException).code !== 'EEXIST';
    }
  };

  const claim = (takeOver: boolean): PadClaim => {
    if (takeOver) {
      write('w');
      return { ok: true };
    }
    for (let attempt = 0; attempt < 2; attempt += 1) {
      if (write('wx')) return { ok: true };
      const holder = readHolder(file);
      if (holder && holder.pid !== pid && isAlive(holder.pid)) return { ok: false, holder };
      rmSync(file, { force: true });
    }
    return { ok: true };
  };

  const release = (): void => {
    if (readHolder(file)?.pid === pid) rmSync(file, { force: true });
  };

  return { claim, release };
};

export { createPadLock };
