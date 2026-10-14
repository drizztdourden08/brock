/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { isCatalogInstalling } from '../jobs/is-catalog-installing';

const isInstalling = (ctx: Pick<MainContext, 'jobs'>, itemId: string): boolean => isCatalogInstalling(itemId, ctx.jobs);

export { isInstalling };
