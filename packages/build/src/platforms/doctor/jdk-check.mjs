/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { JDK_MAJOR } from './doctor.constants.mjs';
import { installHint } from './install-hint.mjs';

const javaOf = (env) => (env.JAVA_HOME ? join(env.JAVA_HOME, 'bin', 'java') : 'java');

const majorOf = (out) => {
  const version = /version "(\d+)(?:\.(\d+))?/.exec(out);
  if (!version) return null;
  return version[1] === '1' ? Number(version[2]) : Number(version[1]);
};

/**
 * @returns {import('../platform.type.mjs').DoctorCheck}
 */
const jdkCheck = () => ({
  label: `JDK ${JDK_MAJOR}`,
  run: (ctx) => {
    const { ok, out } = ctx.probe(javaOf(ctx.env), ['-version']);
    const major = ok ? majorOf(out) : null;
    if (major === JDK_MAJOR) return { status: 'ok', detail: `JDK ${major}` };
    const detail = major ? `JDK ${major} found; the Capacitor Gradle build wants ${JDK_MAJOR}` : undefined;
    return { status: 'missing', detail, install: installHint('jdk', ctx.host) };
  },
});

export { jdkCheck };
