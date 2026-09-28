/* @layer renderer-shell @kind component */
import { useBrock } from '../../../app/useBrock';
import { About } from '../../../shell/About/About';
import { useAboutInfo } from '../../../shell/About/behavior/useAboutInfo';
import { defineScreen } from '../../define-screen';
import type { ScreenDef } from '../../screen.type';
import type { AboutScreenOptions } from './AboutScreen.type';

const AboutScreenBody = (props: AboutScreenOptions) => {
  const { legalText } = props;
  const { product, logoSrc } = useBrock();
  const { version, rows, copyText } = useAboutInfo();
  return (
    <About productName={product.name} version={version} logoSrc={logoSrc} rows={rows} legalText={legalText} copyText={copyText} />
  );
};

const createAboutScreen = (options: AboutScreenOptions): ScreenDef => defineScreen({
  id: 'about',
  title: 'About',
  requiresProfile: false,
  render: () => <AboutScreenBody legalText={options.legalText} />,
});

export { createAboutScreen };
