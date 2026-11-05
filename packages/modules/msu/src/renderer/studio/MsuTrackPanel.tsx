/* @layer renderer-shell @kind component */
import { useMsuStudioGame } from '../game/useMsuStudioGame';
import './MsuTrackPanel.css';
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { TrackSection } from './TrackSection';
import { UnusedAudio } from './UnusedAudio';
import type { MsuTrackPanelProps } from './MsuTrackPanel.type';

const MsuTrackPanel = (props: MsuTrackPanelProps) => {
  const { rows, files, unusedFiles, busy, readOnly, selected, note, controls, onSelect, onDeleteFile } = props;
  const game = useMsuStudioGame<never, never>();
  const sectionProps = { files, selected, controls, onSelect };

  return (
    <Box className="msu-panel">
      {note !== null && <Text className="msu-status msu-status--error">{note}</Text>}

      <TrackSection
        title={game.slotTitles.base}
        rows={rows.filter((r) => r.trackNum < game.extendedThreshold)}
        {...sectionProps}
      />
      <TrackSection
        title={game.slotTitles.extended}
        rows={rows.filter((r) => r.trackNum >= game.extendedThreshold)}
        {...sectionProps}
      />

      <UnusedAudio unusedFiles={unusedFiles} busy={busy} readOnly={readOnly} onDeleteFile={onDeleteFile} />
    </Box>
  );
};

export { MsuTrackPanel };
