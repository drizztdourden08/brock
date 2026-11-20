/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { Button, ButtonRow, ProgressBar, Text } from '@drizztdourden08/tessera/primitives';
import { BAR_MAX } from '../CatalogInstallBar.constants';
import type { InstallProgressProps } from '../CatalogInstallBar.type';

const InstallProgress = ({ progress, text, onCancel }: InstallProgressProps) => {
  const resolve = useText();
  const line = progress.line === null ? null : resolve(progress.line);
  return (
    <>
      <Text variant="label">{text.installing}</Text>
      <ProgressBar value={Math.round(progress.fraction * BAR_MAX)} max={BAR_MAX} live label={line ?? text.installing} />
      <ButtonRow lead={line ? <Text tone="muted">{line}</Text> : undefined}>
        {onCancel && <Button variant="tertiary" size="sm" onClick={onCancel}>{text.cancel}</Button>}
      </ButtonRow>
    </>
  );
};

export { InstallProgress };
