/* @layer renderer-shell @kind types */
import type { BrandApp } from '@drizztdourden08/tessera/brand';
import type { AboutPanelHeading } from '../../../../compounds/AboutPanel';

interface AboutBrand {
  brand: BrandApp;
  heading: AboutPanelHeading;
}

export type { AboutBrand };
