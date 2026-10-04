/* @layer renderer-shell @kind component */
import { Logo } from '@drizztdourden08/tessera/brand';
import { Image } from '@drizztdourden08/tessera/primitives';
import type { AboutLogoProps } from './AboutLogo.type';

const AboutLogo = (props: AboutLogoProps) => {
  const { brand, rim, logo } = props;
  if (brand) return <Logo brand={brand} variant={rim ? 'mark' : 'app-icon'} rim={rim} size="xl" title="" className="about-panel__mark" />;
  return logo ? <Image className="about-panel__logo" src={logo} alt="" placeholder="none" /> : null;
};

export { AboutLogo };
