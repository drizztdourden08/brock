/* @layer electron-main @kind test */
import { existsSync, readFileSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { JsonValue } from '@drizztdourden08/brock-core/ipc';
import { backgroundMode } from '../src/main/background/background-mode';
import { userDataRoot } from '../src/main/paths/user-data-root';
import { restartApp } from '../src/main/restart/restart-app';
import { HANDOFF_FILE, HANDOFF_MAX_BYTES, HANDOFF_TTL_MS } from '../src/main/restart/restart.constants';
import { takeHandoff } from '../src/main/restart/take-handoff';
import { takeRestartHandoff } from '../src/main/restart/take-restart-handoff';
import { writeHandoff } from '../src/main/restart/write-handoff';
import { closeOpened, tempDir } from './bridge-fixture';

const fakeApp = vi.hoisted(() => ({ relaunch: vi.fn(), exit: vi.fn() }));
vi.mock('electron', () => ({ app: fakeApp }));

const realArgv = process.argv;
const T0 = 1_000_000;
const NOTE = { program: 'helper', grant: { level: 'edit' }, list: [1, 2, 3] } satisfies JsonValue;

let file = '';

beforeEach(() => {
  userDataRoot.path = tempDir();
  file = join(userDataRoot.path, HANDOFF_FILE);
  fakeApp.relaunch.mockClear();
  fakeApp.exit.mockClear();
  backgroundMode.active = false;
});

afterEach(() => {
  process.argv = realArgv;
  backgroundMode.active = false;
  closeOpened();
});

describe('the restart handoff blob', () => {
  it('is read once: the first read returns the value and the second returns null', () => {
    writeHandoff(file, NOTE, () => T0);
    expect(takeHandoff(file, () => T0 + 5)).toEqual(NOTE);
    expect(existsSync(file)).toBe(false);
    expect(takeHandoff(file, () => T0 + 6)).toBeNull();
  });

  it('keeps every JSON kind, including a bare string and null', () => {
    writeHandoff(file, 'hello', () => T0);
    expect(takeHandoff(file, () => T0)).toBe('hello');
    writeHandoff(file, null, () => T0);
    expect(takeHandoff(file, () => T0)).toBeNull();
    expect(existsSync(file)).toBe(false);
  });

  it('expires 60 seconds after it was written, and the expired file is deleted', () => {
    writeHandoff(file, NOTE, () => T0);
    expect(takeHandoff(file, () => T0 + HANDOFF_TTL_MS)).toBeNull();
    expect(existsSync(file)).toBe(false);
    writeHandoff(file, NOTE, () => T0);
    expect(takeHandoff(file, () => T0 + HANDOFF_TTL_MS - 1)).toEqual(NOTE);
  });

  it('ignores and deletes a blob written in the future', () => {
    writeHandoff(file, NOTE, () => T0 + 10_000);
    expect(takeHandoff(file, () => T0)).toBeNull();
    expect(existsSync(file)).toBe(false);
  });

  it.each([
    ['text that is not JSON', 'not json'],
    ['a JSON array', '[1,2]'],
    ['an envelope with no time', JSON.stringify({ value: 1 })],
    ['an envelope with a time that is not a number', JSON.stringify({ writtenAt: 'now', value: 1 })],
    ['an envelope with no value', JSON.stringify({ writtenAt: T0 })],
    ['an empty file', ''],
  ])('ignores and deletes %s', (_name, text) => {
    writeFileSync(file, text);
    expect(takeHandoff(file, () => T0)).toBeNull();
    expect(existsSync(file)).toBe(false);
  });

  it('returns null when no blob exists', () => {
    expect(takeHandoff(file, () => T0)).toBeNull();
  });

  it('refuses to write a value over 64 KB and writes nothing', () => {
    expect(() => writeHandoff(file, 'x'.repeat(HANDOFF_MAX_BYTES + 1))).toThrow(/larger than 65536/);
    expect(existsSync(file)).toBe(false);
  });

  it('accepts a value exactly at the limit', () => {
    const value = 'x'.repeat(HANDOFF_MAX_BYTES - 2);
    writeHandoff(file, value, () => T0);
    expect(takeHandoff(file, () => T0)).toBe(value);
  });

  it('ignores and deletes a file that is oversize on disk', () => {
    writeFileSync(file, JSON.stringify({ writtenAt: T0, value: 'x'.repeat(HANDOFF_MAX_BYTES + 500) }));
    expect(takeHandoff(file, () => T0)).toBeNull();
    expect(existsSync(file)).toBe(false);
  });

  it('refuses a value that is not JSON', () => {
    const dated: unknown = { when: new Date() };
    expect(() => writeHandoff(file, dated as JsonValue)).toThrow(/must be JSON/);
    expect(() => writeHandoff(file, Number.NaN)).toThrow(/must be JSON/);
    expect(existsSync(file)).toBe(false);
  });

});

describe('the restart handoff file', () => {
  it.runIf(process.platform !== 'win32')('is written with mode 600 in a private folder', () => {
    writeHandoff(file, NOTE, () => T0);
    expect(statSync(file).mode & 0o777).toBe(0o600);
    expect(readFileSync(file, 'utf8')).toContain('"writtenAt"');
  });

  it('is read once through the main reader the next boot uses', () => {
    writeHandoff(file, NOTE);
    expect(takeRestartHandoff()).toEqual(NOTE);
    expect(takeRestartHandoff()).toBeNull();
  });
});

describe('restartApp', () => {
  it('writes the handoff, relaunches with the same args and exits', () => {
    process.argv = ['electron', '/app', '--user-data=/d', '--no-focus', '--muted'];
    restartApp({ handoff: NOTE });
    expect(fakeApp.relaunch).toHaveBeenCalledWith({ args: ['/app', '--user-data=/d', '--no-focus', '--muted'] });
    expect(fakeApp.exit).toHaveBeenCalledWith(0);
    expect(takeRestartHandoff()).toEqual(NOTE);
  });

  it('writes no file when there is no handoff', () => {
    process.argv = ['electron', '/app'];
    restartApp();
    expect(existsSync(file)).toBe(false);
    expect(fakeApp.relaunch).toHaveBeenCalledWith({ args: ['/app'] });
  });

  it('keeps the window mode: a background app restarts in the background, a shown one without the flag', () => {
    process.argv = ['electron', '/app', '--background'];
    backgroundMode.active = true;
    restartApp();
    expect(fakeApp.relaunch).toHaveBeenLastCalledWith({ args: ['/app', '--background'] });
    backgroundMode.active = false;
    restartApp();
    expect(fakeApp.relaunch).toHaveBeenLastCalledWith({ args: ['/app'] });
  });

  it('lets the caller choose the window mode, adding the flag once', () => {
    process.argv = ['electron', '/app', '--background'];
    restartApp({ window: 'show' });
    expect(fakeApp.relaunch).toHaveBeenLastCalledWith({ args: ['/app'] });
    restartApp({ window: 'background' });
    expect(fakeApp.relaunch).toHaveBeenLastCalledWith({ args: ['/app', '--background'] });
  });

  it('does not relaunch when the handoff is refused', () => {
    process.argv = ['electron', '/app'];
    expect(() => restartApp({ handoff: 'x'.repeat(HANDOFF_MAX_BYTES + 1) })).toThrow();
    expect(fakeApp.relaunch).not.toHaveBeenCalled();
    expect(fakeApp.exit).not.toHaveBeenCalled();
  });
});
