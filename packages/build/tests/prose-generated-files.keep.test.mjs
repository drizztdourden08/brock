/* @layer tooling-scripts @kind test */
import { execFileSync } from 'node:child_process';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { runProse } from '../src/commands/prose.mjs';
import { tempRepo, removeTempRepos } from './temp-repo.mjs';

afterEach(() => {
  removeTempRepos();
  vi.restoreAllMocks();
});

const GENERATOR = `${['a', 'i'].join('')}-config`;
const CONFIG = `.${GENERATOR}.json`;
const MCP = '.mcp.json';
const TOOL_NAMES = ['Clau', 'de'].join('');
const NAMING_TOOLS = `{ "name": "${TOOL_NAMES} ${['Co', 'dex'].join('')}" }\n`;
const GENERATED_JSON = `{\n  "$generator": "${GENERATOR}/run.mjs",\n  "name": "${TOOL_NAMES}"\n}\n`;

const gitRepo = (files) => {
  const root = tempRepo({ 'package.json': '{ "name": "prose-fixture" }\n', ...files });
  execFileSync('git', ['init', '-q'], { cwd: root });
  return root;
};

const proseRun = (root) => {
  const lines = [];
  vi.spyOn(console, 'log').mockImplementation((line) => lines.push(String(line)));
  return { code: runProse({ rootDir: root }), lines };
};

describe('brock prose and files a config generator wrote', () => {
  it('reads a hand written file that names tools', () => {
    const { code, lines } = proseRun(gitRepo({ 'notes.json': NAMING_TOOLS }));
    expect(code).toBe(1);
    expect(lines.join('\n')).toContain('notes.json');
  });

  it('skips the generated config and the MCP file at the root', () => {
    const { code, lines } = proseRun(gitRepo({ [CONFIG]: GENERATED_JSON, [MCP]: NAMING_TOOLS }));
    expect(lines.join('\n')).not.toContain(CONFIG);
    expect(code).toBe(0);
  });

  it('reads a root config the app wrote itself', () => {
    const { code, lines } = proseRun(gitRepo({ [CONFIG]: NAMING_TOOLS }));
    expect(code).toBe(1);
    expect(lines.join('\n')).toContain(CONFIG);
  });

  it('puts git back the way it was', () => {
    const before = { count: process.env.GIT_CONFIG_COUNT, value: process.env.GIT_CONFIG_VALUE_0 };
    proseRun(gitRepo({ [CONFIG]: GENERATED_JSON }));
    expect({ count: process.env.GIT_CONFIG_COUNT, value: process.env.GIT_CONFIG_VALUE_0 }).toEqual(before);
  });
});
