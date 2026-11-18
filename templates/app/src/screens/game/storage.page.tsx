/* @layer renderer-app @kind component */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { StoragePage } from '@drizztdourden08/brock-react';
import type { ScreenMeta } from '@drizztdourden08/brock-react';

const meta: ScreenMeta = { title: msg('app:storage.title'), icon: 'hard-drive', order: 9, keywords: ['data', 'disk', 'folder', 'export', 'import', 'clean'] };

const StorageScreen = () => <StoragePage />;

export default StorageScreen;
export { meta };
