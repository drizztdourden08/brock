/* @layer renderer-shell @kind hook */
import { useCallback, useEffect, useState } from 'react';
import type { MsuEngine, MsuPackManifest } from '../../../types';
import { useMsuStudioGame } from '../../game/useMsuStudioGame';
import type { PreviewReport } from '../../preview-report';
import { usePreviewSession } from './usePreviewSession';
import { soundPreviewKey } from './preview-key';
import { channelIndexOf, isAdditiveChannel } from './sound-channel-kind';
import { singleSoundManifest } from './sound-manifest';

const overlapNote = (setCount: number, voiceCap: number | null): string | null => {
  if (setCount <= 1) return null;
  return voiceCap === null ? `${setCount} overlapping` : `${setCount} of ${voiceCap} overlapping`;
};

const readChannel = (engine: MsuEngine<never>, channel: string): PreviewReport | null => {
  const report = engine.reportChannel(channel);
  if (report === null) return null;
  return {
    key: soundPreviewKey(channel, report.id),
    elapsedSeconds: report.elapsedSeconds,
    layers: report.layers,
    detail: overlapNote(report.setCount, report.voiceCap),
  };
};

const useSoundPreview = (pack: string | null, manifest: MsuPackManifest) => {
  const { config } = useMsuStudioGame<never, never>();
  const { start, stop: stopSession, retrigger, error, reportStore } = usePreviewSession(pack);
  const [playing, setPlaying] = useState<string | null>(null);

  const stop = useCallback(() => {
    setPlaying(null);
    stopSession();
  }, [stopSession]);

  const play = useCallback(async (channel: string, soundId: number) => {
    const key = soundPreviewKey(channel, soundId);
    const fire = (engine: MsuEngine<never>): void => {
      engine.onGameSound(channelIndexOf(config, channel), soundId, 0);
    };
    if (playing === key && isAdditiveChannel(config, channel) && retrigger(fire)) return;
    setPlaying(key);
    const started = await start({
      manifest: singleSoundManifest(manifest, channel, soundId),
      read: (engine) => readChannel(engine, channel),
      begin: fire,
    });
    if (!started) setPlaying((current) => (current === key ? null : current));
  }, [playing, config, manifest, start, retrigger]);

  useEffect(() => stop, [pack, stop]);

  return { playing, previewError: error, play, stop, reportStore };
};

export { useSoundPreview };
