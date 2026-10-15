/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { serveAssetSteps } from '../src/web-worker/serve-asset-steps';

describe('serveAssetSteps for a Web Worker', () => {
  it('refuses to run outside a worker', () => {
    expect(() => serveAssetSteps({})).toThrow('inside a Web Worker');
    expect(() => serveAssetSteps({}, { postMessage: () => undefined, addEventListener: () => undefined, document: {} })).toThrow('inside a Web Worker');
  });
});
