/* @layer renderer-shell @kind component */
import { AboutPanel } from '@drizztdourden08/tessera/composites';
import { useBrock } from '../../../app/useBrock';
import { useAboutInfo } from '../../../shell/About/behavior/useAboutInfo';
import { defineScreen } from '../../define-screen';
import type { ScreenDef } from '../../screen.type';
import { aboutBrand } from './behavior/about-brand';
import type { AboutScreenOptions } from './AboutScreen.type';

const AboutScreenBody = (props: AboutScreenOptions) => {
  const { legalText } = props;
  const { product, logoSrc } = useBrock();
  const { rows, copyText } = useAboutInfo();
  const brand = aboutBrand(product);
  return (
    <AboutPanel title={product.name} brand={brand} logo={brand ? undefined : logoSrc} rows={rows} legal={legalText} copyText={copyText} />
  );
};

const createAboutScreen = (options: AboutScreenOptions): ScreenDef => defineScreen({
  id: 'about',
  title: 'About',
  requiresProfile: false,
  render: () => <AboutScreenBody legalText={options.legalText} />,
});

export { createAboutScreen };
