/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { usePageOverride } from '../../renderer/bucket/behavior/usePageOverride';
import { NetworkView } from '../../renderer/views/NetworkView';
import { PAGE_METAS } from '../pages.constants';

const meta: ScreenMeta = PAGE_METAS.network;

const RandomizerNetworkPage = () => <>{usePageOverride('network') ?? <NetworkView />}</>;

export default RandomizerNetworkPage;
export { meta };
