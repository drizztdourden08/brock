/* @layer electron-main @kind logic */
import type { ResizeSession } from './widget-windows.type';

let current: ResizeSession | null = null;

const resizeSession = {
  active: (): boolean => current !== null,
  current: (): ResizeSession | null => current,
  of: (id: string): ResizeSession | null => (current?.id === id ? current : null),
  open: (session: ResizeSession): ResizeSession => {
    current = session;
    return session;
  },
  close: (): void => {
    current = null;
  },
};

export { resizeSession };
