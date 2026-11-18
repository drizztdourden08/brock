/* @layer electron-main @kind constants */
const EDIT_KEYS = {
  undo: 'brock-main:edit.undo',
  redo: 'brock-main:edit.redo',
  cut: 'brock-main:edit.cut',
  copy: 'brock-main:edit.copy',
  paste: 'brock-main:edit.paste',
  selectAll: 'brock-main:edit.selectAll',
} as const;

const EDIT_MENU_KEY = 'brock-main:edit.menu';

export { EDIT_KEYS, EDIT_MENU_KEY };
