/* @layer renderer-shell @kind logic */
import { KIB, MIB } from '../UpdateDialog.constants';

const formatBytes = (bytes: number): string => {
  if (bytes <= 0) return '';
  if (bytes < MIB) return `${(bytes / KIB).toFixed(0)} KB`;
  return `${(bytes / MIB).toFixed(1)} MB`;
};

export { formatBytes };
