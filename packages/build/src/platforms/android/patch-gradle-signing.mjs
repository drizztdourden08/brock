/* @layer tooling-scripts @kind logic */
import { fillTemplate } from '../../release/fill-template.mjs';
import { ANDROID_TEMPLATES } from './android.constants.mjs';
import { APPLY_PLUGIN, BUILD_TYPES, KEYSTORE_LINE, RELEASE_TYPE, SIGN_RELEASE } from './gradle.constants.mjs';

/**
 * @param {string} gradle mobile/android/app/build.gradle
 * @returns {string | null} the patched file, or null when an anchor is missing
 */
const patchGradleSigning = (gradle) => {
  if (!APPLY_PLUGIN.test(gradle) || !BUILD_TYPES.test(gradle) || !RELEASE_TYPE.test(gradle)) return null;
  const signing = fillTemplate(ANDROID_TEMPLATES, 'signing-config.gradle.tmpl', {});
  return gradle
    .replace(APPLY_PLUGIN, (line) => `${line}${KEYSTORE_LINE}`)
    .replace(BUILD_TYPES, (line) => `${signing}${line}`)
    .replace(RELEASE_TYPE, (line) => `${line}${SIGN_RELEASE}`);
};

export { patchGradleSigning };
