/* @layer renderer-shell @kind hook */
import { useT } from '@drizztdourden08/brock-react';
import { useCallback, useEffect, useState } from 'react';
import { useMsuStudioGame } from '../../game/useMsuStudioGame';
import { NO_ASSETS } from './original-preview.constants';

const useOriginalPreview = (target: string) => {
  const t = useT();
  const { preview } = useMsuStudioGame<never, string>();
  const [playing, setPlaying] = useState<number | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const stop = useCallback(() => {
    setPlaying(null);
    preview?.stop();
  }, [preview]);

  const play = useCallback((soundId: number) => {
    if (preview === undefined) return;
    if (playing === soundId) {
      stop();
      return;
    }
    setNote(null);
    setPlaying(soundId);
    void preview.play(target, soundId, () => {
      setPlaying((current) => (current === soundId ? null : current));
    }).then((outcome) => {
      if (outcome.started) return;
      setPlaying((current) => (current === soundId ? null : current));
      setNote(outcome.silent ? t('msu:effects.chipSilent') : t(NO_ASSETS));
    });
  }, [preview, target, playing, stop, t]);

  useEffect(() => stop, [target, stop]);

  return { playing, note, play, stop };
};

export { useOriginalPreview };
