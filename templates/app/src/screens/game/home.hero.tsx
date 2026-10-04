/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { useAppVersion, useProduct } from '@drizztdourden08/brock-react';
import type { HeroProps, ScreenMeta } from '@drizztdourden08/brock-react';
import { Button, Text } from '@drizztdourden08/tessera/primitives';

const meta: ScreenMeta = { title: 'Home', icon: 'house', keywords: ['start', 'overview', 'profile'] };

const HomeHero = (props: HeroProps) => {
  const { slots, profile, open } = props;
  const { Eyebrow, Title, Art, Tools, Actions, Facts, Aside } = slots;
  const product = useProduct();
  const version = useAppVersion();
  const facts = useMemo(() => [[
    { label: 'Profile', value: profile?.name ?? 'None' },
    { label: 'Version', value: version, mono: true },
  ]], [profile, version]);

  return (
    <>
      <Eyebrow>Home</Eyebrow>
      <Title>{product.name}</Title>
      <Art kind="image" src={product.logos.mark} alt="" />
      <Tools>
        <Button size="sm" variant="secondary" onClick={() => open('profiles')}>Profiles</Button>
      </Tools>
      <Actions>
        <Button variant="primary" onClick={() => open('settings')}>Settings</Button>
        <Button variant="secondary" onClick={() => open('about')}>About</Button>
      </Actions>
      <Facts rows={facts} />
      <Aside>
        <Text variant="body">A blank Brock app. Every file in src/screens is a screen.</Text>
      </Aside>
    </>
  );
};

export default HomeHero;
export { meta };
