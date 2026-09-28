/* @layer core @kind types */
interface BaseFeatureDef<TGroup extends string = string> {
  id: string;
  label: string;
  description: string;
  userMessage?: string;
  group: TGroup;
  default: boolean;
  requires: string[];
  suggests?: string[];
  live: boolean;
}

interface ResolveResult {
  effective: Set<string>;
  autoDisabled: { id: string; missing: string[] }[];
}

export type { BaseFeatureDef, ResolveResult };
