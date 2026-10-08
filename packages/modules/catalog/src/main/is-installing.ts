/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { CATALOG_JOB_PREFIX } from '../catalog.constants';

const isInstalling = (ctx: Pick<MainContext, 'jobs'>, itemId: string): boolean =>
  ctx.jobs.list().some((job) => job.id === `${CATALOG_JOB_PREFIX}${itemId}` && job.state === 'running');

export { isInstalling };
