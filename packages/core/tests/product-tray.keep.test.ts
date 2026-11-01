/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { defineProduct } from '../src/product/define-product';

const BASE = { id: 'my-app', name: 'My App', appId: 'com.example.my-app', author: { name: 'someone' } };

describe('K1 product.tray', { tags: ['critical'] }, () => {
  it('refuses an empty tooltip, an empty label and a repeated id', () => {
    expect(() => defineProduct({ ...BASE, tray: { tooltip: ' ' } })).toThrow(/product\.tray\.tooltip/);
    expect(() => defineProduct({ ...BASE, tray: { tooltip: 'x', menu: [{ label: ' ', action: 'show' }] } })).toThrow(/label/);
    const twice = [{ label: 'A', id: 'go' }, { label: 'B', id: 'go' }];
    expect(() => defineProduct({ ...BASE, tray: { tooltip: 'x', menu: twice } })).toThrow(/product\.tray\.menu id "go"/);
  });
});
