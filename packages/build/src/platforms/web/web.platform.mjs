/* @layer tooling-scripts @kind config */
import { definePlatform } from '../define-platform.mjs';
import { webJobs } from './web-jobs.mjs';
import { webScripts } from './web-scripts.mjs';
import { webViteConfigFile } from './web-vite-config-file.mjs';

const webPlatform = definePlatform({
  id: 'web',
  label: 'Web',
  scaffold: [webScripts()],
  managed: () => [webViteConfigFile()],
  ciJob: webJobs.ci,
  releaseJob: webJobs.release,
});

export { webPlatform };
