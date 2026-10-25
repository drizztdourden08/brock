/* @layer renderer-shell @kind types */
import type { MappingSource } from '../../mapping/mapping-entry.type';
import type { PadFamily } from '../../pad/controller-slot.type';

type DirectoryGroup = 'Connected' | 'Known';

type DirectorySource = MappingSource | 'none';

interface DirectoryRow {
  id: string;
  name: string;
  vidPid: string;
  family: PadFamily;
  source: DirectorySource;
  inputs: number;
  group: DirectoryGroup;
  connectedKey: string | null;
}

interface ControllerDirectoryProps {
  onOpenController?: (deviceKey: string) => void;
}

export type { ControllerDirectoryProps, DirectoryRow };
