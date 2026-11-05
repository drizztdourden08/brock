/* @layer renderer-components @kind hook */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { InputProfile } from '../../../bindings';
import { focusInputWhenReady } from './focus-input-when-ready';
import type { UseProfileEditingArgs } from './profile-editing.type';

const useProfileEditing = ({ profiles, initialEditId, onRename }: UseProfileEditingArgs) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const consumedInitialRef = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editingId) return undefined;
    return focusInputWhenReady(inputRef);
  }, [editingId]);

  const startEditing = useCallback((profile: InputProfile) => {
    setEditingId(profile.id);
    setEditValue(profile.name);
  }, []);

  useEffect(() => {
    if (!initialEditId || initialEditId === consumedInitialRef.current) return;
    consumedInitialRef.current = initialEditId;
    const profile = profiles.find((p) => p.id === initialEditId);
    if (profile) startEditing(profile);
  }, [initialEditId, profiles, startEditing]);

  const commitEdit = useCallback((profile: InputProfile) => {
    if (editValue.trim()) onRename(profile, editValue);
    setEditingId(null);
  }, [editValue, onRename]);

  const cancelEdit = useCallback(() => setEditingId(null), []);

  return { editingId, editValue, inputRef, setEditValue, startEditing, commitEdit, cancelEdit };
};

export { useProfileEditing };
