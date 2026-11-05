/* @layer renderer-components @kind hook */
import { useCallback } from 'react';
import type { ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import type { ProfileItemHandlerArgs } from './profile-item-handlers.type';

const useProfileItemHandlers = (args: ProfileItemHandlerArgs) => {
  const { profile, onSelect, onDelete, onStartEditing, onCommitEdit, onCancelEdit, onEditValueChange } = args;

  const handleSelect = useCallback(() => onSelect(profile), [onSelect, profile]);
  const handleStartEditing = useCallback(() => onStartEditing(profile), [onStartEditing, profile]);
  const handleCommit = useCallback(() => onCommitEdit(profile), [onCommitEdit, profile]);
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onEditValueChange(e.target.value),
    [onEditValueChange],
  );
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') onCommitEdit(profile);
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancelEdit();
    }
  }, [onCommitEdit, onCancelEdit, profile]);
  const handleEditClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    onStartEditing(profile);
  }, [onStartEditing, profile]);
  const handleDeleteClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    onDelete(profile);
  }, [onDelete, profile]);

  return { handleSelect, handleStartEditing, handleCommit, handleChange, handleKeyDown, handleEditClick, handleDeleteClick };
};

export { useProfileItemHandlers };
