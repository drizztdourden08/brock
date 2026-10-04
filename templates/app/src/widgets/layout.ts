/* @layer renderer-app @kind config */
import { defineLayoutPreset } from '@drizztdourden08/brock-react';

const layout = defineLayoutPreset({
  rows: [['main', 'notes']],
  widths: [[0.76, 0.24]],
});

export default layout;
