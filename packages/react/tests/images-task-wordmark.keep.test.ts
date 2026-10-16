/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createPlatform, defineProduct } from '@drizztdourden08/brock-core';
import type { RendererBootContext } from '../src/boot/renderer-boot.type';
import { imagesTask } from '../src/boot/tasks/images-task';
import { createWebFactory } from '../src/platform/hosts/web-factory';

const BASE = { id: 'demo', name: 'Demo', appId: 'com.example.demo', author: { name: 'tester' } };

const decoded: string[] = [];

class FakeImage {
  src = '';

  decode(): Promise<void> {
    decoded.push(this.src);
    return Promise.resolve();
  }
}

const run = async (icons: Parameters<typeof defineProduct>[0]['icons']): Promise<string[]> => {
  decoded.length = 0;
  vi.stubGlobal('Image', FakeImage);
  const context: RendererBootContext = {
    product: defineProduct({ ...BASE, icons }), profile: null, platform: createPlatform(createWebFactory()), openExternal: vi.fn(), report: vi.fn(), signal: new AbortController().signal,
  };
  await imagesTask.run(context);
  return [...decoded];
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('the images boot task', () => {
  it('decodes both wordmark images once, so About and the failure splash draw them at once', async () => {
    expect(await run({ wordmark: { src: './logos/w.svg', dark: './logos/w-dark.svg' } })).toEqual(['./logos/icon-256.png', './logos/w.svg', './logos/w-dark.svg']);
    expect(await run({ wordmark: './logos/w.png' })).toEqual(['./logos/icon-256.png', './logos/w.png']);
  });

  it('decodes only the logo without a wordmark', async () => {
    expect(await run(undefined)).toEqual(['./logos/icon-256.png']);
  });
});
