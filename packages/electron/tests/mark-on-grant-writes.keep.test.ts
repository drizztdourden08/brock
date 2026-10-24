/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { makeTree, sessionOf, testAccess } from './folder-fixture';
import type { Call } from './folder-fixture';

const marked = vi.hoisted(() => vi.fn<(path: string) => Promise<void>>());

vi.mock('electron', () => ({ dialog: {}, app: { addRecentDocument: () => undefined, clearRecentDocuments: () => undefined } }));
vi.mock('../src/main/documents/mark-of-the-web', () => ({ markOfTheWeb: marked }));

describe('writes through a folder grant', () => {
  let base = '';
  let granted = '';
  let call: Call;
  const access = testAccess();

  beforeEach(async () => {
    ({ base, granted } = await makeTree('brock-motw-'));
    access.allowFolder(granted);
    call = sessionOf({ documents: access });
    marked.mockReset();
    marked.mockResolvedValue();
  });

  afterEach(async () => {
    await rm(base, { recursive: true, force: true });
  });

  it('are marked, and a rejected write is not', async () => {
    await call('document:writeText', join(granted, 'sub', 'run.cmd'), 'echo');
    await call('document:write', join(granted, 'sub', 'notes.txt'), new Uint8Array([1]).buffer);
    await expect(call('document:writeText', join(granted, '.bashrc'), 'x')).rejects.toThrow(/may not use/);
    expect(marked.mock.calls.map(([path]) => path)).toEqual([join(granted, 'sub', 'run.cmd'), join(granted, 'sub', 'notes.txt')]);
  });

  it('are not marked for a file the user picked in a dialog', async () => {
    const picked = join(granted, 'sub', 'mine.cmd');
    await writeFile(picked, 'old');
    access.allow(picked);
    await call('document:writeText', picked, 'new');
    expect(marked).not.toHaveBeenCalled();
  });
});
