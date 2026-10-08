/* @layer tooling-scripts @kind test */
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createBuilderConfig } from '../src/builder-config.mjs';
import { debPostinst } from '../src/platforms/linux/deb-postinst.mjs';

const PRODUCT = {
  id: 'relic-of-the-past',
  name: 'Relic of the Past',
  appId: 'com.relicofthepast.app',
  author: { name: 'someone' },
  protocols: [{ scheme: 'relic-of-the-past' }],
  fileAssociations: [
    { ext: 'msul', name: 'Music Pack', progId: 'RelicOfThePast.MusicPack', mimeType: 'application/x-msul', icon: 'file-icons/msul' },
    { ext: 'RSP', name: 'Character Sprite', progId: 'RelicOfThePast.SpritePack' },
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
    expect(config.protocols).toEqual([{ name: 'Relic of the Past', schemes: ['relic-of-the-past'] }]);
  });

  it('gives every file type a mime type, since Linux needs one', () => {
    const config = createBuilderConfig(PRODUCT, { rootDir: tempRoot() });
    expect(config.fileAssociations).toEqual([
      { ext: 'msul', name: 'Music Pack', mimeType: 'application/x-msul', icon: 'file-icons/msul' },
      { ext: 'RSP', name: 'Character Sprite', mimeType: 'application/x-rsp' },
    ]);
  });

  it('ships a Windows document icon where the registry entry looks for it', () => {
    const config = createBuilderConfig(PRODUCT, { rootDir: tempRoot() });
    expect(config.win.extraResources).toEqual([{ from: 'build/file-icons/msul.ico', to: 'file-icons/msul.ico' }]);
    const plain = createBuilderConfig({ ...PRODUCT, fileAssociations: [], protocols: [] }, { rootDir: tempRoot() });
    expect(plain.win.extraResources).toBeUndefined();
    expect(plain.protocols).toEqual([]);
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
