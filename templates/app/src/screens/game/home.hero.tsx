/* @layer renderer-app @kind component */
import { useAppVersion, useProduct } from '@drizztdourden08/brock-react';
import type { HeroProps, ScreenMeta } from '@drizztdourden08/brock-react';
import { Button, StatRow, Text } from '@drizztdourden08/tessera/primitives';

const meta: ScreenMeta = { title: 'Home', icon: 'house' };

const HomeHero = (props: HeroProps) => {
  const { slots, profile, open } = props;
  const { Backdrop, Art, Facts, Actions } = slots;
  const product = useProduct();
  const version = useAppVersion();
  return (
    <>
      <Backdrop>
        <Text as="h1" variant="title">{product.name}</Text>
        <Text variant="body">A blank Brock app. Every file in src/screens is a screen.</Text>
      </Backdrop>
      <Art src={product.logos.app} alt="" />
      <Facts>
        <StatRow label="Profile" value={profile?.name ?? 'None'} />
        <StatRow label="Version" value={version} />
      </Facts>
      <Actions>
        <Button variant="primary" onClick={() => open('settings')}>Settings</Button>
        <Button variant="secondary" onClick={() => open('about')}>About</Button>
      </Actions>
    </>
  );
};

export default HomeHero;
export { meta };
