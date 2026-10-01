/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { defineProduct } from '../src/product/define-product';

const BASE = { id: 'my-app', name: 'My App', appId: 'com.example.my-app', author: { name: 'someone' } };

describe('product.window.titleBar', () => {
  it('shows every title bar control by default', () => {
    expect(defineProduct(BASE).window.titleBar).toEqual({ controls: { fullscreen: true, pin: true, minimize: true, maximize: true } });
  });

  it('merges the controls an app turns off over the defaults and keeps the rest of the window', () => {
    const { window } = defineProduct({ ...BASE, window: { minSize: { width: 400, height: 300 }, titleBar: { controls: { fullscreen: false, pin: false } } } });
    expect(window.titleBar.controls).toEqual({ fullscreen: false, pin: false, minimize: true, maximize: true });
    expect(window.minSize).toEqual({ width: 400, height: 300 });
    expect(window.title).toBe('My App');
  });
});
