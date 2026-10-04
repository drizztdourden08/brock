/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { defineProduct } from '../src/product/define-product';

const BASE = { id: 'my-app', name: 'My App', appId: 'com.example.my-app', author: { name: 'someone' } };

describe('product.icons.rim', () => {
  it('gives the brock brand the light rim', () => {
    expect(defineProduct({ ...BASE, icons: { brand: 'brock' } }).icons.rim).toBe('light');
  });

  it('keeps the rim an app sets', () => {
    expect(defineProduct({ ...BASE, icons: { brand: 'brock', rim: 'dark' } }).icons.rim).toBe('dark');
    expect(defineProduct({ ...BASE, icons: { brand: 'archipelia', rim: 'light' } }).icons.rim).toBe('light');
  });

  it('sets no rim on another brand or without a brand', () => {
    expect(defineProduct({ ...BASE, icons: { brand: 'archipelia' } }).icons).not.toHaveProperty('rim');
    expect(defineProduct(BASE).icons).toEqual({});
  });
});

describe('product.logos.app', () => {
  it('points a brand app at the 32 px icon the title bar draws', () => {
    expect(defineProduct({ ...BASE, icons: { brand: 'brock' } }).logos).toEqual({
      app: './logos/icon-32.png', instance: './logos/icon-bot.svg', mark: './logos/mark.svg',
    });
  });

  it('keeps the 256 px default without a brand and the logo an app names', () => {
    expect(defineProduct(BASE).logos.app).toBe('./logos/icon-256.png');
    expect(defineProduct({ ...BASE, icons: { brand: 'brock' }, logos: { app: './logos/own.png' } }).logos).toMatchObject({ app: './logos/own.png', instance: './logos/own.png' });
  });
});
