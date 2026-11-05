/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import { useAudibleIds } from './useAudibleIds';
import { useOriginalPreview } from './useOriginalPreview';
import { useSoundPreview } from './useSoundPreview';
import { useSoundRows } from './useSoundRows';
import { useSoundUpload } from './useSoundUpload';
import { useStopReplacing } from './useStopReplacing';
import type { ActionResult } from '../msu.type';
import type { SoundPanelParams } from './sound-panel.type';

const useSoundPanel = (params: SoundPanelParams) => {
  const { pack, channel, manifest, saveBase, files, filter, showUnreachable, reload } = params;
  const [openSound, setOpenSound] = useState<number | null>(null);
  const [status, setStatus] = useState<ActionResult | null>(null);

  const {
    rows, ids, replacedCount, raisedCount, reachableCount, unreachableCount, total, hiddenCount,
  } = useSoundRows(manifest, channel, filter, showUnreachable);
  const { audible } = useAudibleIds(channel, ids);
  const { playing, previewError, play: playPack, stop: stopPack, reportStore } = useSoundPreview(pack, manifest);
  const original = useOriginalPreview(channel);
  const { upload, uploading } = useSoundUpload({ pack, files, reload });
  const stopReplacing = useStopReplacing({ pack, channel, saveBase, reload, setStatus });

  const play = useCallback((soundChannel: string, soundId: number) => {
    original.stop();
    setOpenSound(soundId);
    void playPack(soundChannel, soundId);
  }, [original, playPack]);

  const stop = useCallback(() => {
    original.stop();
    stopPack();
  }, [original, stopPack]);

  const playOriginal = useCallback((soundId: number) => {
    stopPack();
    setOpenSound(soundId);
    original.play(soundId);
  }, [original, stopPack]);

  const toggleLayers = useCallback((soundId: number) => {
    setOpenSound((open) => (open === soundId ? null : soundId));
  }, []);

  const closeLayers = useCallback(() => { setOpenSound(null); }, []);

  const handleUpload = useCallback((dropped: File[]) => {
    void upload(dropped).then(setStatus);
  }, [upload]);

  return {
    rows, replacedCount, raisedCount, reachableCount, unreachableCount, total, hiddenCount,
    openSound, toggleLayers, closeLayers,
    playing, play, stop, reportStore,
    playingOriginal: original.playing,
    chipAudible: (soundId: number) => (audible === null ? null : audible.has(soundId)),
    playOriginal,
    uploading, handleUpload,
    stopReplacing,
    statusMessage: previewError ?? original.note ?? status?.message ?? null,
    statusOk: previewError === null && original.note === null && status?.success !== false,
  };
};

export { useSoundPanel };
