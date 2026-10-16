/* @layer renderer-app @kind config */
import { defineLayoutPreset } from '@drizztdourden08/brock-react';
import type { WidgetKitMeta } from '@drizztdourden08/brock-react';

const kit: WidgetKitMeta = {
  label: 'Layout inspector',
  icon: 'layout-dashboard',
  devOnly: true,
  layout: defineLayoutPreset({ rows: [['inspect-grid', 'main', 'inspect-pointer']], widths: [[0.2, 0.6, 0.2]] }),
};

export default kit;
