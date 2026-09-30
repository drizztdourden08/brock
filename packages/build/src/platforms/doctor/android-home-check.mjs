/* @layer tooling-scripts @kind logic */
import { installHint } from './install-hint.mjs';
import { sdkRoot } from './sdk-root.mjs';

/**
 * @returns {import('../platform.type.mjs').DoctorCheck}
 */
const androidHomeCheck = () => ({
  label: 'ANDROID_HOME (Android SDK)',
  run: (ctx) => {
    const root = sdkRoot(ctx.env);
    if (root) return { status: 'ok', detail: root };
    const set = ctx.env.ANDROID_HOME ?? ctx.env.ANDROID_SDK_ROOT;
    return { status: 'missing', detail: set ? `${set} does not exist` : 'not set', install: installHint('androidHome', ctx.host) };
  },
});

export { androidHomeCheck };
