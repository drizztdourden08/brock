/* @layer renderer-shell @kind logic */
import { SELECTORS } from '../review.constants';
import type { SettingRowsSnapshot } from '../review.type';

const settingRows = (): SettingRowsSnapshot => {
  const scope = document.querySelector<HTMLElement>(SELECTORS.layer) ?? document.body;
  const rows = [...scope.querySelectorAll<HTMLElement>('[data-setting-key]')];
  const empty = rows.filter((row) => row.childElementCount === 0).map((row) => row.dataset.settingKey ?? '?');
  return { total: rows.length, empty };
};

export { settingRows };
