/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import { useMsuStudio } from '../game/useMsuStudio';
import { NO_BADGE } from './local-pack-origin.constants';
import { promptFor } from './local-pack-origin';
import type { MsuPackOrigin } from './msu-origin.type';

const useLocalPackOrigin: MsuPackOrigin = (args) => {
  const { selected, setSelected, refresh, onDeleteConfirm } = args;
  const { store } = useMsuStudio();

  const onDelete = useCallback((packName: string) => {
    const { title, message } = promptFor(packName, store.canTrashMsuPack());
    onDeleteConfirm(title, message, () => {
      void store.deleteMsuPack(packName).then(async () => {
        if (selected === packName) setSelected(null);
        await refresh();
      });
    });
  }, [store, selected, setSelected, refresh, onDeleteConfirm]);

  return {
    readOnly: false,
    banner: null,
    badge: NO_BADGE,
    isInstalled: () => false,
    nameTaken: () => false,
    error: null,
    onDelete,
  };
};

export { useLocalPackOrigin };
