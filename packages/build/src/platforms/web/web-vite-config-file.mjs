/* @layer tooling-scripts @kind logic */
import { fillTemplate } from '../../release/fill-template.mjs';
import { WEB_TEMPLATES, WEB_VITE_CONFIG_FILE } from './web.constants.mjs';

/**
 * @returns {{ path: string, content: string }} the managed web Vite config
 */
const webViteConfigFile = () => ({ path: WEB_VITE_CONFIG_FILE, content: fillTemplate(WEB_TEMPLATES, 'vite.web.config.ts.tmpl', {}) });

export { webViteConfigFile };
