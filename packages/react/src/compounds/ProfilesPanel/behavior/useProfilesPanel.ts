/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import type { ProfilesPanelModel, ProfilesPanelProps } from '../ProfilesPanel.type';
import { errorText } from './error-text';

const useProfilesPanel = (props: ProfilesPanelProps): ProfilesPanelModel => {
  const { onCreate, onRename, createOpen = false } = props;
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameError, setRenameError] = useState<string | null>(null);

  const openCreate = useCallback(() => {
    setRenamingId(null);
    setCreating(true);
  }, []);

  const cancelCreate = useCallback(() => {
    setCreating(false);
    setCreateError(null);
  }, []);

  const submitCreate = useCallback((name: string) => {
    if (!onCreate) return;
    setCreateError(null);
    onCreate(name).then(() => setCreating(false), (error: unknown) => setCreateError(errorText(error)));
  }, [onCreate]);

  const startRename = useCallback((id: string) => {
    setRenameError(null);
    setRenamingId(id);
  }, []);

  const cancelRename = useCallback(() => {
    setRenamingId(null);
    setRenameError(null);
  }, []);

  const submitRename = useCallback((id: string, name: string) => {
    if (!onRename) return;
    setRenameError(null);
    onRename(id, name).then(() => setRenamingId(null), (error: unknown) => setRenameError(errorText(error)));
  }, [onRename]);

  return {
    formShown: onCreate !== undefined && (creating || createOpen),
    createError,
    renamingId,
    renameError,
    openCreate,
    cancelCreate,
    submitCreate,
    startRename,
    cancelRename,
    submitRename,
  };
};

export { useProfilesPanel };
