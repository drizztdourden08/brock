/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import type { ProfilesPanelModel, ProfilesPanelPick, ProfilesPanelProps } from '../ProfilesPanel.type';
import { errorText } from './error-text';
import { usePressFlag } from './usePressFlag';

const useProfilesPanel = (props: ProfilesPanelProps): ProfilesPanelModel => {
  const { selectedId = null, onSelect, onCreate, onRename, createOpen = false } = props;
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [renameError, setRenameError] = useState<string | null>(null);
  const [picked, setPicked] = useState<ProfilesPanelPick | null>(null);
  const press = usePressFlag();

  const openChange = useCallback((open: boolean) => {
    setCreating(open);
    setCreateError(null);
  }, []);

  const submitCreate = useCallback((name: string, close: () => void) => {
    if (!onCreate) return;
    setCreating(true);
    setCreateError(null);
    onCreate(name).then(close, (error: unknown) => setCreateError(errorText(error)));
  }, [onCreate]);

  const submitRename = useCallback((id: string, name: string) => {
    if (!onRename) return;
    setRenameError(null);
    onRename(id, name).catch((error: unknown) => setRenameError(errorText(error)));
  }, [onRename]);

  const pick = useCallback((id: string) => {
    if (!press.take()) {
      setPicked({ id, from: selectedId });
      return;
    }
    setPicked(null);
    onSelect(id);
  }, [press, onSelect, selectedId]);

  return {
    createShown: creating || createOpen,
    createError,
    renameError,
    pickedId: picked?.from === selectedId ? picked.id : selectedId,
    pressHandlers: press.handlers,
    openChange,
    submitCreate,
    submitRename,
    pick,
  };
};

export { useProfilesPanel };
