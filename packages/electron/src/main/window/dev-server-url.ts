/* @layer electron-main @kind logic */
import { is } from '@electron-toolkit/utils';

const devServerUrl = (): string | null => (is.dev ? (process.env['ELECTRON_RENDERER_URL'] ?? null) : null);

export { devServerUrl };
