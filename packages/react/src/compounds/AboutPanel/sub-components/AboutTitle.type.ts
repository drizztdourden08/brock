/* @layer renderer-shell @kind types */
import type { BrandApp } from '@drizztdourden08/tessera/brand';
import type { AboutPanelHeading } from '../AboutPanel.type';

interface AboutTitleProps {
  title: string;
  brand?: BrandApp;
  heading: AboutPanelHeading;
  wordmark?: string;
}

export type { AboutTitleProps };
