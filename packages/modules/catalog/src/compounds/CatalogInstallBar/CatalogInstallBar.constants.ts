/* @layer renderer-shell @kind constants */
import type { CatalogInstallBarText } from './CatalogInstallBar.type';

const CATALOG_INSTALL_TEXT: CatalogInstallBarText = {
  install: 'Install',
  update: 'Update',
  uninstall: 'Uninstall',
  cancel: 'Cancel',
  installed: 'Installed',
  installing: 'Installing',
};

const BAR_MAX = 1000;

export { CATALOG_INSTALL_TEXT, BAR_MAX };
