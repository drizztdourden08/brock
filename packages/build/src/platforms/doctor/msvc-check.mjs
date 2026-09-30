/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { VC_TOOLS, VSWHERE } from '../../packaging/packaging.constants.mjs';
import { installHint } from './install-hint.mjs';

/**
 * @returns {import('../platform.type.mjs').DoctorCheck}
 */
const msvcCheck = () => ({
  label: 'MSVC C++ tools (installer)',
  hosts: ['win32'],
  run: (ctx) => {
    const found = existsSync(VSWHERE) ? ctx.probe(VSWHERE, ['-latest', '-products', '*', '-requires', VC_TOOLS, '-property', 'installationPath']) : null;
    if (found?.ok && found.out) return { status: 'ok', detail: found.out.split('\n')[0] };
    return { status: 'missing', install: installHint('msvc', ctx.host) };
  },
});

export { msvcCheck };
