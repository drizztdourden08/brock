/* @layer tooling-scripts @kind logic */
import { existsSync, writeFileSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import { appDirs } from '../../commands/app-dirs.mjs';
import { findWorkspaceRoot } from '../../workspace.mjs';
import { designPackageOf } from '../../tessera/design-package-of.mjs';
import { tesseraConfigFor } from '../../tessera/tessera-config-for.mjs';
import { DESIGN_DIR, TESSERA_CONFIG_FILE } from '../../tessera/tessera.constants.mjs';
import { knipWorkspace } from './knip-workspace.mjs';
import { moveCompounds } from './move-compounds.mjs';
import { packageJson } from './package-json.mjs';
import { planCompounds } from './plan-compounds.mjs';
import { repoScope } from './repo-scope.mjs';
import { strayComponents } from './stray-components.mjs';
import { writeDesignPackage } from './write-design-package.mjs';

const repoRootOf = (rootDir) => (existsSync(join(rootDir, 'pnpm-workspace.yaml')) ? rootDir : findWorkspaceRoot(rootDir) ?? rootDir);

const appsOf = (repoRoot) => appDirs(repoRoot)
  .filter((app) => app !== '.')
  .map((app) => ({ label: app, dir: join(repoRoot, app), src: join(repoRoot, app, 'src'), pkg: packageJson.read(join(repoRoot, app, 'package.json')) }));

const writeConfig = (repoRoot, designName) => {
  const file = join(repoRoot, TESSERA_CONFIG_FILE);
  if (existsSync(file)) return [];
  writeFileSync(file, `${JSON.stringify(tesseraConfigFor(repoRoot, designName), null, 2)}\n`, 'utf8');
  return [file];
};

const stayTodo = (designName) => ({ compound, blockers }) => ({
  file: compound.dir,
  message: `${compound.name} stays in ${compound.app.label}/src/compounds: ${blockers.join('; ')}. Clear that and run brock migrate again, or move it to packages/design/src/compounds by hand and import it from ${designName}.`,
});

const strayTodo = (path) => ({
  file: path,
  message: `${basename(path, '.tsx')} sits outside the parts folders of tessera.config.json. Move it to packages/design/src/compounds when more than one view uses it, or under the view that owns it in src/views.`,
});

const designTodos = ({ repoRoot, designName, apps, plan, installs }) => [
  ...plan.staying.map(stayTodo(designName)),
  ...strayComponents(apps).map(strayTodo),
  ...(installs ? [{ file: join(repoRoot, 'package.json'), message: `run pnpm install at the repo root so ${designName} links into the packages that import it.` }] : []),
];

/**
 * @param {{ rootDir: string }} ctx  the app folder brock migrate runs in
 * @returns {{ touched: string[], moved: { from: string, to: string }[], todos: { file: string, line?: number | null, message: string }[] }} relative to rootDir
 */
const designPackageStep = ({ rootDir }) => {
  const repoRoot = repoRootOf(rootDir);
  const rel = (path) => relative(rootDir, path).replace(/\\/g, '/') || '.';
  const apps = appsOf(repoRoot);
  if (apps.length === 0) return { touched: writeConfig(repoRoot).map(rel), todos: [] };
  const scope = repoScope(repoRoot);
  const designName = designPackageOf(repoRoot, scope) ?? `${scope}/design`;
  const designDir = join(repoRoot, DESIGN_DIR);
  const created = writeDesignPackage(repoRoot, designName, apps);
  const config = [...writeConfig(repoRoot, designName), ...knipWorkspace(repoRoot)];
  const plan = planCompounds({ repoRoot, designDir, apps });
  const { touched, moved } = moveCompounds({ designDir, designName, moves: plan.moves });
  const installs = created.length > 0 || touched.some((path) => basename(path) === 'package.json');
  return {
    touched: [...created, ...config, ...touched].map(rel),
    moved: moved.map(({ from, to }) => ({ from: rel(from), to: rel(to) })),
    todos: designTodos({ repoRoot, designName, apps, plan, installs }).map((todo) => ({ ...todo, file: rel(todo.file) })),
  };
};

export { designPackageStep };
