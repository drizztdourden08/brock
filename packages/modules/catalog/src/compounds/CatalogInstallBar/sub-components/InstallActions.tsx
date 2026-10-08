/* @layer renderer-shell @kind component */
import { Button, ButtonRow, Text } from '@drizztdourden08/tessera/primitives';
import type { InstallActionsProps } from '../CatalogInstallBar.type';

const InstallActions = ({ installed, hasUpdate = false, error = null, onInstall, onUninstall, text }: InstallActionsProps) => (
  <>
    <ButtonRow lead={installed ? <Text tone="muted">{text.installed}</Text> : undefined}>
      {installed && onUninstall && <Button variant="ghost" size="sm" onClick={onUninstall}>{text.uninstall}</Button>}
      {installed && hasUpdate && <Button variant="primary" size="sm" onClick={onInstall}>{text.update}</Button>}
      {!installed && <Button variant="primary" size="sm" onClick={onInstall}>{text.install}</Button>}
    </ButtonRow>
    {error && <Text tone="danger" role="alert">{error}</Text>}
  </>
);

export { InstallActions };
