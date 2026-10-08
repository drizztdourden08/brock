/* @layer renderer-shell @kind component */
import { Stack } from '@drizztdourden08/tessera/primitives';
import { CATALOG_INSTALL_TEXT } from './CatalogInstallBar.constants';
import type { CatalogInstallBarProps } from './CatalogInstallBar.type';
import { InstallActions } from './sub-components/InstallActions';
import { InstallProgress } from './sub-components/InstallProgress';
import './CatalogInstallBar.css';

const CatalogInstallBar = (props: CatalogInstallBarProps) => {
  const { progress = null, text: own, className = '', ...actions } = props;
  const text = { ...CATALOG_INSTALL_TEXT, ...own };

  return (
    <Stack gap="xs" className={`catalog-install-bar${className ? ` ${className}` : ''}`}>
      {progress ? <InstallProgress progress={progress} text={text} onCancel={actions.onCancel} /> : <InstallActions {...actions} text={text} />}
    </Stack>
  );
};

export { CatalogInstallBar };
