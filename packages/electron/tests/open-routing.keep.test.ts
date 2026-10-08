/* @layer electron-main @kind test */
import { resolve } from 'path';
import { describe, expect, it, vi } from 'vitest';
import type { OpenRequest } from '@drizztdourden08/brock-core/types';
import { createOpenRouter } from '../src/main/open/create-open-router';
import { openRequestsOf } from '../src/main/open/open-requests-of';
import { openTargets } from '../src/main/open/open-targets';
import { shouldLockInstance } from '../src/main/open/should-lock-instance';

const TARGETS = openTargets({
  protocols: [{ scheme: 'my-app' }],
  fileAssociations: [{ ext: 'MYPACK', name: 'Music Pack', progId: 'MyApp.Pack' }],
});

const LINK: OpenRequest = { kind: 'url', url: 'my-app://install/abc', scheme: 'my-app', source: 'launch' };

describe('openRequestsOf', () => {
  it('finds deep links and declared file types, skipping the executable, flags and anything else', () => {
    const cwd = resolve('/work');
    const argv = ['C:\\Apps\\MyApp.exe', '--allow-file-access-from-files', 'MY-APP://install/abc', 'packs/theme.mypack', 'notes.txt', 'https://example.com'];
    expect(openRequestsOf(argv, TARGETS, { cwd, source: 'running' })).toEqual([
      { kind: 'url', url: 'MY-APP://install/abc', scheme: 'my-app', source: 'running' },
      { kind: 'file', path: resolve(cwd, 'packs/theme.mypack'), ext: 'mypack', source: 'running' },
    ]);
  });

  it('ignores an argument longer than any real link', () => {
    const long = `my-app://${'a'.repeat(3000)}`;
    expect(openRequestsOf(['exe', long], TARGETS, { cwd: '/', source: 'launch' })).toEqual([]);
  });
});

describe('createOpenRouter', () => {
  it('holds requests until ready, then gives each to main handlers and, once taken, to the renderer', () => {
    const router = createOpenRouter();
    const main: OpenRequest[] = [];
    const renderer: OpenRequest[] = [];
    router.onOpen((request) => main.push(request));
    router.push([LINK]);
    expect(main).toEqual([]);

    router.ready((request) => renderer.push(request));
    expect(main).toEqual([LINK]);
    expect(router.take()).toEqual([LINK]);

    const second: OpenRequest = { ...LINK, source: 'running' };
    router.push([second]);
    expect(main).toEqual([LINK, second]);
    expect(renderer).toEqual([second]);
    expect(router.take()).toEqual([]);
  });

  it('keeps routing when a handler throws, and stops calling one that unsubscribed', () => {
    const errors = vi.fn();
    const router = createOpenRouter(errors);
    const later = vi.fn();
    router.onOpen(() => { throw new Error('boom'); });
    const stop = router.onOpen(later);
    router.ready(() => undefined);
    router.push([LINK]);
    stop();
    router.push([LINK]);
    expect(errors).toHaveBeenCalledTimes(2);
    expect(later).toHaveBeenCalledTimes(1);
  });
});

describe('shouldLockInstance', () => {
  const none = { schemes: [], extensions: [] };

  it('locks an app that opens links or files, and one that asks', () => {
    expect(shouldLockInstance({ wanted: undefined, targets: TARGETS, automation: false, namedInstance: false })).toBe(true);
    expect(shouldLockInstance({ wanted: true, targets: none, automation: false, namedInstance: false })).toBe(true);
    expect(shouldLockInstance({ wanted: undefined, targets: none, automation: false, namedInstance: false })).toBe(false);
  });

  it('never locks a named instance, an automation launch or an app that opts out', () => {
    expect(shouldLockInstance({ wanted: true, targets: TARGETS, automation: true, namedInstance: false })).toBe(false);
    expect(shouldLockInstance({ wanted: true, targets: TARGETS, automation: false, namedInstance: true })).toBe(false);
    expect(shouldLockInstance({ wanted: false, targets: TARGETS, automation: false, namedInstance: false })).toBe(false);
  });
});
