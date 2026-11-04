/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { mcpEnabled } from '../src/mcp-enabled';
import type { McpEnabledInput } from '../src/mcp.type';

const input = (patch: Partial<McpEnabledInput>): McpEnabledInput => ({ isPackaged: false, options: undefined, argv: [], env: {}, ...patch });

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

  it('turns off with --no-mcp or an off value of BROCK_MCP', () => {
    const options = { packaged: true };
    expect(mcpEnabled(input({ argv: ['--no-mcp'] }))).toBe(false);
    expect(mcpEnabled(input({ isPackaged: true, options, argv: ['--no-mcp'] }))).toBe(false);
    for (const value of ['off', '0', 'false', ' OFF ']) {
      expect(mcpEnabled(input({ env: { BROCK_MCP: value } }))).toBe(false);
    }
  });

  it('never lets the environment turn on a packaged build that did not opt in', () => {
    expect(mcpEnabled(input({ isPackaged: true, env: { BROCK_MCP: 'on' } }))).toBe(false);
    expect(mcpEnabled(input({ isPackaged: true, env: { BROCK_MCP: '1' } }))).toBe(false);
    expect(mcpEnabled(input({ env: { BROCK_MCP: 'on' } }))).toBe(true);
  });
});
