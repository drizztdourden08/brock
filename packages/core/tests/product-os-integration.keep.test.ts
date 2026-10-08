/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { defineProduct } from '../src/product/define-product';
import type { ProductInput } from '../src/product/product.type';

const BASE = { id: 'my-app', name: 'My App', appId: 'com.example.myapp', author: { name: 'someone' } };

const define = (extra: Partial<ProductInput>) => () => defineProduct({ ...BASE, ...extra });

describe('product OS integration', () => {
  it('keeps the schemes, deep link protocols and file associations it is given', () => {
    const product = defineProduct({
      ...BASE,
      schemes: [{ scheme: 'app-media', dir: 'media' }],
      protocols: [{ scheme: 'my-app' }],
      fileAssociations: [{ ext: 'mypack', name: 'Music Pack', progId: 'MyApp.Pack', mimeType: 'application/x-mypack' }],
    });
    expect(product.schemes).toEqual([{ scheme: 'app-media', dir: 'media' }]);
    expect(product.protocols).toEqual([{ scheme: 'my-app' }]);
    expect(product.fileAssociations[0]?.ext).toBe('mypack');
  });

  it('defaults every list to empty', () => {
    const { schemes, protocols, fileAssociations } = defineProduct(BASE);
    expect([schemes, protocols, fileAssociations]).toEqual([[], [], []]);
  });

  it('refuses a scheme that is not a bare lower case name, or that the browser owns', () => {
    expect(define({ protocols: [{ scheme: 'MyApp://' }] })).toThrow(/must be lower case/);
    expect(define({ protocols: [{ scheme: 'https' }] })).toThrow(/belongs to the browser/);
    expect(define({ schemes: [{ scheme: 'file' }] })).toThrow(/belongs to the browser/);
  });

  it('refuses a served folder outside Data/', () => {
    expect(define({ schemes: [{ scheme: 'app-media', dir: '../secrets' }] })).toThrow(/inside Data/);
    expect(define({ schemes: [{ scheme: 'app-media', dir: 'C:\\Windows' }] })).toThrow(/inside Data/);
    expect(define({ schemes: [{ scheme: 'app-media', dir: '/etc' }] })).toThrow(/inside Data/);
  });

  it('refuses an extension with a dot, a bad ProgId and a repeat', () => {
    expect(define({ fileAssociations: [{ ext: '.mypack', name: 'Music Pack', progId: 'MyApp.Pack' }] })).toThrow(/no dot/);
    expect(define({ fileAssociations: [{ ext: 'mypack', name: 'Music Pack', progId: 'music pack' }] })).toThrow(/MyApp.Document/);
    expect(define({
      fileAssociations: [
        { ext: 'mypack', name: 'A', progId: 'MyApp.A' },
        { ext: 'MYPACK', name: 'B', progId: 'MyApp.B' },
      ],
    })).toThrow(/twice/);
    expect(define({ protocols: [{ scheme: 'my-app' }, { scheme: 'my-app' }] })).toThrow(/twice/);
  });
});
