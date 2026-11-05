/* @layer renderer-shell @kind logic */
import { sha256Hex } from '../../../archipelago/lobby';
import { archipeliaOf } from '../game/archipelia-of';
import { assetUrlOf } from '../game/asset-url-of';
import { loadBuildsIndex } from './load-builds-index';
import { buildPathOf } from './world-package.constants';

const worldPackageFor = async (apVersion: string): Promise<ArrayBuffer | null> => {
  const build = (await loadBuildsIndex())?.builds.find((candidate) => candidate.archipelagoVersion === apVersion);
  if (build === undefined) return null;
  const response = await fetch(assetUrlOf(buildPathOf(archipeliaOf().archipelia.module, apVersion)));
  if (!response.ok) return null;
  const bytes = await response.arrayBuffer();
  return (await sha256Hex(bytes)) === build.sha256 ? bytes : null;
};

export { worldPackageFor };
