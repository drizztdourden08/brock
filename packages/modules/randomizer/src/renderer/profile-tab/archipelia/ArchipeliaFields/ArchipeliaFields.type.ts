/* @layer renderer-shell @kind types */
import type { LobbyForm } from '../lobby-form.type';

interface ArchipeliaFieldsProps {
  value: LobbyForm;
  onChange: (part: Partial<LobbyForm>) => void;
  joining?: boolean;
}

export type { ArchipeliaFieldsProps };
