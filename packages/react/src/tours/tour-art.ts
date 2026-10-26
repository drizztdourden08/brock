/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { Icon } from '@drizztdourden08/tessera/primitives';
import { ProductMark } from './ProductMark';
import { TOUR_ART_ICON_SIZE } from './tours.constants';
import type { TourArtIcon, TourStepArt } from './tour.type';

const isIconToken = (art: TourStepArt): art is TourArtIcon =>
  typeof art === 'object' && art !== null && 'icon' in art && typeof art.icon === 'string';

const tourArt = (art: TourStepArt): ReactNode => {
  if (art === 'product-mark') return createElement(ProductMark);
  if (isIconToken(art)) return createElement(Icon, { name: art.icon, size: TOUR_ART_ICON_SIZE });
  return art;
};

export { tourArt };
