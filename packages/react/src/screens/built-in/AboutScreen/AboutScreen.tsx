/* @layer renderer-shell @kind component */
import { InfoScreen } from '@drizztdourden08/tessera/composites';
import { Icon } from '@drizztdourden08/tessera/primitives';
import { useBrock } from '../../../app/useBrock';
import { AboutPanel } from '../../../compounds/AboutPanel';
import { useAboutInfo } from '../../../shell/About/behavior/useAboutInfo';
import { defineScreen } from '../../define-screen';
import type { ScreenDef } from '../../screen.type';
import { aboutBrand } from './behavior/about-brand';
import type { AboutScreenBodyProps, AboutScreenOptions } from './AboutScreen.type';
import { ABOUT_SCREEN_TITLE } from './AboutScreen.constants';

const AboutScreenBody = (props: AboutScreenBodyProps) => {
  const { legalText, onClose } = props;
  const { product, logoSrc } = useBrock();
  const { rows, copyText } = useAboutInfo();
  const branded = aboutBrand(product);
  return (
    <InfoScreen title={ABOUT_SCREEN_TITLE} onClose={onClose} footer={legalText}>
      <AboutPanel
        title={product.name}
        brand={branded?.brand}
        rim={branded ? product.icons.rim : undefined}
        heading={branded?.heading}
        logo={branded ? undefined : logoSrc}
        rows={rows}
        copyText={copyText}
      />
    </InfoScreen>
  );
};

const createAboutScreen = (options: AboutScreenOptions): ScreenDef => defineScreen({
  id: 'about',
  title: ABOUT_SCREEN_TITLE,
  icon: <Icon name="info" />,
  layer: 'own',
  header: 'none',
  requiresProfile: false,
  render: ({ close }) => <AboutScreenBody legalText={options.legalText} onClose={close} />,
});

export { createAboutScreen };
