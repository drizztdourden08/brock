/* @layer renderer-shell @kind component */
import { useCallback, useMemo } from 'react';
import { useT, useText } from '@drizztdourden08/brock-react';
import { StudioLayout } from '@drizztdourden08/tessera/composites';
import { STUDIO_EDITOR_MIN_WIDTH, StudioPanelContent } from '../studio-kit';
import { sectionGroup } from './studio-frame/section-group';
import { MsuTrackPanel } from './MsuTrackPanel';
import { TrackDetail } from './TrackDetail';
import { useTrackPreviewSwitch } from './behavior/useTrackPreviewSwitch';
import { detailsPanel } from './studio-frame/details-panel';
import { EDITOR_LABELS } from './studio-frame/studio-frame.constants';
import type { MsuMusicTabProps } from './MsuMusicTab.type';
import type { TrackPreviewControls } from './msu.type';

const MsuMusicTab = (props: MsuMusicTabProps) => {
  const { msu, pack, readOnly, tabs, packPanel, onDeleteConfirm } = props;
  const t = useT();
  const text = useText();
  const { handleDeleteFile, openTrack, selectTrack, onPreview, onStopPreview } = msu;
  const { original, previewTrack, playOriginal } = useTrackPreviewSwitch({ onPreview, onStopPreview });

  const confirmDeleteFile = useCallback((fileName: string) => {
    onDeleteConfirm(t('msu:confirm.deleteFile.title'), t('msu:confirm.deleteFile.message', { name: fileName }), () => {
      handleDeleteFile(fileName);
    });
  }, [onDeleteConfirm, handleDeleteFile, t]);

  const controls = useMemo<TrackPreviewControls>(() => ({
    playing: msu.playing,
    playingOriginal: original.playing,
    onPreview: (trackNum) => { selectTrack(trackNum); previewTrack(trackNum); },
    onStopPreview,
    onPlayOriginal: (trackNum) => { selectTrack(trackNum); playOriginal(trackNum); },
  }), [msu.playing, original.playing, selectTrack, previewTrack, onStopPreview, playOriginal]);

  const row = openTrack === null ? undefined : msu.rows.find((candidate) => candidate.trackNum === openTrack);
  const detail = row === undefined ? packPanel : (
    <TrackDetail
      msu={msu}
      pack={pack}
      row={row}
      readOnly={readOnly}
      controls={controls}
      onClose={() => selectTrack(null)}
      onConfirm={onDeleteConfirm}
    />
  );

  return (
    <StudioLayout
      editorLabel={text(EDITOR_LABELS.music)}
      compactToolbar
      editorMinWidth={STUDIO_EDITOR_MIN_WIDTH}
      toolbar={[sectionGroup(tabs, t)]}
      end={detailsPanel(text, <StudioPanelContent>{detail}</StudioPanelContent>)}
    >
      <MsuTrackPanel
        rows={msu.rows}
        files={msu.files}
        unusedFiles={msu.unusedFiles}
        busy={msu.busy}
        readOnly={readOnly}
        selected={openTrack}
        note={original.note}
        controls={controls}
        onSelect={msu.handleToggleTrack}
        onDeleteFile={confirmDeleteFile}
      />
    </StudioLayout>
  );
};

export { MsuMusicTab };
