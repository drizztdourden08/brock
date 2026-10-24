/* @layer electron-main @kind logic */
import { resolve } from 'path';
import { IDENTITY_FLAGS } from '@drizztdourden08/brock-core/automation';
import { ARG_PREFIX } from '../app/user-data-arg.constants';

const isIdentityArg = (arg: string): boolean => IDENTITY_FLAGS.some((flag) => arg === flag || arg.startsWith(`${flag}=`));

const carriedLaunchArgs = (argv: readonly string[]): string[] =>
  argv.flatMap((arg) => {
    if (arg.startsWith(ARG_PREFIX)) return [`${ARG_PREFIX}${resolve(arg.slice(ARG_PREFIX.length))}`];
    return isIdentityArg(arg) ? [arg] : [];
  });

export { carriedLaunchArgs };
