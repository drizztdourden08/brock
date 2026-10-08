/* @layer renderer-shell @kind component */
import { Button, ButtonRow, ProgressBar, Text } from '@drizztdourden08/tessera/primitives';
import { BAR_MAX } from '../CatalogInstallBar.constants';
import type { InstallProgressProps } from '../CatalogInstallBar.type';

const InstallProgress = ({ progress, text, onCancel }: InstallProgressProps) => (
  <>
    <Text variant="label">{text.installing}</Text>
    <ProgressBar value={Math.round(progress.fraction * BAR_MAX)} max={BAR_MAX} live label={progress.line ?? text.installing} />
    <ButtonRow lead={progress.line ? <Text tone="muted">{progress.line}</Text> : undefined}>
      {onCancel && <Button variant="tertiary" size="sm" onClick={onCancel}>{text.cancel}</Button>}
    </ButtonRow>
  </>
);

export { InstallProgress };
