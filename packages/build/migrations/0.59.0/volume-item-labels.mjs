/* @layer tooling-scripts @kind logic */
import { patternTodos } from '../../src/upgrade/index.mjs';

const VOLUME_ITEM = /\bkind\s*:\s*['"]volume['"]|\bTitleBarVolumeSpec\b/;

const DRAWN_BY_TESSERA = 'Tessera draws the Mute and Unmute labels of a volume item from its own strings, common.mute and common.unmute.';

const RULES = Object.freeze([
  {
    pattern: /\blabels\s*:/g,
    near: VOLUME_ITEM,
    message: `A volume title bar item no longer takes labels: remove it if it sits on a volume item. ${DRAWN_BY_TESSERA}`,
  },
  {
    pattern: /\bTitleBarVolumeStrings\b/g,
    message: `brock-react no longer exports TitleBarVolumeStrings. ${DRAWN_BY_TESSERA}`,
  },
]);

const apply = ({ source }) => ({ source, todos: patternTodos(source, RULES) });

const migration = Object.freeze({
  id: 'volume-item-labels',
  summary: 'A volume title bar item is drawn by Tessera\'s volume bar item, which names its own Mute and Unmute rows; labels on a volume item and the TitleBarVolumeStrings type are gone, and each use becomes a to-do.',
  files: /\.[jt]sx?$/,
  apply,
});

export { migration };
