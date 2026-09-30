/* @layer root-config @kind config */
import { defineBrockConfig } from '@drizztdourden08/brock-build/config';

export default defineBrockConfig({
  product: {
    id: 'brock-template-app',
    name: 'Brock App',
    appId: 'com.drizztdourden08.brock-template-app',
    description: 'A blank Brock app.',
    author: { name: 'drizztdourden_', email: 'drizztdourden08@users.noreply.github.com' },
    icons: { brand: 'brock' },
  },
  targets: ['desktop'],
  modules: ['updater'],
});
