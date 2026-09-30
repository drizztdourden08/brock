/* @layer tooling-scripts @kind logic */
import { MIN_DOTNET_MAJOR } from './doctor.constants.mjs';
import { installHint } from './install-hint.mjs';

const sdkMajors = (out) => out.split('\n').map((line) => Number(line.trim().split('.')[0])).filter((major) => major > 0);

/**
 * @param {NodeJS.Platform[]} hosts
 * @returns {import('../platform.type.mjs').DoctorCheck}
 */
const dotnetCheck = (hosts) => ({
  label: `.NET ${MIN_DOTNET_MAJOR} SDK (for vpk)`,
  hosts,
  run: (ctx) => {
    const { ok, out } = ctx.probe('dotnet', ['--list-sdks']);
    const majors = ok ? sdkMajors(out) : [];
    if (majors.some((major) => major >= MIN_DOTNET_MAJOR)) return { status: 'ok', detail: `SDK ${Math.max(...majors)}` };
    return { status: 'missing', install: installHint('dotnet', ctx.host) };
  },
});

export { dotnetCheck };
