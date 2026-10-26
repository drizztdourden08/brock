/* @layer renderer-shell @kind component */
import { useContext } from 'react';
import { Logo } from '@drizztdourden08/tessera/brand';
import { Image } from '@drizztdourden08/tessera/primitives';
import { BrockContext } from '../../app/brock-context';
import { aboutBrand } from '../../screens/built-in/AboutScreen/behavior/about-brand';

const ProductMark = () => {
  const value = useContext(BrockContext);
  if (!value) return null;
  const { product, logoSrc } = value;
  const branded = aboutBrand(product);
  if (branded) return <Logo brand={branded.brand} variant="mark" rim={product.icons.rim} size="xl" title="" />;
  return <Image src={logoSrc} alt="" placeholder="none" />;
};

export { ProductMark };
