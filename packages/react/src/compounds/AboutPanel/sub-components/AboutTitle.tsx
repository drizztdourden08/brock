/* @layer renderer-shell @kind component */
import { BrandWordmark } from '@drizztdourden08/tessera/brand';
import { Image } from '@drizztdourden08/tessera/primitives';
import type { AboutTitleProps } from './AboutTitle.type';

const AboutTitle = (props: AboutTitleProps) => {
  const { title, brand, heading, wordmark } = props;
  if (wordmark) return <Image className="about-panel__wordmark-image" src={wordmark} alt={title} fit="contain" placeholder="none" />;
  if (brand && heading === 'wordmark') return <BrandWordmark app={brand} size="md" title={title} className="about-panel__wordmark" />;
  return title;
};

export { AboutTitle };
