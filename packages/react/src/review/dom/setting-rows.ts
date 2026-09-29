/* @layer renderer-shell @kind logic */
import type { SettingRowsSnapshot } from '../review.type';

const settingRows = (): SettingRowsSnapshot => {
  const rows = [...document.querySelectorAll<HTMLElement>('[data-setting-key]')];
  const empty = rows.filter((row) => row.childElementCount === 0).map((row) => row.dataset.settingKey ?? '?');
  return { total: rows.length, empty };
};

export { settingRows };
