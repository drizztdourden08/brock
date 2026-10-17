/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { defineProduct } from '../src/product/define-product';

const BASE = { id: 'my-app', name: 'My App', appId: 'com.example.my-app', author: { name: 'someone' } };

describe('product.mascot', () => {
  it('is left out when the product does not set it', () => {
    expect(defineProduct(BASE)).not.toHaveProperty('mascot');
  });

  it('keeps false, which turns the walking mascot off', () => {
    expect(defineProduct({ ...BASE, mascot: false }).mascot).toBe(false);
  });

  it('keeps a search hint of its own', () => {
    expect(defineProduct({ ...BASE, mascot: { searchHint: 'Find a game' } }).mascot).toEqual({ searchHint: 'Find a game' });
  });

  it('refuses an empty search hint', () => {
    expect(() => defineProduct({ ...BASE, mascot: { searchHint: '  ' } })).toThrow(/product\.mascot\.searchHint/);
  });
});
