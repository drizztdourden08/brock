/* @layer root-config @kind config */
import { defineWorkspace, electronTarget, brockProfile } from '@drizztdourden08/brock-thread';

export default defineWorkspace({
  name: 'brock-template-app',
  base: 'main',
  targets: {
    app: electronTarget({ app: '.' }),
  },
  provision: [brockProfile()],
});
