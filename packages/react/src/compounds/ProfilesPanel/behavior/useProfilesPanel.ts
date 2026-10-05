/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import type { ProfilesPanelModel, ProfilesPanelProps } from '../ProfilesPanel.type';
import { errorText } from './error-text';

const useProfilesPanel = (props: ProfilesPanelProps): ProfilesPanelModel => {
  const { onCreate, onRename, createOpen = false } = props;
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [renameError, setRenameError] = useState<string | null>(null);

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

  return {
    createShown: creating || createOpen,
    createError,
    renameError,
    openChange,
    submitCreate,
    submitRename,
  };
};

export { useProfilesPanel };
