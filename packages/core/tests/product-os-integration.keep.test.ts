/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { defineProduct } from '../src/product/define-product';
import type { ProductInput } from '../src/product/product.type';

const BASE = { id: 'relic', name: 'Relic', appId: 'com.example.relic', author: { name: 'someone' } };

const define = (extra: Partial<ProductInput>) => () => defineProduct({ ...BASE, ...extra });

describe('product OS integration', () => {
  it('keeps the schemes, deep link protocols and file associations it is given', () => {
    const product = defineProduct({
      ...BASE,
      schemes: [{ scheme: 'app-sprite', dir: 'sprites' }],
      protocols: [{ scheme: 'relic-of-the-past' }],
      fileAssociations: [{ ext: 'msul', name: 'Music Pack', progId: 'Relic.MusicPack', mimeType: 'application/x-msul' }],
    });
    expect(product.schemes).toEqual([{ scheme: 'app-sprite', dir: 'sprites' }]);
    expect(product.protocols).toEqual([{ scheme: 'relic-of-the-past' }]);
    expect(product.fileAssociations[0]?.ext).toBe('msul');
  });

  it('defaults every list to empty', () => {
    const { schemes, protocols, fileAssociations } = defineProduct(BASE);
    expect([schemes, protocols, fileAssociations]).toEqual([[], [], []]);
  });

  it('refuses a scheme that is not a bare lower case name, or that the browser owns', () => {
    expect(define({ protocols: [{ scheme: 'Relic://' }] })).toThrow(/must be lower case/);
    expect(define({ protocols: [{ scheme: 'https' }] })).toThrow(/belongs to the browser/);
    expect(define({ schemes: [{ scheme: 'file' }] })).toThrow(/belongs to the browser/);
  });

  it('refuses a served folder outside Data/', () => {
    expect(define({ schemes: [{ scheme: 'app-sprite', dir: '../secrets' }] })).toThrow(/inside Data/);
    expect(define({ schemes: [{ scheme: 'app-sprite', dir: 'C:\\Windows' }] })).toThrow(/inside Data/);
    expect(define({ schemes: [{ scheme: 'app-sprite', dir: '/etc' }] })).toThrow(/inside Data/);
  });

  it('refuses an extension with a dot, a bad ProgId and a repeat', () => {
    expect(define({ fileAssociations: [{ ext: '.msul', name: 'Music Pack', progId: 'Relic.MusicPack' }] })).toThrow(/no dot/);
    expect(define({ fileAssociations: [{ ext: 'msul', name: 'Music Pack', progId: 'music pack' }] })).toThrow(/MyApp.Document/);
    expect(define({
      fileAssociations: [
        { ext: 'msul', name: 'A', progId: 'Relic.A' },
        { ext: 'MSUL', name: 'B', progId: 'Relic.B' },
      ],
    })).toThrow(/twice/);
    expect(define({ protocols: [{ scheme: 'relic' }, { scheme: 'relic' }] })).toThrow(/twice/);
  });
});
