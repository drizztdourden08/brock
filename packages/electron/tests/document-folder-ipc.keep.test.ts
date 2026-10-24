/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { existsSync } from 'fs';
import { rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { sessionOf } from './folder-fixture';
import type { Call } from './folder-fixture';
import { openWorld } from './folder-ops-fixture';
import type { OpsWorld } from './folder-ops-fixture';

let world: OpsWorld;
let call: Call;

beforeEach(async () => {
  world = await openWorld('brock-folder-ipc-');
  call = sessionOf({ documents: world.access });
});

afterEach(async () => {
  await rm(world.base, { recursive: true, force: true });
});

describe('the file operations over the document channels', () => {
  it('trash, rename and mkdir work inside the grant and are refused outside it', async () => {
    const { granted, outside, trashed } = world;
    await call('document:mkdir', join(granted, 'a', 'b'), { recursive: true });
    await writeFile(join(granted, 'a', 'b', 'f.txt'), 'f');
    await call('document:rename', join(granted, 'a', 'b', 'f.txt'), join(granted, 'a', 'g.txt'));
    await call('document:trash', join(granted, 'a', 'g.txt'));
    expect(existsSync(join(granted, 'a', 'b', 'f.txt'))).toBe(false);
    await call('document:trash', join(granted, 'a'));
    expect(trashed).toEqual([join(granted, 'a', 'g.txt'), join(granted, 'a')]);
    await expect(call('document:trash', join(outside, 'secret.txt'))).rejects.toThrow(/granted folder/);
    await expect(call('document:rename', join(granted, 'sub'), join(outside, 'sub'))).rejects.toThrow(/granted folder/);
    await expect(call('document:mkdir', join(outside, 'new'))).rejects.toThrow(/granted folder/);
    await expect(call('document:trash', granted)).rejects.toThrow(/granted folder itself/);
    await expect(call('document:mkdir', join(granted, '.git'))).rejects.toThrow(/may not be changed/);
    await expect(call('document:rename', join(granted, 'sub'), join(granted, '.vscode'))).rejects.toThrow(/may not be changed/);
  });

  it('revokeFolder from the renderer removes the grant and answers whether there was one', async () => {
    const { granted } = world;
    expect(await call('document:revokeFolder', granted)).toBe(true);
    expect(await call('document:revokeFolder', granted)).toBe(false);
    await expect(call('document:readText', join(granted, 'sub', 'in.txt'))).rejects.toThrow(/may not use/);
  });
});
