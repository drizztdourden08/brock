/* @layer electron-main @kind types */
import type { EditRole } from '@drizztdourden08/brock-core/ipc';

interface EditItem {
  role: EditRole;
  label: string;
  accelerator: { mac: string; other: string };
}

export type { EditItem };
