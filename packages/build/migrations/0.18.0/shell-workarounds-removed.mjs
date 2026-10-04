/* @layer tooling-scripts @kind logic */
import { patternTodos } from '../../src/upgrade/index.mjs';

const RULES = [
  {
    pattern: /\bBackTitle(Props)?\b/g,
    message: 'BackTitle is gone. A screen gets its Back from ScreenWindow onBack and backLabel, which ScreenLayer passes for you; a sub-page header takes back: { label, onSelect } on ScreenPage, SettingsPage or the ScreenWindow header, drawn as "Back to <label>" outside the heading.',
  },
  {
    pattern: /\btitleBarMenu\b/g,
    message: 'titleBarMenu is gone. A kind: \'menu\' item in src/title-bar is now a Tessera title bar dropdown (bar: \'dropdown\') that opens and closes itself, and folds into a sub-menu of the main menu as the bar narrows. Drop the titleBarMenu.open and titleBarMenu.close calls; pass items, or groups with labels.',
  },
  {
    pattern: /\bfocus:\s*'(cancel|confirm)'/g,
    near: /\bconfirmAction\b|\bdialogs\b|ConfirmDialogConfig/,
    message: 'confirmAction and dialogs.show no longer take focus: Tessera\'s Dialog starts a danger dialog on Cancel and any other on its confirm button. Remove focus.',
  },
  {
    pattern: /\bConfirmFocus\b/g,
    message: 'The ConfirmFocus type is gone with the focus option of confirmAction; a danger dialog starts on Cancel by itself.',
  },
];

const apply = ({ source }) => ({ source, todos: patternTodos(source, RULES) });

const migration = Object.freeze({
  id: 'shell-workarounds-removed',
  summary: 'Brock 0.18 draws its title bar dropdowns, Back buttons and confirm dialogs with Tessera 0.16 parts. App code that used BackTitle, titleBarMenu, the focus option of confirmAction or the ConfirmFocus type becomes a to-do.',
  files: /(^|\/)src\/.+\.tsx?$/,
  apply,
});

export { migration };
