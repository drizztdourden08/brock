/* @layer renderer-shell @kind component */
import { useT } from '@drizztdourden08/brock-react';
import { Box, EmptyState } from '@drizztdourden08/tessera/primitives';
import { SoundListItem } from './SoundListItem';
import { soundPreviewKey } from './behavior/preview-key';
import type { EffectRowsProps } from './EffectRows.type';

const EffectRows = (props: EffectRowsProps) => {
  const { panel } = props;
  const t = useT();
  const { rows, filter, panelOf, toggleLayers, play, playOriginal } = panel;

  if (rows.length === 0) return <EmptyState message={t('msu:effects.noMatch', { filter })} />;

  return (
    <Box className="track-list">
      {rows.map(({ channel, row }) => (
        <SoundListItem
          key={soundPreviewKey(channel, row.soundId)}
          channel={channel}
          row={row}
          sound={panelOf(channel)}
          showChannel
          onSelect={toggleLayers}
          onPreview={play}
          onPlayOriginal={playOriginal}
        />
      ))}
    </Box>
  );
};

export { EffectRows };
