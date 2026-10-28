/* @layer electron-main @kind test */
import { vi } from 'vitest';

const markOfTheWeb = vi.fn<(path: string) => Promise<void>>();

export { markOfTheWeb };
