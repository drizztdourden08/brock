/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { mcpEnabled } from '../src/mcp-enabled';
import type { McpEnabledInput } from '../src/mcp.type';

const input = (patch: Partial<McpEnabledInput>): McpEnabledInput => ({ isPackaged: false, options: undefined, ...patch });

describe('K1 when mcp is on', { tags: ['critical'] }, () => {
  it('is on in an unpackaged build and off with dev false', () => {
    expect(mcpEnabled(input({}))).toBe(true);
    expect(mcpEnabled(input({ options: { dev: true } }))).toBe(true);
    expect(mcpEnabled(input({ options: { dev: false } }))).toBe(false);
  });

  it('is on in a packaged build only with packaged true', () => {
    expect(mcpEnabled(input({ isPackaged: true }))).toBe(false);
    expect(mcpEnabled(input({ isPackaged: true, options: { dev: true } }))).toBe(false);
    expect(mcpEnabled(input({ isPackaged: true, options: { packaged: true } }))).toBe(true);
  });
});
