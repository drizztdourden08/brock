/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { loadTypescript } from '../src/upgrade/tessera/load-typescript.mjs';
import { scriptRenames } from '../src/upgrade/tessera/script-renames.mjs';
import { tesseraRenamesStep } from '../src/upgrade/tessera/tessera-renames-step.mjs';

const ts = loadTypescript(process.cwd());

const RELEASE = {
  version: '0.21.0',
  components: {
    ManagedList: 'ItemList',
    MasterDetail: 'ListDetail',
    JsonInput: 'CodeBlock with editable, value and onChange (see MIGRATION.md section 187)',
  },
  moves: { ItemList: { from: 'primitives', to: 'composites' } },
};

const USAGE = [
  "import type { ComponentUsage } from '@drizztdourden08/tessera';",
  '',
  'const usage = {',
  "  job: 'Every preset beside its editor, as a ManagedList would show it.',",
  "  useWhen: ['The Presets page.'],",
  '  avoidWhen: [',
  "    { case: 'Rows without an editor.', use: 'ManagedList' },",
  "    { case: 'A list beside a detail.', use: \"MasterDetail\" },",
  "    { case: 'Raw settings text.', use: 'JsonInput' },",
  "    { case: 'A saved server.', use: 'ServerManager' },",
  '  ],',
  "  rules: ['Name the ManagedList after its rows.'],",
  "  a11y: ['use: ManagedList stays in a sentence.'],",
  "  tree: { path: ['data', 'a list of items'], rule: 'MasterDetail' },",
  "  example: `import { ManagedList } from '@drizztdourden08/tessera/primitives';",
  '',
  'const Sample = () => <ManagedList items={[]} />;',
  '`,',
  "  propsHash: 'abc',",
  '} satisfies ComponentUsage;',
  '',
  'export { usage };',
  '',
].join('\n');

const renamed = (path, source = USAGE) => scriptRenames(ts, { path, source }, RELEASE);

describe('the Tessera renames replay over usage files', () => {
  it('renames the part each avoidWhen entry names, and only that key', () => {
    const { source } = renamed('src/views/PresetsHub/PresetsHub.usage.ts');
    expect(source).toContain("{ case: 'Rows without an editor.', use: 'ItemList' }");
    expect(source).toContain('{ case: \'A list beside a detail.\', use: "ListDetail" }');
    expect(source).toContain("use: 'ServerManager'");
    expect(source).toContain("job: 'Every preset beside its editor, as a ManagedList would show it.'");
    expect(source).toContain("rules: ['Name the ManagedList after its rows.']");
    expect(source).toContain("a11y: ['use: ManagedList stays in a sentence.']");
    expect(source).toContain("rule: 'MasterDetail'");
  });

  it('renames and moves the Tessera import of the example code, and its use in the code', () => {
    const { source } = renamed('src/views/PresetsHub/PresetsHub.usage.ts');
    expect(source).toContain("example: `import { ItemList } from '@drizztdourden08/tessera/composites';\n\nconst Sample = () => <ItemList items={[]} />;\n`,");
  });

  it('turns a note in place of the name into a to-do on the line of the entry, and leaves the name', () => {
    const { source, todos } = renamed('src/views/PresetsHub/PresetsHub.usage.ts');
    expect(source).toContain("use: 'JsonInput'");
    expect(todos).toEqual([{ line: 9, message: 'Tessera 0.21.0: the component JsonInput is now "CodeBlock with editable, value and onChange (see MIGRATION.md section 187)". Change it by hand.' }]);
  });

  it('leaves a use key outside a usage file, and an object with no avoidWhen list, alone', () => {
    const other = "const steps = [{ use: 'ManagedList' }];\nconst usage = { avoidWhen: 'ManagedList', use: 'ManagedList', example: 'ManagedList' };\n";
    expect(renamed('src/views/Steps/steps.ts', other).source).toBe(other);
    expect(renamed('src/views/Steps/Steps.usage.ts', other).source).toBe(other);
  });

  it('keeps the escapes of an example that holds a template of its own', () => {
    const inner = `\\\`\\$${'{n}'}\\\``;
    const source = [
      'const usage = {',
      "  avoidWhen: [{ case: 'x', use: 'ManagedList' }],",
      "  example: `import { ManagedList } from '@drizztdourden08/tessera';",
      `const Sample = ({ n }: { n: number }) => <ManagedList title={${inner}} />;`,
      '`,',
      '};',
      '',
    ].join('\n');
    const out = renamed('src/A.usage.ts', source).source;
    expect(out).toContain("use: 'ItemList'");
    expect(out).toContain("import { ItemList } from '@drizztdourden08/tessera';");
    expect(out).toContain(`<ItemList title={${inner}} />`);
  });

  it('changes nothing on a second replay', () => {
    const once = renamed('src/views/PresetsHub/PresetsHub.usage.ts').source;
    expect(renamed('src/views/PresetsHub/PresetsHub.usage.ts', once).source).toBe(once);
  });
});

const made = [];

const put = (root, file, text) => {
  mkdirSync(dirname(join(root, file)), { recursive: true });
  writeFileSync(join(root, file), typeof text === 'string' ? text : `${JSON.stringify(text, null, 2)}\n`);
};

afterEach(() => {
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('brock migrate --tessera-from over a design package usage file', () => {
  it('renames the avoidWhen part of a compound in the design package and of a view in the app', () => {
    const root = mkdtempSync(join(tmpdir(), 'brock-tessera-usage-'));
    made.push(root);
    const tessera = 'apps/desktop/node_modules/@drizztdourden08/tessera/';
    put(root, 'pnpm-workspace.yaml', 'packages:\n  - apps/*\n  - packages/*\n');
    put(root, 'apps/desktop/brock.config.ts', 'export default {};\n');
    put(root, 'apps/desktop/package.json', { name: 'desktop', dependencies: { '@drizztdourden08/tessera': '^0.21.0' } });
    put(root, `${tessera}package.json`, { name: '@drizztdourden08/tessera', version: '0.21.0' });
    put(root, `${tessera}RENAMES.json`, { releases: [RELEASE] });
    put(root, 'apps/desktop/src/views/PresetsHub/PresetsHub.usage.ts', USAGE);
    put(root, 'packages/design/package.json', { name: '@acme/design', dependencies: { '@drizztdourden08/tessera': '^0.21.0' } });
    put(root, 'packages/design/src/compounds/SessionRow/SessionRow.usage.ts', "const usage = { avoidWhen: [{ case: 'Every preset.', use: 'ManagedList' }] };\nexport { usage };\n");
    const run = tesseraRenamesStep({ rootDir: join(root, 'apps/desktop'), from: '0.20.0' });
    expect(run.applied[0].touched).toEqual(['src/views/PresetsHub/PresetsHub.usage.ts', '../../packages/design/src/compounds/SessionRow/SessionRow.usage.ts']);
    expect(readFileSync(join(root, 'packages/design/src/compounds/SessionRow/SessionRow.usage.ts'), 'utf8')).toContain("use: 'ItemList'");
    expect(readFileSync(join(root, 'apps/desktop/src/views/PresetsHub/PresetsHub.usage.ts'), 'utf8')).toContain("use: 'ItemList'");
  });
});
