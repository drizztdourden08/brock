/* @layer tooling-scripts @kind logic */
import { fillTemplate } from '../../release/fill-template.mjs';
import { ANDROID_TEMPLATES } from './android.constants.mjs';

/**
 * @param {import('../platform.type.mjs').JobContext} ctx
 * @returns {import('../platform.type.mjs').Job} JDK 21, the SDK, cap sync and a signed assembleRelease
 */
const androidReleaseJob = (ctx) => ({
  id: 'build-android',
  downloads: [{ glob: 'artifacts/release-android/*.apk', label: 'Android APK, to sideload (allow installs from this source)' }],
  text: fillTemplate(ANDROID_TEMPLATES, 'android-release-job.yml.tmpl', {
    SETUP: ctx.setup('linux', { release: true }),
    APK: `${ctx.prefix}android.apk`,
  }),
});

export { androidReleaseJob };
