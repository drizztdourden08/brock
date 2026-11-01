/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const made = [];

const write = (root, files) => {
  for (const [file, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), typeof content === 'string' ? content : JSON.stringify(content, null, 2));
  }
  return root;
};

const tempDir = (name) => {
  const dir = mkdtempSync(join(tmpdir(), name));
  made.push(dir);
  return dir;
};

const STUB_BROCK = [
  "import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';",
  "import { dirname, join } from 'node:path';",
  'const args = process.argv.slice(2);',
  "appendFileSync(process.env.BROCK_STUB_LOG, `${JSON.stringify({ cwd: process.cwd(), args })}\\n`);",
  "const report = args.indexOf('--report');",
  'if (report !== -1) {',
  '  const file = join(process.cwd(), args[report + 1]);',
  '  mkdirSync(dirname(file), { recursive: true });',
  "  writeFileSync(file, JSON.stringify({ applied: [{ id: 'stub-step', version: '0.17.0', source: 'brock-build', summary: 'stub', touched: ['src/app.ts'] }], todos: [] }));",
  '}',
].join('\n');

const WORKSPACE_YAML = [
  'packages:',
  '  - apps/*',
  '  - packages/*',
  '',
  'catalog:',
  "  '@drizztdourden08/brock-core': ^0.16.0",
  '  "@drizztdourden08/brock-electron": "^0.16.0"',
  "  '@drizztdourden08/tessera': ^0.15.0",
  '  react: ^19.2.6',
  '',
].join('\n');

const monorepo = () => write(tempDir('thread-upgrade-monorepo-'), {
  'package.json': { name: 'fixture', private: true, brock: { version: '0.16.0' }, devDependencies: { '@drizztdourden08/brock-build': '^0.16.0', vitest: 'catalog:' } },
  'pnpm-workspace.yaml': WORKSPACE_YAML,
  'apps/desktop/brock.config.ts': 'export default {};\n',
  'apps/desktop/package.json': {
    name: '@fixture/desktop',
    main: 'dist/electron/main.js',
    dependencies: { '@drizztdourden08/brock-core': 'catalog:', '@drizztdourden08/brock-react': '^0.16.0', '@drizztdourden08/tessera': 'catalog:', '@fixture/model': 'workspace:*', react: 'catalog:' },
    devDependencies: { '@drizztdourden08/brock-build': '^0.16.0' },
    brock: { version: '0.16.0', tessera: '0.15.0' },
  },
  'apps/desktop/node_modules/@drizztdourden08/brock-build/bin/brock.mjs': STUB_BROCK,
  'packages/model/package.json': { name: '@fixture/model', dependencies: { '@drizztdourden08/brock-core': '^0.16.0' } },
  'packages/tools/package.json': { name: '@fixture/tools', dependencies: { zod: '^4.0.0' } },
});

const checkout = () => write(tempDir('thread-upgrade-checkout-'), {
  'packages/build/package.json': { name: '@drizztdourden08/brock-build', version: '0.17.0' },
  'packages/react/package.json': { name: '@drizztdourden08/brock-react', version: '0.17.0', peerDependencies: { '@drizztdourden08/tessera': '^0.16.0' } },
});

const readJson = (root, file) => JSON.parse(readFileSync(join(root, file), 'utf8'));

const cleanTemp = () => {
  delete process.env.BROCK_STUB_LOG;
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
};

export { checkout, cleanTemp, monorepo, readJson, write };
