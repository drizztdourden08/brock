/* @layer renderer-app @kind component */
import { useProduct } from '@drizztdourden08/brock-react';
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { Stack, Text } from '@drizztdourden08/tessera/primitives';

const meta: ScreenMeta = { title: 'Credits', icon: 'file-text', requiresProfile: false };

const CreditsCard = () => {
  const product = useProduct();
  return (
    <Stack>
      <Text as="h2" variant="title">{product.name}</Text>
      <Text variant="body">Built on Brock, with the Tessera design system for every screen and control.</Text>
    </Stack>
  );
};

export default CreditsCard;
export { meta };
