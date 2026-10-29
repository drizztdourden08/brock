/* @layer electron-main @kind logic */
import { statSync } from 'fs';

const accessStamp = (file: string): string | null => {
  try {
    const stat = statSync(file, { bigint: true });
    return [stat.size, stat.mtimeNs, stat.ctimeNs, stat.ino, stat.dev].join(':');
  } catch {
    return null;
  }
};

export { accessStamp };
