/* @layer renderer-app @kind component */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { useProduct, useT } from '@drizztdourden08/brock-react';
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { Stack, Text } from '@drizztdourden08/tessera/primitives';

const meta: ScreenMeta = { title: msg('app:credits.title'), icon: 'file-text', requiresProfile: false, size: 'info' };

const CreditsCard = () => {
  const product = useProduct();
  const t = useT();
  return (
    <Stack>
      <Text as="h2" variant="title">{product.name}</Text>
      <Text variant="body">{t('app:credits.body')}</Text>
    </Stack>
  );
};

export default CreditsCard;
export { meta };
