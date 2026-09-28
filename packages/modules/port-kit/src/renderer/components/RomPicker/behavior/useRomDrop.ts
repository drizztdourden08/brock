/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import type { DroppedRom } from '../RomPicker.type';

const useRomDrop = (onRom: (rom: DroppedRom) => void): ((files: File[]) => void) =>
  useCallback((files: File[]) => {
    const [file] = files;
    if (!file) return;
    void file.arrayBuffer().then((buffer) => onRom({ name: file.name, bytes: new Uint8Array(buffer) }));
  }, [onRom]);

export { useRomDrop };
