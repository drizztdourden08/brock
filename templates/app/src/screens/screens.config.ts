/* @layer renderer-app @kind config */
import { defineScreens } from '@drizztdourden08/brock-react';

export default defineScreens({
  buckets: [
    { id: 'game', title: 'Game', icon: 'gamepad-2', menu: 'entry' },
  ],
  home: 'game',
});
