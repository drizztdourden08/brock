/* @layer root-config @kind config */
import { brockEslint } from '@drizztdourden08/brock-lint-config';

export default brockEslint({
  presets: ['react-app'],
  rawColorOffGlobs: ['electron/**'],
  ignores: ['dist/**', 'release/**', '.brock/**'],
});
