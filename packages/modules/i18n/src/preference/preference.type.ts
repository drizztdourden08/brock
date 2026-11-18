/* @layer core @kind types */
type StateInput = {
  readonly preference: string | null;
  readonly systemTags: readonly string[];
  readonly offered: readonly string[];
  readonly base: string;
};

export type { StateInput };
