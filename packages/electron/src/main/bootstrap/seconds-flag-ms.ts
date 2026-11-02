/* @layer electron-main @kind logic */
const secondsFlagMs = (name: string, value: string | null, fallbackMs: number): { ms: number; problem: string | null } => {
  if (value === null) return { ms: fallbackMs, problem: null };
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds > 0) return { ms: Math.round(seconds * 1000), problem: null };
  return { ms: fallbackMs, problem: `${name}=${value} is not a count of seconds above 0; waiting ${fallbackMs / 1000} s` };
};

export { secondsFlagMs };
