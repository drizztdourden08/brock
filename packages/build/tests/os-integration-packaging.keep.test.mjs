/* @layer tooling-scripts @kind test */
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createBuilderConfig } from '../src/builder-config.mjs';
import { debPostinst } from '../src/platforms/linux/deb-postinst.mjs';

const PRODUCT = {
  id: 'my-app',
  name: 'My App',
  appId: 'com.example.myapp',
  author: { name: 'someone' },
  protocols: [{ scheme: 'my-app' }],
  fileAssociations: [
    { ext: 'mypack', name: 'Music Pack', progId: 'MyApp.Pack', mimeType: 'application/x-mypack', icon: 'file-icons/mypack' },
    { ext: 'MYSKIN', name: 'Character Sprite', progId: 'MyApp.Skin' },
  ],
};

const roots = [];
const tempRoot = () => {
  const root = mkdtempSync(join(tmpdir(), 'brock-os-'));
  roots.push(root);
  return root;
};

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('createBuilderConfig OS integration', () => {
  it('passes the deep link schemes to electron-builder for Info.plist and the .desktop file', () => {
    const config = createBuilderConfig(PRODUCT, { rootDir: tempRoot() });
    expect(config.protocols).toEqual([{ name: 'My App', schemes: ['my-app'] }]);
  });

  it('gives every file type a mime type, since Linux needs one', () => {
    const config = createBuilderConfig(PRODUCT, { rootDir: tempRoot() });
    expect(config.fileAssociations).toEqual([
      { ext: 'mypack', name: 'Music Pack', mimeType: 'application/x-mypack', icon: 'file-icons/mypack' },
      { ext: 'MYSKIN', name: 'Character Sprite', mimeType: 'application/x-myskin' },
    ]);
  });

  it('ships a Windows document icon where the registry entry looks for it', () => {
    const config = createBuilderConfig(PRODUCT, { rootDir: tempRoot() });
    expect(config.win.extraResources).toEqual([{ from: 'build/file-icons/mypack.ico', to: 'file-icons/mypack.ico' }]);
    const plain = createBuilderConfig({ ...PRODUCT, fileAssociations: [], protocols: [] }, { rootDir: tempRoot() });
    expect(plain.win.extraResources).toBeUndefined();
    expect(plain.protocols).toEqual([]);
  });

  it('gives the .deb its homepage from product.repo and its maintainer from the author', () => {
    const config = createBuilderConfig({ ...PRODUCT, description: 'Plays packs.', author: { name: 'Someone', email: 'someone@example.com' }, repo: { owner: 'someone', name: 'my-app' } }, { rootDir: tempRoot() });
    expect(config.extraMetadata).toEqual({ homepage: 'https://github.com/someone/my-app' });
    expect(config.linux).toMatchObject({ maintainer: 'Someone <someone@example.com>', vendor: 'Someone', synopsis: 'Plays packs.', description: 'Plays packs.' });
    const bare = createBuilderConfig(PRODUCT, { rootDir: tempRoot() });
    expect(bare.extraMetadata).toBeUndefined();
    expect(bare.linux.maintainer).toBe('someone');
  });
});

describe('debPostinst OS integration', () => {
  it('refreshes the mime and desktop databases when the product opens links or files', () => {
    const [file] = debPostinst({ modules: [], rootDir: tempRoot(), config: { product: PRODUCT } });
    expect(file.path).toBe('build/linux/deb-postinst.sh');
    expect(file.content).toContain('update-mime-database /usr/share/mime');
    expect(file.content).toContain('update-desktop-database /usr/share/applications');
  });

  it('writes no hook for an app with nothing to install', () => {
    expect(debPostinst({ modules: [], rootDir: tempRoot(), config: { product: { ...PRODUCT, protocols: [], fileAssociations: [] } } })).toEqual([]);
  });
});
