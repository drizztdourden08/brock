/* @layer tooling-scripts @kind logic */
import { chainLabeler, chainsMessage, forbiddenChains } from './main-process-chains.mjs';
import { mainProcessRules } from './main-process-rules.mjs';

/**
 * @param {{ rootDir: string, bundle: string, options?: { forbid?: string[], allow?: string[] } }} input bundle and options from brock.config.ts
 * @returns {import('vite').Plugin} fails the build on renderer-only code
 */
const mainProcessGuard = ({ rootDir, bundle, options }) => {
  const rules = mainProcessRules(rootDir, options);
  const label = chainLabeler(rootDir);
  const specifiers = new Map();
  const blocked = new Set();
  return {
    name: 'brock-main-process-guard',
    enforce: 'pre',
    buildStart() {
      specifiers.clear();
      blocked.clear();
    },
    async resolveId(source, importer, resolveOptions) {
      if (!importer || !rules.forbidsSpecifier(source)) return null;
      specifiers.set(importer, (specifiers.get(importer) ?? new Set()).add(source));
      const target = await this.resolve(source, importer, { ...resolveOptions, skipSelf: true });
      if (target) blocked.add(target.id);
      return null;
    },
    buildEnd(error) {
      if (error) return;
      const chains = forbiddenChains({ graph: this, specifiers, blocked, rules, label });
      if (chains.length > 0) this.error(chainsMessage(chains, bundle));
    },
  };
};

export { mainProcessGuard };
