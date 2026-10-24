/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { defineProduct } from '../src/product/define-product';

const BASE = { id: 'my-app', name: 'My App', appId: 'com.example.my-app', author: { name: 'someone' } };

describe('product.tray', () => {
  it('is left out when the product does not ask for a tray', () => {
    expect(defineProduct(BASE)).not.toHaveProperty('tray');
  });

  it('keeps the tooltip, the icon and the menu as written', () => {
    const tray = {
      tooltip: 'My App is running',
      icon: 'build/tray.png',
      menu: [{ label: 'Show My App', action: 'show' as const }, { type: 'separator' as const }, { label: 'Pause', id: 'pause' }, { label: 'Quit', action: 'quit' as const }],
    };
    expect(defineProduct({ ...BASE, tray }).tray).toEqual(tray);
  });

  it('refuses an empty tooltip, an empty label and a repeated id', () => {
    expect(() => defineProduct({ ...BASE, tray: { tooltip: ' ' } })).toThrow(/product\.tray\.tooltip/);
    expect(() => defineProduct({ ...BASE, tray: { tooltip: 'x', menu: [{ label: ' ', action: 'show' }] } })).toThrow(/label/);
    const twice = [{ label: 'A', id: 'go' }, { label: 'B', id: 'go' }];
    expect(() => defineProduct({ ...BASE, tray: { tooltip: 'x', menu: twice } })).toThrow(/product\.tray\.menu id "go"/);
  });
});
