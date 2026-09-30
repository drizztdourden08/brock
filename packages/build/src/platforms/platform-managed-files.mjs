/* @layer tooling-scripts @kind logic */
import { DEFAULT_TARGETS } from './platforms.constants.mjs';
import { resolvePlatforms } from './resolve-platforms.mjs';

/**
 * @param {import('./platform.type.mjs').PlatformContext} ctx
 * @returns {{ path: string, content: string }[]} what the chosen platforms keep in sync, one file per path
 */
const platformManagedFiles = (ctx) => {
  const { platforms } = resolvePlatforms(ctx.config.targets ?? DEFAULT_TARGETS);
  const files = platforms.flatMap((platform) => (platform.managed ? platform.managed(ctx) : []));
  return [...new Map(files.map((file) => [file.path, file])).values()];
};

export { platformManagedFiles };
