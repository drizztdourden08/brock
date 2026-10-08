/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { copyFixtures } from '../src/review/app/copy-fixtures';

const NOTE = 'Review notes: a fixture file.\n';

describe('copyFixtures in a production build', () => {
  it('decodes a fixture Vite inlined as a data URL, which the renderer CSP would refuse to fetch', async () => {
    const written: Record<string, string> = {};
    const checks: { id: string; pass: boolean }[] = [];
    const tour = {
      platform: { files: { writeBytes: (path: string, bytes: Uint8Array) => { written[path] = new TextDecoder().decode(bytes); return Promise.resolve(); } } },
      check: (id: string, pass: boolean) => { checks.push({ id, pass }); },
    };
    const url = `data:text/plain;base64,${btoa(NOTE)}`;
    await copyFixtures(tour, [{ path: 'notes/review.txt', load: () => Promise.resolve({ default: url }) }]);
    expect(written).toEqual({ 'notes/review.txt': NOTE });
    expect(checks).toEqual([{ id: 'fixtures-copied', pass: true }]);
  });
});
