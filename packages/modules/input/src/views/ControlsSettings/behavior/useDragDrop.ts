/* @layer renderer-components @kind hook */
import { useCallback, useState } from 'react';
import type { DragEvent } from 'react';
import { DRAG_SDL_TYPE } from '../ControlsSettings.constants';
import type { UseDragDropArgs } from '../ControlsBehavior.type';
import type { PresetDevice } from '../ControlsSettings.type';
import { buildPresetProfile } from './build-preset-profile';
import { readDroppedPreset } from './read-dropped-preset';

const useDragDrop = ({ entries, game, activeProfile, updateActiveProfile }: UseDragDropArgs) => {
  const [dragOverBindings, setDragOverBindings] = useState(false);
  const [confirmPreset, setConfirmPreset] = useState<PresetDevice | null>(null);

  const handleDragOver = useCallback((e: DragEvent) => {
    if (e.dataTransfer.types.includes(DRAG_SDL_TYPE)) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      setDragOverBindings(true);
    }
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverBindings(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOverBindings(false);
    const dropped = readDroppedPreset({ transfer: e.dataTransfer });
    if (dropped) setConfirmPreset(dropped);
  }, []);

  const handleApplyPreset = useCallback(() => {
    if (!confirmPreset || !activeProfile) return;
    updateActiveProfile(buildPresetProfile({ preset: confirmPreset, profile: activeProfile, game, entries }));
    setConfirmPreset(null);
  }, [confirmPreset, activeProfile, updateActiveProfile, game, entries]);

  return {
    dragOverBindings,
    confirmPreset,
    setConfirmPreset,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleApplyPreset,
  };
};

export { useDragDrop };
