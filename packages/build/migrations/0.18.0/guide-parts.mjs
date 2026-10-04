/* @layer tooling-scripts @kind logic */
import { patternTodos } from '../../src/upgrade/index.mjs';

const CONFIG = /(^|\/)tessera\.config\.json$/;
const SET_PARTS = 'Set guide.parts in tessera.config.json: ".brock/tessera-parts.ts" for one app (the .brock files are already type-checked and knip entries), or "apps/<app>/.brock/tessera-parts.ts" in each apps entry of a workspace. brock sync then runs tessera guide, which writes the part names into TesseraApps, so a new part is known without a hand list.';
const HAND_LIST = 'This file lists the part names of TesseraApps by hand. Once guide.parts is set and brock sync has run tessera guide, delete the hand-written parts union and the parts key of the tree module.';

const RULES = [{ pattern: /\binterface\s+TesseraApps\b/g, message: HAND_LIST }];

const hasParts = (entry) => typeof entry?.guide?.parts === 'string';

const configTodos = (source) => {
  let config;
  try {
    config = JSON.parse(source);
  } catch {
    return [];
  }
  const set = hasParts(config) || Object.values(config?.apps ?? {}).some(hasParts);
  return set ? [] : [{ line: null, message: SET_PARTS }];
};

const apply = ({ path, source }) => ({ source, todos: CONFIG.test(path) ? configTodos(source) : patternTodos(source, RULES) });

const migration = Object.freeze({
  id: 'guide-parts',
  summary: 'Tessera 0.16 writes the part names itself: guide.parts in tessera.config.json names the module tessera guide writes, and brock sync runs tessera guide when it is set. A config without guide.parts and a hand-written TesseraApps parts list become to-dos.',
  files: /(^|\/)(tessera\.config\.json|src\/.+\.ts)$/,
  apply,
});

export { migration };
