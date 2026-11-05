/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import type { MsuLayer } from '../../../../types';
import { useMsuStudio } from '../../../game/useMsuStudio';
import { createLayer } from './create-layer';
import { moveItem } from './move-item';
import { normalizeLayers } from './normalize-layers';
import { validateLayers } from './validate-layers';
import type { LayerEditorState } from './useLayerEditor.type';

const useLayerEditor = (params: LayerEditorState) => {
  const { pack, target, manifest, saveBase, onSaved } = params;
  const { game, store } = useMsuStudio();
  const [layers, setLayers] = useState<MsuLayer[]>(() => target.read(manifest));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback((next: (current: MsuLayer[]) => MsuLayer[]) => {
    setLayers(next);
    setDirty(true);
    setError(null);
  }, []);

  const addLayer = useCallback(() => {
    mutate((current) => [...current, createLayer(current, target.oneShot)]);
  }, [mutate, target.oneShot]);

  const removeLayer = useCallback((id: string) => {
    mutate((current) => current.filter((layer) => layer.id !== id));
  }, [mutate]);

  const moveLayer = useCallback((id: string, delta: number) => {
    mutate((current) => moveItem(current, current.findIndex((layer) => layer.id === id), delta));
  }, [mutate]);

  const updateLayer = useCallback((id: string, patch: Partial<Omit<MsuLayer, 'id'>>) => {
    mutate((current) => current.map((layer) => (layer.id === id ? { ...layer, ...patch } : layer)));
  }, [mutate]);

  const save = useCallback(async () => {
    const problem = validateLayers(layers, game.maxCrossfadeSeconds);
    if (problem) { setError(problem); return; }
    setSaving(true);
    setError(null);
    try {
      await store.writeMsuManifest(pack, target.write(saveBase, normalizeLayers(layers, game.maxCrossfadeSeconds)));
      setDirty(false);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the layers');
    } finally {
      setSaving(false);
    }
  }, [layers, game, store, pack, saveBase, target, onSaved]);

  const revert = useCallback(() => {
    setLayers(target.read(manifest));
    setDirty(false);
    setError(null);
  }, [manifest, target]);

  return { layers, dirty, saving, error, addLayer, removeLayer, moveLayer, updateLayer, save, revert };
};

export { useLayerEditor };
