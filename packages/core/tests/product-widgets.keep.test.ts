/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { defineProduct } from '../src/product/define-product';

const BASE = { id: 'my-app', name: 'My App', appId: 'com.example.my-app', author: { name: 'someone' } };

describe('product.widgets', () => {
  it('names the main view Main and keeps the keyboard with the app by default', () => {
    expect(defineProduct(BASE).widgets).toEqual({ mainLabel: 'Main', keepFocusWithApp: true });
  });

  it('lets an app turn the focus guard off and keeps the other defaults', () => {
    expect(defineProduct({ ...BASE, widgets: { keepFocusWithApp: false } }).widgets).toEqual({ mainLabel: 'Main', keepFocusWithApp: false });
    expect(defineProduct({ ...BASE, widgets: { mainLabel: 'Board' } }).widgets).toEqual({ mainLabel: 'Board', keepFocusWithApp: true });
  });
});
