/* @layer tooling-scripts @kind logic */
import { fillTemplate } from '../../release/fill-template.mjs';
import { ANDROID_TEMPLATES } from './android.constants.mjs';
import { APPLY_PLUGIN, JSON_IMPORT, VERSION_CODE, VERSION_NAME } from './gradle.constants.mjs';

/**
 * @param {string} gradle mobile/android/app/build.gradle
 * @returns {string | null} the patched file, or null when an anchor is missing
 */
const patchVersionCode = (gradle) => {
  if (!APPLY_PLUGIN.test(gradle) || !VERSION_CODE.test(gradle) || !VERSION_NAME.test(gradle)) return null;
  const header = fillTemplate(ANDROID_TEMPLATES, 'version-header.gradle.tmpl', {});
  const imported = gradle.includes(JSON_IMPORT) ? gradle : `${JSON_IMPORT}\n\n${gradle}`;
  return imported
    .replace(APPLY_PLUGIN, (line) => `${line}${header}`)
    .replace(VERSION_CODE, 'versionCode appVersionCode')
    .replace(VERSION_NAME, 'versionName appVersionName');
};

export { patchVersionCode };
