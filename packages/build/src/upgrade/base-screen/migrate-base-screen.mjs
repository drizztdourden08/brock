/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { findJsxProps } from '../codemods/find-jsx-props.mjs';
import { removeSpans } from '../codemods/remove-spans.mjs';
import { CONVENTION, SCREENS_FOLDER } from './base-screen.constants.mjs';
import { baseFileSource } from './base-file-source.mjs';
import { componentSpecifier } from './component-specifier.mjs';
import { dropUnusedImports } from './drop-unused-imports.mjs';
import { locateBaseScreen } from './locate-base-screen.mjs';
import { resolveString } from './resolve-string.mjs';
import { withoutListItem } from './without-list-item.mjs';

const NOTHING = Object.freeze({ touched: [], todos: [] });

const valueOf = (attribute) => attribute.replace(/^[^=]*=\s*/, '').replace(/^\{([\s\S]*)\}$/, '$1').trim();

const mainWithout = (main, emptied) => {
  const props = findJsxProps(main, 'BrockApp', emptied ? ['home', 'screens'] : ['home']);
  return dropUnusedImports(removeSpans(main, props));
};

const blocker = (rootDir, appDir, id) => {
  const baseRel = `${appDir}${SCREENS_FOLDER}/${id}.base.tsx`;
  if (!existsSync(join(rootDir, appDir, SCREENS_FOLDER, 'screens.config.ts'))) return `${CONVENTION} This app has no ${SCREENS_FOLDER}/screens.config.ts yet, so its base screen "${id}" stays on screens and home until the app moves to screens by convention.`;
  if (existsSync(join(rootDir, baseRel))) return `${CONVENTION} ${baseRel} already exists: drop the screen "${id}" from screens and remove home from BrockApp.`;
  return null;
};

const moveScreen = (rootDir, mainRel, main, id) => {
  const appDir = mainRel.slice(0, -'src/main.tsx'.length);
  const baseRel = `${appDir}${SCREENS_FOLDER}/${id}.base.tsx`;
  const found = locateBaseScreen(rootDir, mainRel, main, id);
  const specifier = found && componentSpecifier(found.file, found.source, found.parts.component, `${appDir}${SCREENS_FOLDER}`);
  if (!found || specifier === null) return null;
  writeFileSync(join(rootDir, baseRel), baseFileSource({ id, ...found.parts }, specifier), 'utf8');
  const { source, emptied } = withoutListItem(found.source, found.call);
  if (found.file !== mainRel) writeFileSync(join(rootDir, found.file), dropUnusedImports(source), 'utf8');
  const next = mainWithout(found.file === mainRel ? source : main, emptied !== null);
  writeFileSync(join(rootDir, mainRel), next, 'utf8');
  return [...new Set([baseRel, found.file, mainRel])];
};

/**
 * @param {string} rootDir
 * @param {string} mainRel root-relative path of an app's src/main.tsx
 * @returns {{ touched: string[], todos: { file: string, line: number, message: string }[] }}
 */
const migrateBaseScreen = (rootDir, mainRel) => {
  const main = readFileSync(join(rootDir, mainRel), 'utf8');
  const [home] = findJsxProps(main, 'BrockApp', ['home']);
  if (home === undefined) return NOTHING;
  const todo = (message) => ({ touched: [], todos: [{ file: mainRel, line: home.line, message }] });
  const id = resolveString(rootDir, mainRel, main, valueOf(main.slice(home.start, home.end)));
  if (id === null) return todo(`${CONVENTION} brock migrate could not read the id that home names; move that screen to ${SCREENS_FOLDER}/<id>.base.tsx, then drop it from screens and remove home.`);
  const blocked = blocker(rootDir, mainRel.slice(0, -'src/main.tsx'.length), id);
  if (blocked !== null) return todo(blocked);
  const touched = moveScreen(rootDir, mainRel, main, id);
  if (touched === null) {
    return todo(`${CONVENTION} Move the screen "${id}" to ${SCREENS_FOLDER}/${id}.base.tsx: default-export its component, put its title and icon in meta, then drop its defineScreen from screens and remove home from BrockApp. brock migrate leaves it, since that screen uses more than a title, an icon and a component.`);
  }
  return { touched, todos: [] };
};

export { migrateBaseScreen };
