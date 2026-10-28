/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { defineProduct } from '../src/product';
import { isPrivateClipboardType, privateClipboardType } from '../src/platform';

const base = { id: 'my-app', name: 'My App', appId: 'com.example.my-app', author: { name: 'Me' } };

describe('product.net', () => {
  it('is left out unless the product lists hosts', () => {
    expect(defineProduct(base).net).toBeUndefined();
  });

  it('fills the content types and the byte cap, and lowers and trims the hosts', () => {
    const { net } = defineProduct({ ...base, net: { hosts: [' Lospec.com ', 'lospec.com', 'cdn.example.org'] } });
    expect(net).toEqual({ hosts: ['lospec.com', 'cdn.example.org'], contentTypes: ['application/json', 'text/plain', 'image/png'], maxBytes: 4 * 1024 * 1024 });
  });

  it('keeps the types and the cap a product sets', () => {
    const { net } = defineProduct({ ...base, net: { hosts: ['lospec.com'], contentTypes: ['text/*'], maxBytes: 100 } });
    expect(net).toEqual({ hosts: ['lospec.com'], contentTypes: ['text/*'], maxBytes: 100 });
  });

  it('refuses a host that is not a plain name', () => {
    for (const host of ['', 'localhost', '127.0.0.1', '1.2.3.4', '[::1]', 'https://lospec.com', 'lospec.com/x', 'lospec.com:443', '*.lospec.com', 'user@lospec.com', 'lospec .com', '.lospec.com', 'lospec.com.', 'a..b.com']) {
      expect(() => defineProduct({ ...base, net: { hosts: [host] } }), host).toThrow(/product.net.hosts/);
    }
    expect(() => defineProduct({ ...base, net: { hosts: [] } })).toThrow(/at least one host/);
  });

  it('refuses a bad content type or byte cap', () => {
    for (const type of ['json', '*/*', 'text/', '/json', 'text/html; charset=utf-8', '']) {
      expect(() => defineProduct({ ...base, net: { hosts: ['lospec.com'], contentTypes: [type] } }), type).toThrow(/contentTypes/);
    }
    expect(() => defineProduct({ ...base, net: { hosts: ['lospec.com'], contentTypes: [] } })).toThrow(/contentTypes/);
    for (const maxBytes of [0, -1, 1.5, 33 * 1024 * 1024, Number.NaN]) {
      expect(() => defineProduct({ ...base, net: { hosts: ['lospec.com'], maxBytes } }), String(maxBytes)).toThrow(/maxBytes/);
    }
  });
});

describe('private clipboard types', () => {
  it('builds a type in the product namespace and recognises only its own', () => {
    const type = privateClipboardType('bxel', 'clip');
    expect(type).toBe('application/x-bxel-clip');
    expect(isPrivateClipboardType('bxel', type)).toBe(true);
    expect(isPrivateClipboardType('other', type)).toBe(false);
    expect(isPrivateClipboardType('bxel', 'application/x-bxel-')).toBe(false);
    expect(isPrivateClipboardType('bxel', 'application/x-bxel-Clip')).toBe(false);
    expect(isPrivateClipboardType('bxel', 'text/plain')).toBe(false);
  });

  it('refuses a name that is not plain', () => {
    for (const name of ['', 'Clip', '-clip', 'a/b', 'a b', '..', 'x'.repeat(64)]) expect(() => privateClipboardType('bxel', name), name).toThrow(/plain clipboard type name/);
  });
});
