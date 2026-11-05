/* @layer renderer-shell @kind component */
import { useState } from 'react';
import { useMsuStudioGame } from '../game/useMsuStudioGame';
import { SoundPanelRows } from './SoundPanelRows';
import { SoundPanelShell } from './SoundPanelShell';
import { SoundSide } from './SoundSide';
import { soundToolGroups } from './sound-tool-groups';
import { soundPanelSubtitle } from './behavior/sound-subtitle';
import { useSoundPanel } from './behavior/useSoundPanel';
import { useSoundTabActions } from './behavior/useSoundTabActions';
import { soundChannelLabel } from './sound-labels';
import { editorLabelOf } from './studio-frame/editor-label-of';
import type { MsuSoundPanelProps } from './MsuSoundPanel.type';

const MsuSoundPanel = (props: MsuSoundPanelProps) => {
  const { tabId, pack, channel, manifest, saveBase, files, isLayered, readOnly, tabs, packPanel, onDeleteConfirm, onReload } = props;
  const game = useMsuStudioGame<never, never>();
  const [filter, setFilter] = useState('');
  const [showUnreachable, setShowUnreachable] = useState(false);
  const sound = useSoundPanel({ pack, channel, manifest, saveBase, files, filter, showUnreachable, reload: onReload });
  const { confirmStopReplacing, select, original } = useSoundTabActions({ sound, onDeleteConfirm });
  const channelLabel = soundChannelLabel(game, channel);

  const openRow = sound.rows.find((row) => row.soundId === sound.openSound);
  const detail = (
    <SoundSide
      open={openRow === undefined ? null : { channel, row: openRow, sound }}
      noteTitle={channelLabel}
      note={soundPanelSubtitle(game.config, { ...sound, channel, showUnreachable })}
      packPanel={packPanel}
      pack={pack}
      manifest={manifest}
      saveBase={saveBase}
      files={files}
      isLayered={isLayered}
      readOnly={readOnly}
      onPreview={sound.play}
      onPlayOriginal={original}
      onStopReplacing={confirmStopReplacing}
      onClose={sound.closeLayers}
      onConfirm={onDeleteConfirm}
      onReload={onReload}
    />
  );

  const toolbar = soundToolGroups({
    tabs,
    placeholder: game.soundFilterPlaceholder,
    unreachableCount: sound.unreachableCount,
    filter,
    showUnreachable,
    onFilterChange: setFilter,
    onShowUnreachableChange: setShowUnreachable,
  });

  return (
    <SoundPanelShell
      editorLabel={editorLabelOf(game, tabId)}
      toolbar={toolbar}
      detail={detail}
      header={{
        title: `${channelLabel} · ${sound.replacedCount} of ${sound.total} replaced`,
        sounding: sound.playing !== null || sound.playingOriginal !== null,
        status: sound.statusMessage,
        statusOk: sound.statusOk,
        onStop: sound.stop,
      }}
    >
      <SoundPanelRows channel={channel} sound={sound} filter={filter} onSelect={select} onPreview={sound.play} onPlayOriginal={original} />
    </SoundPanelShell>
  );
};

export { MsuSoundPanel };
