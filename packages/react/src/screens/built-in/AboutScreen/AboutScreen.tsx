/* @layer renderer-shell @kind component */
import { AboutPanel } from '@drizztdourden08/tessera/composites';
import { useBrock } from '../../../app/useBrock';
import { writeClipboard } from '../../../host/write-clipboard';
import { useAboutInfo } from '../../../shell/About/behavior/useAboutInfo';
import { defineScreen } from '../../define-screen';
import type { ScreenDef } from '../../screen.type';
import type { AboutScreenOptions } from './AboutScreen.type';

const AboutScreenBody = (props: AboutScreenOptions) => {
  const { legalText } = props;
  const { product, logoSrc } = useBrock();
  const { rows, copyText } = useAboutInfo();
  return (
    <AboutPanel title={product.name} logo={logoSrc} rows={rows} legal={legalText} copyText={copyText} onCopy={writeClipboard} />
  );
};

const createAboutScreen = (options: AboutScreenOptions): ScreenDef => defineScreen({
  id: 'about',
  title: 'About',
  requiresProfile: false,
  render: () => <AboutScreenBody legalText={options.legalText} />,
});

export { createAboutScreen };
