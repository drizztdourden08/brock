/* @layer tooling-scripts @kind logic */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { DESIGN_DIR, SHARED_KINDS } from '../../tessera/tessera.constants.mjs';
import { BARREL_HEADER, DESIGN_DEV_TOOLS, DESIGN_LINT, DESIGN_TSCONFIG, EMPTY_MODULE } from './design.constants.mjs';
import { packageJson } from './package-json.mjs';

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;

const manifest = (name, root, apps) => ({
  name,
  version: '0.1.0',
  private: true,
  description: 'The shared design parts of the apps: primitives, composites and compounds built from Tessera.',
  type: 'module',
  ...(root.license ? { license: root.license } : {}),
  ...(root.engines ? { engines: root.engines } : {}),
  exports: { '.': './src/index.ts', './package.json': './package.json' },
  files: ['src'],
  sideEffects: ['**/*.css'],
  scripts: { lint: DESIGN_LINT },
  devDependencies: packageJson.specsFrom([...DESIGN_DEV_TOOLS], apps.map((app) => app.pkg)),
});

const writeIfMissing = (file, content, written) => {
  if (existsSync(file)) return;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content, 'utf8');
  written.push(file);
};

/**
 * @param {string} repoRoot
 * @param {string} name  such as @acme/design
 * @param {{ pkg: Record<string, any> }[]} apps  the apps whose tool versions the package takes
 * @returns {string[]} the files written, absolute
 */
const writeDesignPackage = (repoRoot, name, apps) => {
  const dir = join(repoRoot, DESIGN_DIR);
  const written = [];
  writeIfMissing(join(dir, 'package.json'), json(manifest(name, packageJson.read(join(repoRoot, 'package.json')), apps)), written);
  writeIfMissing(join(dir, 'tsconfig.json'), json(DESIGN_TSCONFIG), written);
  writeIfMissing(join(dir, 'src', 'index.ts'), `${BARREL_HEADER}\n${EMPTY_MODULE}\n`, written);
  for (const kind of SHARED_KINDS) mkdirSync(join(dir, 'src', kind), { recursive: true });
  return written;
};

export { writeDesignPackage };
