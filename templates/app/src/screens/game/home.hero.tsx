/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { msg } from '@drizztdourden08/brock-core/i18n';
import { useAppVersion, useProduct, useT } from '@drizztdourden08/brock-react';
import type { HeroProps, ScreenMeta } from '@drizztdourden08/brock-react';
import { Button, Text } from '@drizztdourden08/tessera/primitives';

const meta: ScreenMeta = { title: msg('app:home.title'), icon: 'house', keywords: ['start', 'overview', 'profile'] };

const HomeHero = (props: HeroProps) => {
  const { slots, profile, open } = props;
  const { Eyebrow, Title, Art, Tools, Actions, Facts, Aside } = slots;
  const product = useProduct();
  const version = useAppVersion();
  const t = useT();
  const facts = useMemo(() => [[
    { label: t('app:home.fact.profile'), value: profile?.name ?? t('app:home.fact.none') },
    { label: t('app:home.fact.version'), value: version, mono: true },
  ]], [profile, version, t]);

  return (
    <>
      <Eyebrow>{t('app:home.eyebrow')}</Eyebrow>
      <Title>{product.name}</Title>
      <Art kind="image" src={product.logos.mark} alt="" />
      <Tools>
        <Button size="sm" variant="secondary" onClick={() => open('profiles')}>{t('app:home.profiles')}</Button>
      </Tools>
      <Actions>
        <Button variant="primary" onClick={() => open('settings')}>{t('app:home.settings')}</Button>
        <Button variant="secondary" onClick={() => open('about')}>{t('app:home.about')}</Button>
      </Actions>
      <Facts rows={facts} />
      <Aside>
        <Text variant="body">{t('app:home.aside')}</Text>
      </Aside>
    </>
  );
};

export default HomeHero;
export { meta };
