/* @layer renderer-shell @kind hook */
import { useEffect, useRef } from 'react';
import { dnd } from './dnd';
import type { DropInfo } from './dnd.type';
import type { PathDrop, WindowFileDropOptions } from './path-drop.type';
import { registerTarget } from './register-target';

const useWindowFileDrop = (onDrop: (drop: PathDrop, info: DropInfo) => void, options: WindowFileDropOptions = {}): void => {
  const latest = useRef({ onDrop, options });
  latest.current = { onDrop, options };

  useEffect(() => {
    return registerTarget<PathDrop>(document.documentElement, {
      accepts: dnd.paths,
      get paths() { return latest.current.options.paths; },
      onDrop: (drop, info) => latest.current.onDrop(drop, info),
      canDrop: (drop) => latest.current.options.canDrop?.(drop) ?? true,
    }, true);
  }, []);
};

export { useWindowFileDrop };
