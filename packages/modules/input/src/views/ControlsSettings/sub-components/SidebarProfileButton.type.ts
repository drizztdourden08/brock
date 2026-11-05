/* @layer renderer-components @kind types */
import type { InputProfile } from '../../../bindings';

interface SidebarProfileButtonProps {
  profile: InputProfile;
  active: boolean;
  onSelect: (profile: InputProfile) => void;
}

export type { SidebarProfileButtonProps };
