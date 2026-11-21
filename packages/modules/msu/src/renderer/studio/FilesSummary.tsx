/* @layer renderer-shell @kind component */
import { useT } from '@drizztdourden08/brock-react';
import { StudioSection } from '../studio-kit';
import { PackSummary } from './PackSummary';
import { EMPTY_PACK } from './MsuFilePanel.constants';
import type { FilesSummaryProps } from './FilesSummary.type';

const FilesSummary = (props: FilesSummaryProps) => {
  const { model, readOnly, onOptimize } = props;
  const t = useT();
  const { panel, covered } = model;

  return (
    <StudioSection title={t('msu:pack.files')}>
      <PackSummary
        fileCount={panel.metadata.length}
        totalSize={panel.totalSize}
        formats={panel.formats}
        unusedCount={model.unusedCount}
        supersededCount={covered.count}
        supersededBytes={covered.totalBytes}
        optimizeBlockedBecause={panel.metadata.length === 0 ? EMPTY_PACK : null}
        busy={panel.busy || covered.removing || readOnly}
        onOptimize={onOptimize}
        onRemoveSuperseded={model.confirmRemoveSuperseded}
      />
    </StudioSection>
  );
};

export { FilesSummary };
