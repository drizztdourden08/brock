/* @layer core @kind types */
import type { BaseFeatureDef, ResolveResult } from './feature.type';

interface FeatureResolver<T extends BaseFeatureDef> {
  byId: Readonly<Record<string, T>>;
  resolve: (enabled: Iterable<string>) => ResolveResult;
  requirementClosure: (id: string, enabled: ReadonlySet<string>) => T[];
  suggestionsFor: (id: string, enabled: ReadonlySet<string>) => T[];
  resolveGates: (requested: Iterable<string>, isLocked: (def: T) => boolean) => ResolveResult;
}

export type { FeatureResolver };
