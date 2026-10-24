/* @layer tooling-scripts @kind config */
import { definePlatform } from '../define-platform.mjs';
import { dpkgCheck } from '../doctor/dpkg-check.mjs';
import { serverJobs } from './server-jobs.mjs';
import { serverManagedFiles } from './server-managed-files.mjs';

const serverPlatform = definePlatform({
  id: 'server',
  label: 'Server',
  doctor: [dpkgCheck(['linux'])],
  managed: serverManagedFiles,
  ciJob: serverJobs.ci,
  releaseJob: serverJobs.release,
  publishJob: serverJobs.image,
});

export { serverPlatform };
