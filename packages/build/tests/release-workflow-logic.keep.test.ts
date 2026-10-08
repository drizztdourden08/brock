/* @layer tooling-scripts @kind test */
import { spawnSync } from 'node:child_process';
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { composeWorkflows } from '../src/release/compose-workflows.mjs';

type Step = { id?: string; name?: string; run?: string; uses?: string; with?: Record<string, unknown>; env?: Record<string, string> };
type Job = { needs?: string | string[]; outputs?: Record<string, string>; steps: Step[] };
type Workflow = { on: Record<string, { inputs?: Record<string, unknown> }>; jobs: Record<string, Job> };

const NOTE = '<!-- @layer docs @kind doc -->\n# Atlas v1.2.0\n\nThe map opens where you left it.\n\n## View\n\n- The map opens on the last place you looked at.\n';

const made: string[] = [];
afterEach(() => { made.splice(0).forEach((dir) => rmSync(dir, { recursive: true, force: true })); });

const tempDir = (files: Record<string, string>): string => {
  const dir = mkdtempSync(join(tmpdir(), 'brock-release-'));
  made.push(dir);
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), content);
  }
  return dir;
};

const release = (targets = ['desktop']): Workflow => parse(composeWorkflows({ targets, appDir: 'apps/desktop', prefix: 'atlas-' }).release) as Workflow;
const ci = (): Workflow => parse(composeWorkflows({ targets: ['desktop'], appDir: 'apps/desktop', prefix: 'atlas-' }).ci) as Workflow;
const jobOf = (workflow: Workflow, id: string): Job => {
  const job = workflow.jobs[id];
  if (!job) throw new Error(`no ${id} job`);
  return job;
};
const stepOf = (job: Job, name: string): Step => job.steps.find((step) => step.name === name) ?? { name: 'missing' };

const fill = (script: string, values: Record<string, string>): string => {
  const out = script.replace(/\$\{\{\s*([^}]+?)\s*\}\}/g, (whole, key: string) => values[key] ?? whole);
  if (out.includes('${{')) throw new Error(`unfilled expression in ${out.slice(out.indexOf('${{'), out.indexOf('${{') + 60)}`);
  return out;
};

const runBash = (cwd: string, script: string, env: Record<string, string> = {}) => {
  const result = spawnSync('bash', ['-e', '-c', script], { cwd, encoding: 'utf8', env: { ...process.env, ...env } });
  return { code: result.status, out: `${result.stdout}${result.stderr}` };
};

describe('the composed workflows parse and wire up', () => {
  it('declares every prepare output a later job reads', () => {
    const text = composeWorkflows({ targets: ['desktop', 'android', 'web'], appDir: '.', prefix: 'a-' }).release;
    const declared = Object.keys(jobOf(parse(text) as Workflow, 'prepare').outputs ?? {});
    const read = [...text.matchAll(/needs\.prepare\.outputs\.(\w+)/g)].map((m) => m[1]);
    expect(new Set(read)).toEqual(new Set(declared));
    expect(declared).toEqual(['tag', 'version', 'full']);
  });

  it('reads only the inputs it declares, and only step outputs of steps with that id', () => {
    const text = composeWorkflows({ targets: ['desktop'], appDir: '.', prefix: 'a-' }).release;
    const workflow = parse(text) as Workflow;
    const inputs = Object.keys(workflow.on.workflow_dispatch?.inputs ?? {});
    expect(new Set([...text.matchAll(/inputs\.(\w+)/g)].map((m) => m[1]))).toEqual(new Set(inputs));
    for (const job of Object.values(workflow.jobs)) {
      const ids = new Set(job.steps.map((step) => step.id).filter(Boolean));
      const used = [...JSON.stringify(job).matchAll(/steps\.(\w+)\.outputs/g)].map((m) => m[1]);
      for (const id of used) expect(ids).toContain(id);
    }
  });

  it('checks the release note before it tags, and in CI', () => {
    const prepare = jobOf(release(), 'prepare');
    const names = prepare.steps.map((step) => step.name);
    expect(names.indexOf('Release note')).toBeLessThan(names.indexOf('Commit the version and tag it'));
    expect(stepOf(prepare, 'Release note').run).toBe('pnpm --dir "$APP_DIR" exec brock release-notes check "${{ steps.resolve.outputs.version }}"');
    expect(stepOf(jobOf(ci(), 'quality'), 'Release note').run).toBe('pnpm --dir "$APP_DIR" exec brock release-notes check');
  });

  it('installs with PACKAGES_TOKEN when the repo sets it, else the workflow token', () => {
    const text = composeWorkflows({ targets: ['desktop'], appDir: '.', prefix: 'a-' });
    for (const yaml of [text.ci, text.release]) {
      expect(yaml).not.toMatch(/NODE_AUTH_TOKEN: \$\{\{ secrets\.GITHUB_TOKEN \}\}/);
      expect(yaml).toContain('NODE_AUTH_TOKEN: ${{ secrets.PACKAGES_TOKEN || secrets.GITHUB_TOKEN }}');
    }
  });

  it('packages full when prepare says so, and never marks a pre-release latest', () => {
    const workflow = release();
    const pack = stepOf(jobOf(workflow, 'build-windows'), 'Package').run ?? '';
    expect(pack).toContain('"${{ needs.prepare.outputs.full }}" = "true"');
    const publish = jobOf(workflow, 'release').steps.find((step) => step.uses?.startsWith('softprops/')) ?? {};
    expect(publish.with).toMatchObject({
      draft: '${{ inputs.set_latest != true && inputs.prerelease != true }}',
      prerelease: '${{ inputs.prerelease == true }}',
      make_latest: '${{ inputs.set_latest == true && inputs.prerelease != true }}',
      name: '${{ steps.body.outputs.title }}',
      files: 'artifacts/release-*/*',
    });
  });
});

const FAKE_BIN = 'fake-bin';

const fakeTools = (dir: string, { latest }: { latest: boolean }): string => {
  const bin = join(dir, FAKE_BIN);
  mkdirSync(bin);
  writeFileSync(join(bin, 'gh'), `#!/usr/bin/env bash\n${latest ? 'exit 0' : 'echo "Not Found" >&2; exit 1'}\n`);
  writeFileSync(join(bin, 'git'), '#!/usr/bin/env bash\nexit 2\n');
  chmodSync(join(bin, 'gh'), 0o755);
  chmodSync(join(bin, 'git'), 0o755);
  return bin;
};

const TOOLS = { name: 'tools', tagPrefix: 'tools-v', notesDir: 'apps/tools/release-notes' };

type RunOptions = { latest?: boolean; notes?: boolean; app?: typeof TOOLS | null };

const workflowFor = (app: typeof TOOLS | null): Workflow =>
  (app ? parse(composeWorkflows({ targets: ['desktop'], appDir: 'apps/tools', prefix: 'tools-', app }).release) as Workflow : release());

const NO_INPUTS = { full: 'false', prerelease: 'false', set_latest: 'false' };

const resolveRun = (inputs: { full?: string; prerelease?: string; set_latest?: string }, { latest = true, notes = true, app = null }: RunOptions = {}) => {
  const dir = tempDir(notes ? { [`${app?.notesDir ?? 'release-notes'}/v1.2.0.md`]: NOTE } : {});
  const output = join(dir, 'github-output');
  writeFileSync(output, '');
  const given = { ...NO_INPUTS, ...inputs };
  const script = fill(stepOf(jobOf(workflowFor(app), 'prepare'), 'Check the inputs, the notes and the tag').run ?? '', {
    'inputs.version': '1.2.0',
    'inputs.full': given.full,
    'inputs.prerelease': given.prerelease,
    'inputs.set_latest': given.set_latest,
    'github.repository': 'acme/atlas',
  });
  fakeTools(dir, { latest });
  const result = runBash(dir, `export PATH="$PWD/${FAKE_BIN}:$PATH"\n${script}`, { GITHUB_OUTPUT: output });
  return { ...result, outputs: readFileSync(output, 'utf8') };
};

const OUT = 'tag=v1.2.0\nversion=1.2.0\n';

describe('prepare, run by bash', () => {
  it('forces a full release while no latest release exists, for a pre-release too', () => {
    expect(resolveRun({ prerelease: 'true' }, { latest: false }).outputs).toBe(`${OUT}full=true\n`);
    expect(resolveRun({ set_latest: 'true' }, { latest: false }).outputs).toBe(`${OUT}full=true\n`);
  });

  it('keeps the full input once a latest release exists', () => {
    expect(resolveRun({ set_latest: 'true' }).outputs).toBe(`${OUT}full=false\n`);
    expect(resolveRun({ full: 'true', prerelease: 'true' }).outputs).toBe(`${OUT}full=true\n`);
  });

  it('tags an app of a workspace with several apps with its prefix, and reads its notes from its folder', () => {
    expect(resolveRun({ prerelease: 'true' }, { app: TOOLS }).outputs).toBe('tag=tools-v1.2.0\nversion=1.2.0\nfull=false\n');
    const noNote = resolveRun({}, { app: TOOLS, notes: false });
    expect(noNote.out).toContain('apps/tools/release-notes/v1.2.0.md is missing');
  });

  it('refuses a pre-release marked latest, and a version without its note', () => {
    const both = resolveRun({ prerelease: 'true', set_latest: 'true' });
    expect(both.code).toBe(1);
    expect(both.out).toContain('prerelease and set_latest exclude each other');
    const noNote = resolveRun({}, { notes: false });
    expect(noNote.code).toBe(1);
    expect(noNote.out).toContain('release-notes/v1.2.0.md is missing');
  });
});

const ARTIFACTS = {
  'artifacts/release-windows/atlas-windows-setup.exe': 'stub',
  'artifacts/release-linux/atlas-linux.AppImage': 'app',
  'artifacts/release-linux/atlas_1.2.0_amd64.deb': 'deb',
  'artifacts/release-macos/atlas-macos.dmg': 'dmg',
};

const bodyRun = (prerelease: boolean, extra: Record<string, string> = {}) => {
  const dir = tempDir({ 'release-notes/v1.2.0.md': NOTE, ...ARTIFACTS, ...extra });
  const output = join(dir, 'github-output');
  writeFileSync(output, '');
  const script = fill(stepOf(jobOf(release(), 'release'), 'Write the release body').run ?? '', {
    'needs.prepare.outputs.tag': 'v1.2.0',
    'needs.prepare.outputs.version': '1.2.0',
    'github.repository': 'acme/atlas',
  });
  const result = runBash(dir, script, { GITHUB_OUTPUT: output, PRERELEASE: String(prerelease) });
  expect(result.code).toBe(0);
  return { body: readFileSync(join(dir, 'release-body.md'), 'utf8'), outputs: readFileSync(output, 'utf8') };
};

describe('the release body, run by bash', () => {
  const BASE = 'https://github.com/acme/atlas/releases/download/v1.2.0';
  const LATEST = 'https://github.com/acme/atlas/releases/latest/download';

  it('is the note without its comment lines, then the downloads, the stub through latest', () => {
    const { body, outputs } = bodyRun(false);
    expect(body.startsWith('# Atlas v1.2.0\n\nThe map opens where you left it.\n')).toBe(true);
    expect(body).not.toContain('<!--');
    expect(body).toContain(`## Downloads\n\n- [Windows installer (.exe), a small download that installs and updates itself](${LATEST}/atlas-windows-setup.exe)\n`);
    expect(body).toContain(`(${BASE}/atlas-macos.dmg)`);
    expect(body).toContain(`(${BASE}/atlas-linux.AppImage)`);
    expect(body).toContain(`(${BASE}/atlas_1.2.0_amd64.deb)`);
    expect(outputs).toBe('title=Atlas v1.2.0\n');
  });

  it('links the pre-release setup on a full pre-release, never the latest stub', () => {
    const { body } = bodyRun(true, { 'artifacts/release-windows/atlas-windows-payload.exe': 'payload' });
    expect(body).toContain(`- [Windows setup (.exe) of this pre-release, which updates itself](${BASE}/atlas-windows-payload.exe)\n`);
    expect(body).not.toContain(`${LATEST}/atlas-windows-setup.exe`);
  });

  it('says the stub installs the latest stable release on a routine pre-release', () => {
    const { body } = bodyRun(true);
    expect(body).toContain(`(${LATEST}/atlas-windows-setup.exe), which installs the latest stable release; turn on pre-releases in the app's updater to move to this one\n`);
  });
});
