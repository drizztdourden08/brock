/* @layer tooling-scripts @kind config */
import { definePlatform } from '../define-platform.mjs';
import { androidHomeCheck } from '../doctor/android-home-check.mjs';
import { jdkCheck } from '../doctor/jdk-check.mjs';
import { sdkPackagesCheck } from '../doctor/sdk-packages-check.mjs';
import { webViteConfigFile } from '../web/web-vite-config-file.mjs';
import { androidReleaseJob } from './android-release-job.mjs';
import { ANDROID_SECRETS } from './android.constants.mjs';
import { capAddAndroid } from './cap-add-android.mjs';
import { capacitorAssets } from './capacitor-assets.mjs';
import { capacitorConfig } from './capacitor-config.mjs';
import { capacitorPackages } from './capacitor-packages.mjs';
import { gradlePatch } from './gradle-patch.mjs';
import { SIGNING_MARKER, VERSION_MARKER } from './gradle.constants.mjs';
import { mobileIgnores } from './mobile-ignores.mjs';
import { patchGradleSigning } from './patch-gradle-signing.mjs';
import { patchVersionCode } from './patch-version-code.mjs';

const androidPlatform = definePlatform({
  id: 'android',
  label: 'Android',
  doctor: [jdkCheck(), androidHomeCheck(), sdkPackagesCheck()],
  scaffold: [
    capacitorPackages(),
    mobileIgnores(),
    capAddAndroid(),
    capacitorAssets(),
    gradlePatch({ name: 'Gradle signing from the environment', marker: SIGNING_MARKER, patch: patchGradleSigning }),
    gradlePatch({ name: 'versionCode from package.json', marker: VERSION_MARKER, patch: patchVersionCode }),
  ],
  managed: (ctx) => [capacitorConfig(ctx), webViteConfigFile()],
  releaseJob: androidReleaseJob,
  secrets: ANDROID_SECRETS,
  secretsHint: 'run your app command with mobile keystore: it makes the keystore with keytool once you agree and prints the gh secret set lines',
});

export { androidPlatform };
