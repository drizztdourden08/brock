/* @layer electron-main @kind logic */
import type { Rectangle } from 'electron';

const normalBounds: { cached: Rectangle | null } = { cached: null };

export { normalBounds };
