/* @layer tooling-scripts @kind test */
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { titleFont } from '../src/installer/title-font.mjs';

const roots = [];

afterEach(() => {
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
  vi.restoreAllMocks();
});

describe('K1 titleFont', { tags: ['critical'] }, () => {
  it('falls back to Segoe UI, saying so once, when the font cannot be read', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const root = mkdtempSync(join(tmpdir(), 'brock-title-font-'));
    roots.push(root);
    expect(titleFont(root)).toBeNull();
    expect(titleFont(root)).toBeNull();
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0][0]).toMatch(/Segoe UI/);
  });
});
