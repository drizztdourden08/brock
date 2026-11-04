/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { NetworkView } from '../../renderer/views/NetworkView';
import { PAGE_METAS } from '../pages.constants';

const meta: ScreenMeta = PAGE_METAS.network;

const RandomizerNetworkPage = () => <NetworkView />;

export default RandomizerNetworkPage;
export { meta };
