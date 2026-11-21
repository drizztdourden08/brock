/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { CatalogInstallBarText } from './CatalogInstallBar.type';

const CATALOG_INSTALL_TEXT: CatalogInstallBarText = {
  install: msg('catalog:bar.install'),
  update: msg('catalog:bar.update'),
  uninstall: msg('catalog:bar.uninstall'),
  cancel: msg('catalog:bar.cancel'),
  installed: msg('catalog:bar.installed'),
  installing: msg('catalog:bar.installing'),
};

const BAR_MAX = 1000;

export { CATALOG_INSTALL_TEXT, BAR_MAX };
