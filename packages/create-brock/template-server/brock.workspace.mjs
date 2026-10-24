/* @layer root-config @kind config */
import { defineWorkspace, serverTarget } from '@drizztdourden08/brock-thread';

export default defineWorkspace({
  name: 'brock-template-app',
  base: 'main',
  targets: {
    app: serverTarget({ app: '.' }),
  },
});
