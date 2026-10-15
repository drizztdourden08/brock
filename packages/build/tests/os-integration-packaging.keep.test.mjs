/* @layer tooling-scripts @kind test */
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createBuilderConfig } from '../src/builder-config.mjs';
import { rceditOptions, windowsVersionStrings } from '../src/packaging/windows-version-info.mjs';
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
    expect(config.extraMetadata).toEqual({ author: { name: 'Someone', email: 'someone@example.com' }, homepage: 'https://github.com/someone/my-app' });
    expect(config.linux).toMatchObject({ maintainer: 'Someone <someone@example.com>', vendor: 'Someone', synopsis: 'Plays packs.', description: 'Plays packs.' });
    const bare = createBuilderConfig(PRODUCT, { rootDir: tempRoot() });
    expect(bare.extraMetadata).toEqual({ author: { name: 'someone' } });
    expect(bare.linux.maintainer).toBe('someone');
  });

  it('passes each file type description, the desktop category and the copyright', () => {
    const product = { ...PRODUCT, linuxCategory: 'Game', copyright: 'Copyright (C) 2026 Someone', fileAssociations: [{ ...PRODUCT.fileAssociations[0], description: 'A pack of tracks' }] };
    const config = createBuilderConfig(product, { rootDir: tempRoot() });
    expect(config.fileAssociations[0]).toMatchObject({ name: 'Music Pack', description: 'A pack of tracks' });
    expect(config.linux.category).toBe('Game');
    expect(config.copyright).toBe('Copyright (C) 2026 Someone');
    const bare = createBuilderConfig(PRODUCT, { rootDir: tempRoot() });
    expect(bare.linux.category).toBeUndefined();
    expect(bare.copyright).toMatch(/^Copyright \(C\) \d{4} someone$/);
  });
});

describe('Windows version info', () => {
  it('names the company, the product, the file and the copyright from the product', () => {
    expect(windowsVersionStrings({ ...PRODUCT, description: 'Plays packs.' }, 2026)).toEqual({
      CompanyName: 'someone', ProductName: 'My App', FileDescription: 'My App', LegalCopyright: 'Copyright (C) 2026 someone', Comments: 'Plays packs.',
    });
    expect(windowsVersionStrings({ ...PRODUCT, copyright: 'Copyright (C) Example Studio' }, 2026).LegalCopyright).toBe('Copyright (C) Example Studio');
  });

  it('stamps the strings, the versions and the file name, with the icon when there is one', () => {
    const versionStrings = windowsVersionStrings(PRODUCT, 2026);
    expect(rceditOptions({ icoPath: 'build/icons/icon.ico', versionStrings, version: '1.4.0', exeName: 'My App.exe' })).toEqual({
      icon: 'build/icons/icon.ico',
      'version-string': { ...versionStrings, InternalName: 'My App', OriginalFilename: 'My App.exe' },
      'file-version': '1.4.0',
      'product-version': '1.4.0',
    });
    expect(rceditOptions({ icoPath: null, versionStrings, version: '1.4.0', exeName: 'My App.exe' }).icon).toBeUndefined();
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
