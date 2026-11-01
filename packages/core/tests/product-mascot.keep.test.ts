/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { defineProduct } from '../src/product/define-product';

const BASE = { id: 'my-app', name: 'My App', appId: 'com.example.my-app', author: { name: 'someone' } };

describe('K1 product.mascot', { tags: ['critical'] }, () => {
  it('keeps false, which turns the walking mascot off', () => {
    expect(defineProduct({ ...BASE, mascot: false }).mascot).toBe(false);
  });

  it('refuses an empty search hint', () => {
    expect(() => defineProduct({ ...BASE, mascot: { searchHint: '  ' } })).toThrow(/product\.mascot\.searchHint/);
  });
});
