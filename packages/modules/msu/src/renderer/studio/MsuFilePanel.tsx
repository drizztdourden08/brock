/* @layer renderer-shell @kind component */
import { useState } from 'react';
import { useT, useText } from '@drizztdourden08/brock-react';
import { Box, DropZone, Text } from '@drizztdourden08/tessera/primitives';
import { StudioLayout } from '@drizztdourden08/tessera/composites';
import { STUDIO_EDITOR_MIN_WIDTH, StudioPanelContent } from '../studio-kit';
import { fileToolGroups } from './file-tool-groups';
import { FileList } from './FileList';
import { FilesSummary } from './FilesSummary';
import { OptimizeDialog } from './OptimizeDialog';
import { useFilePanelModel } from './behavior/useFilePanelModel';
import { AUDIO_ACCEPT, AUDIO_ACCEPT_HINT } from './msu.constants';
import { detailsPanel } from './studio-frame/details-panel';
import { EDITOR_LABELS } from './studio-frame/studio-frame.constants';
import type { MsuFilePanelProps } from './MsuFilePanel.type';
import './MsuFilePanel.css';

const MsuFilePanel = (props: MsuFilePanelProps) => {
  const { pack, readOnly, tabs, packPanel, onReload } = props;
  const t = useT();
  const text = useText();
  const model = useFilePanelModel(props);
  const { panel, covered, usage, supersededOnly } = model;
  const [optimizing, setOptimizing] = useState(false);

  const toolbar = fileToolGroups({
    tabs,
    filter: panel.filter,
    coveredCount: covered.count,
    supersededOnly,
    onFilterChange: panel.setFilter,
    onSupersededOnlyChange: model.setSupersededOnly,
    t,
  });

  const detail = <><FilesSummary model={model} readOnly={readOnly} onOptimize={() => setOptimizing(true)} />{packPanel}</>;

  return (
    <StudioLayout
      editorLabel={text(EDITOR_LABELS.files)}
      compactToolbar
      editorMinWidth={STUDIO_EDITOR_MIN_WIDTH}
      toolbar={toolbar}
      end={detailsPanel(text, <StudioPanelContent>{detail}</StudioPanelContent>)}
    >
      <Box className="msu-panel">
        <DropZone
          accept={AUDIO_ACCEPT}
          label={t('msu:files.dropLabel')}
          hint={AUDIO_ACCEPT_HINT}
          disabled={panel.busy || readOnly}
          onDrop={panel.handleUpload}
        />
        {panel.statusMessage != null && (
          <Text className={`msu-status${panel.statusOk ? '' : ' msu-status--error'}`}>{panel.statusMessage}</Text>
        )}
        <FileList
          ready={panel.ready}
          shown={model.shown}
          fileCount={panel.metadata.length}
          supersededOnly={supersededOnly}
          filter={panel.filter}
          usage={usage}
          audition={model.audition}
          busy={panel.busy}
          readOnly={readOnly}
          onRename={panel.renameFile}
          onDelete={model.confirmDelete}
        />
      </Box>
      <OptimizeDialog open={optimizing} pack={pack} onClose={() => setOptimizing(false)} onConverted={onReload} />
    </StudioLayout>
  );
};

export { MsuFilePanel };
