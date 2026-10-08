/* @layer renderer-shell @kind logic */
import type { CatalogItemState } from '../../../renderer/catalog-item.type';
import type { CatalogInstallBarProps } from '../CatalogInstallBar.type';

const installBarProps = (state: CatalogItemState): CatalogInstallBarProps => ({
  installed: state.record !== null,
  hasUpdate: state.hasUpdate,
  progress: state.job ? { fraction: state.job.progress, line: state.job.line } : null,
  error: state.error,
  onInstall: () => { void state.install(); },
  onUninstall: () => { void state.uninstall(); },
  onCancel: state.cancel,
});

export { installBarProps };
