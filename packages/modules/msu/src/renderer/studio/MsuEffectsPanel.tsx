/* @layer renderer-shell @kind component */
import { useMsuStudioGame } from '../game/useMsuStudioGame';
import { sectionGroup } from './studio-frame/section-group';
import { editorLabelOf } from './studio-frame/editor-label-of';
import { EffectRows } from './EffectRows';
import { SoundPanelShell } from './SoundPanelShell';
import { SoundSide } from './SoundSide';
import { soundFindGroup } from './sound-find-group';
import { effectsNote } from './behavior/effects-note';
import { effectsSummary } from './behavior/effects-summary';
import { useEffectsPanel } from './behavior/useEffectsPanel';
import type { MsuEffectsPanelProps } from './msu.type';

const MsuEffectsPanel = (props: MsuEffectsPanelProps) => {
  const { tabId, channels, pack, manifest, saveBase, files, isLayered, readOnly, tabs, packPanel, onDeleteConfirm, onReload } = props;
  const game = useMsuStudioGame<never, never>();
  const panel = useEffectsPanel(props);
  const { filter, setFilter, panelOf, rows, open } = panel;
  const summary = effectsSummary(panel.first, panel.second);
  const label = editorLabelOf(game, tabId);

  const openRow = open === null ? undefined : rows.find(({ channel, row }) => channel === open.channel && row.soundId === open.soundId);
  const detail = (
    <SoundSide
      open={openRow === undefined ? null : { channel: openRow.channel, row: openRow.row, sound: panelOf(openRow.channel) }}
      noteTitle={label}
      note={effectsNote(game, channels)}
      packPanel={packPanel}
      pack={pack}
      manifest={manifest}
      saveBase={saveBase}
      files={files}
      isLayered={isLayered}
      readOnly={readOnly}
      onPreview={panel.play}
      onPlayOriginal={panel.playOriginal}
      onStopReplacing={panel.confirmStopReplacing}
      onClose={(channel) => panelOf(channel).closeLayers()}
      onConfirm={onDeleteConfirm}
      onReload={onReload}
    />
  );

  const toolbar = [sectionGroup(tabs), soundFindGroup(game.soundFilterPlaceholder, filter, setFilter)];

  return (
    <SoundPanelShell
      editorLabel={label}
      toolbar={toolbar}
      detail={detail}
      header={{
        title: `${label} · ${summary.replaced} of ${summary.total} replaced`,
        sounding: summary.sounding,
        status: summary.status,
        statusOk: summary.statusOk,
        onStop: panel.stopAll,
      }}
    >
      <EffectRows panel={panel} />
    </SoundPanelShell>
  );
};

export { MsuEffectsPanel };
