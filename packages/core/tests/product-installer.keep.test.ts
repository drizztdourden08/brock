/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { defineProduct } from '../src/product/define-product';

const BASE = { id: 'my-app', name: 'My App: Deluxe', appId: 'com.example.my-app', author: { name: 'someone' } };

describe('product.installer', () => {
  it('defaults to per user, both shortcuts, launch after install, no licence', () => {
    expect(defineProduct(BASE).installer).toEqual({
      scope: 'user',
      shortcuts: { desktop: true, startMenu: true },
      launchAfterInstall: true,
      folderName: 'My App Deluxe',
    });
  });

  it('merges partial settings over the defaults', () => {
    const { installer } = defineProduct({
      ...BASE,
      installer: { scope: 'machine', shortcuts: { desktop: false }, licence: 'LICENCE.md', folderName: 'Mine' },
    });
    expect(installer).toEqual({
      scope: 'machine',
      shortcuts: { desktop: false, startMenu: true },
      launchAfterInstall: true,
      licence: 'LICENCE.md',
      folderName: 'Mine',
    });
  });

  it('rejects an unknown scope, a licence that is not text and a folder name with a path in it', () => {
    expect(() => defineProduct({ ...BASE, installer: { scope: 'everyone' as 'user' } })).toThrow(/scope/);
    expect(() => defineProduct({ ...BASE, installer: { licence: 'LICENCE.rtf' } })).toThrow(/\.md or \.txt/);
    expect(() => defineProduct({ ...BASE, installer: { folderName: 'a\\b' } })).toThrow(/plain folder name/);
  });
});
