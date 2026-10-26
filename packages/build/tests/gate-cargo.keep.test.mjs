/* @layer tooling-scripts @kind test */
import { chmodSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { tempTree } from './temp-tree.mjs';
import { CLIPPY_DEFAULT_DIR } from '../src/gate/cargo.constants.mjs';
import { gateSteps } from '../src/gate/gate-steps.mjs';
import { runGate } from '../src/gate/run-gate.mjs';
import { runRustComments } from '../src/gate/run-rust-comments.mjs';
import { rustCommentProblems } from '../src/gate/rust-comment-problems.mjs';
import { workspaceGate } from '../src/gate/workspace-gate.mjs';

const { tempDir, put, cleanup } = tempTree('brock-cargo-');

afterEach(cleanup);

const FAKE = `import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const failOn = existsSync(join(here, 'fail')) ? readFileSync(join(here, 'fail'), 'utf8').trim() : '';
const words = process.argv.slice(2);
appendFileSync(join(here, 'calls.jsonl'), JSON.stringify({ words, conf: process.env.CLIPPY_CONF_DIR ?? null, cwd: process.cwd() }) + '\\n');
process.exitCode = failOn && words[0] === failOn ? 3 : 0;
`;

const repo = ({ cargo = '[workspace]\nmembers = ["crates/*"]\n', fail = '' } = {}) => {
  const root = tempDir();
  put(root, 'package.json', JSON.stringify({ scripts: {} }));
  if (cargo) put(root, 'Cargo.toml', cargo);
  put(root, 'fake/cargo.mjs', FAKE);
  if (fail) put(root, 'fake/fail', fail);
  return { root, env: { BROCK_CARGO: join(root, 'fake', 'cargo.mjs') } };
};

const calls = (root) => {
  const file = join(root, 'fake', 'calls.jsonl');
  return existsSync(file) ? readFileSync(file, 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line)) : [];
};

const gate = (root, env, config = {}) => {
  const lines = [];
  return runGate({ appDir: root, label: '.', config, env, log: (line) => lines.push(line) }).then((failed) => ({ failed, lines }));
};

describe('the cargo lane', () => {
  it('runs the comment check, fmt, clippy and test while a Cargo.toml is at the root', async () => {
    const { root, env } = repo();
    const { failed, lines } = await gate(root, env);
    expect(failed).toEqual([]);
    expect(calls(root).map((call) => call.words)).toEqual([
      ['fmt', '--all', '--', '--check'],
      ['clippy', '--workspace', '--all-targets', '--', '-D', 'warnings', '-W', 'clippy::too_many_lines', '-W', 'clippy::cognitive_complexity'],
      ['test', '--workspace'],
    ]);
    expect(lines.filter((line) => line.startsWith('brock gate:'))).toEqual([
      'brock gate: .: rust comment check',
      'brock gate: .: cargo fmt --all -- --check',
      'brock gate: .: cargo clippy --workspace --all-targets -- -D warnings -W clippy::too_many_lines -W clippy::cognitive_complexity',
      'brock gate: .: cargo test --workspace',
    ]);
  });

  it('takes a [package] manifest too, and stays off without a Cargo.toml or a table', async () => {
    const single = repo({ cargo: '[package]\nname = "a"\n' });
    expect((await gate(single.root, single.env)).failed).toEqual([]);
    expect(calls(single.root)).toHaveLength(3);
    for (const cargo of ['', '[dependencies]\nx = "1"\n']) {
      const { root, env } = repo({ cargo });
      expect(gateSteps(root, {}, { env })).toEqual([]);
      expect(calls(root)).toEqual([]);
    }
  });

  it('fails the gate when a step exits non-zero, and still runs every step', async () => {
    const { root, env } = repo({ fail: 'clippy' });
    const { failed } = await gate(root, env);
    expect(failed).toEqual(['cargo clippy --workspace --all-targets -- -D warnings -W clippy::too_many_lines -W clippy::cognitive_complexity']);
    expect(calls(root).map((call) => call.words[0])).toEqual(['fmt', 'clippy', 'test']);
  });

  it('fails with a message when cargo is missing, and does not skip', async () => {
    const { root } = repo();
    const { failed, lines } = await gate(root, { PATH: join(root, 'empty') });
    expect(failed).toEqual(['cargo (not on PATH)']);
    expect(lines.join('\n')).toMatch(/cargo is not on PATH.*rustup.*gate\.cargo\.enabled: false/);
  });

  it.skipIf(process.platform === 'win32')('finds cargo on PATH', async () => {
    const { root } = repo();
    put(root, 'bin/cargo', `#!/bin/sh\nexec ${JSON.stringify(process.execPath)} ${JSON.stringify(join(root, 'fake', 'cargo.mjs'))} "$@"\n`);
    chmodSync(join(root, 'bin', 'cargo'), 0o755);
    const { failed } = await gate(root, { PATH: join(root, 'bin') });
    expect(failed).toEqual([]);
    expect(calls(root)).toHaveLength(3);
  });

});

describe('the cargo lane config', () => {
  it('is off with gate.cargo.enabled false', async () => {
    const { root, env } = repo();
    const { failed } = await gate(root, env, { gate: { cargo: { enabled: false } } });
    expect(failed).toEqual([]);
    expect(calls(root)).toEqual([]);
  });

  it('adds clippyArgs after the lint flags and runs in gate.cargo.path', async () => {
    const { root, env } = repo({ cargo: '' });
    put(root, 'rust/Cargo.toml', '[workspace]\n');
    const { failed } = await gate(root, env, { gate: { cargo: { path: 'rust', clippyArgs: ['-A', 'clippy::needless_return'] } } });
    expect(failed).toEqual([]);
    const [, clippy] = calls(root);
    expect(clippy.words.slice(-2)).toEqual(['-A', 'clippy::needless_return']);
    expect(clippy.cwd.replace(/\\/g, '/')).toMatch(/\/rust$/);
    expect(() => gateSteps(root, { gate: { cargo: { path: 'nope' } } }, { env })).toThrow(/gate\.cargo\.path: no Cargo\.toml/);
  });

  it('runs the lane once for apps that share a repo root', () => {
    const { root, env } = repo();
    const cargoRoots = new Set();
    expect(gateSteps(root, {}, { env, cargoRoots })).toHaveLength(4);
    expect(gateSteps(root, {}, { env, cargoRoots })).toEqual([]);
  });
});

describe('the clippy default', () => {
  it('ships the thresholds of the TypeScript rules', () => {
    expect(readFileSync(join(CLIPPY_DEFAULT_DIR, 'clippy.toml'), 'utf8')).toBe('too-many-lines-threshold = 60\ncognitive-complexity-threshold = 10\n');
  });

  it('points clippy at it when the repo has no clippy.toml, and leaves a repo file alone', async () => {
    const bare = repo();
    const [, , clippy] = gateSteps(bare.root, {}, { env: bare.env });
    expect(clippy.env).toEqual({ CLIPPY_CONF_DIR: CLIPPY_DEFAULT_DIR });
    await gate(bare.root, bare.env);
    expect(calls(bare.root)[1].conf).toBe(CLIPPY_DEFAULT_DIR);
    for (const file of ['clippy.toml', '.clippy.toml']) {
      const own = repo();
      put(own.root, file, 'too-many-lines-threshold = 80\n');
      const [, , ownClippy] = gateSteps(own.root, {}, { env: own.env });
      expect(ownClippy.env).toEqual({});
      await gate(own.root, own.env);
      expect(calls(own.root)[1].conf).toBeNull();
    }
  });
});

describe('the Rust comment check', () => {
  const lines = (text) => rustCommentProblems(text).map((problem) => problem.line);

  it('allows doc comments and refuses line and block comments, with their lines', () => {
    const text = '//! module\n/// item\nfn a() {}\n// plain\nfn b() {} // trailing\n/* block */\n/** doc block */\n//// four slashes\n';
    expect(lines(text)).toEqual([4, 5, 6, 7, 8]);
  });

  it('counts nested block comments as one', () => {
    expect(rustCommentProblems('/* a /* b */ c */\nfn x() {}\n')).toHaveLength(1);
    expect(lines('/* a\n  b */\n// c\n')).toEqual([1, 3]);
  });

  it('does not read comment markers inside strings, raw strings or chars', () => {
    const text = 'let a = "http://x /* y */";\nlet b = r#"// not "a" comment"#;\nlet c = \'/\';\nlet d: &\'static str = "\\"//";\nlet e = b"//";\n';
    expect(rustCommentProblems(text)).toEqual([]);
  });

  it('allows a SAFETY comment only directly above unsafe', () => {
    const ok = '// SAFETY: the pointer is valid\n//  for the whole call\nunsafe { read(p) }\n';
    expect(rustCommentProblems(ok)).toEqual([]);
    expect(lines('// SAFETY: nothing here\nlet x = 1;\n')).toEqual([1]);
    expect(lines('// SAFETY: gap\n\nunsafe { f() }\n')).toEqual([1]);
    expect(lines('// note\n// SAFETY: not first\nunsafe { f() }\n')).toEqual([1, 2]);
    expect(lines('let v = 1; // SAFETY: trailing\nunsafe { f() }\n')).toEqual([1]);
  });

  it('walks every .rs file outside target and reports file:line', () => {
    const root = tempDir();
    put(root, 'crates/a/src/lib.rs', '/// ok\nfn a() {}\n// bad\n');
    put(root, 'crates/a/src/mod/b.rs', 'fn b() {}\n');
    put(root, 'target/debug/gen.rs', '// generated\n');
    const out = [];
    expect(runRustComments({ dir: root, log: (line) => out.push(line) })).toBe(1);
    expect(out[0]).toMatch(/^ {2}crates\/a\/src\/lib\.rs:3: comment: only \/\/\/ and \/\/! doc comments are allowed/);
    expect(out.at(-1)).toBe('rust comments: 1 problem(s) in 2 file(s)');
    put(root, 'crates/a/src/lib.rs', '/// ok\nfn a() {}\n');
    expect(runRustComments({ dir: root, log: () => {} })).toBe(0);
  });

  it('fails the gate on a comment even though every cargo step passes', async () => {
    const { root, env } = repo();
    put(root, 'crates/a/src/lib.rs', 'fn a() {} // no\n');
    const { failed, lines: out } = await gate(root, env);
    expect(failed).toEqual(['rust comment check']);
    expect(out.join('\n')).toContain('crates/a/src/lib.rs:1:');
  });
});

describe('a repo with no Brock app', () => {
  it('takes the gate of brock.workspace.mjs, else an empty gate for a Cargo.toml, else none', async () => {
    const declared = tempDir();
    put(declared, 'brock.workspace.mjs', "export default { name: 'argus', gate: { scripts: ['lint'], cargo: { enabled: false } } };\n");
    expect(await workspaceGate(declared)).toEqual({ gate: { scripts: ['lint'], cargo: { enabled: false } } });
    const rust = repo();
    expect(await workspaceGate(rust.root)).toEqual({ gate: {} });
    expect(await workspaceGate(tempDir())).toBeNull();
  });
});
