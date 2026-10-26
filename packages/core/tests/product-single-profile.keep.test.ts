/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { defineProduct } from '../src/product/define-product';

const BASE = { id: 'my-app', name: 'My App', appId: 'com.example.my-app', author: { name: 'someone' } };

describe('product.singleProfile', () => {
  it('is left out by default, so the profiles screen stays', () => {
    expect(defineProduct(BASE)).not.toHaveProperty('singleProfile');
  });

  it('is kept when the product turns it on', () => {
    expect(defineProduct({ ...BASE, singleProfile: true }).singleProfile).toBe(true);
  });
});

describe('product.initialProfile', () => {
  it('is left out by default and kept when set', () => {
    expect(defineProduct(BASE)).not.toHaveProperty('initialProfile');
    expect(defineProduct({ ...BASE, initialProfile: 'Default' }).initialProfile).toBe('Default');
  });
});
