/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { Button, ButtonRow, Text } from '@drizztdourden08/tessera/primitives';
import type { InstallActionsProps } from '../CatalogInstallBar.type';

const InstallActions = ({ installed, hasUpdate = false, error = null, onInstall, onUninstall, text }: InstallActionsProps) => {
  const resolve = useText();
  return (
    <>
      <ButtonRow lead={installed ? <Text tone="muted">{resolve(text.installed)}</Text> : undefined}>
        {installed && onUninstall && <Button variant="ghost" size="sm" onClick={onUninstall}>{resolve(text.uninstall)}</Button>}
        {installed && hasUpdate && <Button variant="primary" size="sm" onClick={onInstall}>{resolve(text.update)}</Button>}
        {!installed && <Button variant="primary" size="sm" onClick={onInstall}>{resolve(text.install)}</Button>}
      </ButtonRow>
      {error && <Text tone="danger" role="alert">{error}</Text>}
    </>
  );
};

export { InstallActions };
