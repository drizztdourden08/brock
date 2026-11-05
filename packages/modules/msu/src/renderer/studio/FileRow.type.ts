/* @layer renderer-shell @kind types */
import type { MsuFileMetadata } from '../../packs';
import type { Audition } from '../audition';

interface FileRowProps {
  file: MsuFileMetadata;
  usedBy: string[];
  loopSeconds: number | null | undefined;
  playing: boolean;
  loading: boolean;
  audition: Audition | null;
  busy: boolean;
  readOnly: boolean;
  onPlay: (fileName: string) => void;
  onRename: (from: string, to: string) => void;
  onDelete: (fileName: string) => void;
}

export type { FileRowProps };
