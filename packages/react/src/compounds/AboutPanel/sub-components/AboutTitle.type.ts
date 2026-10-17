/* @layer renderer-shell @kind types */
import type { BrandApp } from '@drizztdourden08/tessera/brand';
import type { AboutPanelHeading, AboutPanelWordmarkRendering } from '../AboutPanel.type';

interface AboutTitleProps {
  title: string;
  brand?: BrandApp;
  heading: AboutPanelHeading;
  wordmark?: string;
  wordmarkRendering?: AboutPanelWordmarkRendering;
}

export type { AboutTitleProps };
