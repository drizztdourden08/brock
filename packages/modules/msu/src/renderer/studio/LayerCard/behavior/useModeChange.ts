/* @layer renderer-shell @kind hook */
import { useT } from '@drizztdourden08/brock-react';
import { useCallback } from 'react';
import type { LayerPlayMode } from '../../../../types';
import { singleDiscardMessage } from './single-discard-message';
import type { ModeChangeParams } from './useModeChange.type';

const isSingle = (mode: LayerPlayMode): boolean => mode.kind === 'loop' && mode.order === 'single';

const useModeChange = (params: ModeChangeParams) => {
  const t = useT();
  const { layer, onConfirm, onChange } = params;
  const { files, mode: current } = layer;

  const changeMode = useCallback((mode: LayerPlayMode) => {
    const discards = isSingle(mode) && !isSingle(current) && files.length > 1;
    if (!discards) {
      onChange({ mode });
      return;
    }
    onConfirm(
      t('msu:layer.singleTitle'),
      singleDiscardMessage(files, t),
      () => onChange({ mode, files: files.slice(0, 1) }),
    );
  }, [current, files, t, onConfirm, onChange]);

  return { changeMode };
};

export { useModeChange };
