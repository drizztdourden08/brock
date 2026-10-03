/* @layer renderer-shell @kind types */
import type { ProfilesPanelItem } from '../ProfilesPanel.type';

interface ProfilesPanelRowProps {
  profile: ProfilesPanelItem;
  selected: boolean;
  renaming: boolean;
  renameError: string | null;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
  onStartRename?: (id: string) => void;
  onSubmitRename: (id: string, name: string) => void;
  onCancelRename: () => void;
}

export type { ProfilesPanelRowProps };
