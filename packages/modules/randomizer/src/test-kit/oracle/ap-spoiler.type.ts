/* @layer core @kind types */
type SpoilerSphere = [string, string][];

interface ApSpoiler {
  placements: Map<string, string>;
  spheres: SpoilerSphere[];
}

interface SpoilerCursor {
  section: string;
  sphere: SpoilerSphere | null;
}

export type { ApSpoiler, SpoilerCursor, SpoilerSphere };
