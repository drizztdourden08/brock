/* @layer electron-main @kind logic */
const parseRegValue = (stdout: string, name: string): { type: string; value: number } | null => {
  const match = new RegExp(`^\\s*${name}\\s+(REG_\\w+)\\s+(\\S+)`, 'm').exec(stdout);
  const [, type, raw] = match ?? [];
  if (type === undefined || raw === undefined) return null;
  const value = raw.toLowerCase().startsWith('0x') ? Number.parseInt(raw, 16) : Number.parseInt(raw, 10);
  return Number.isFinite(value) ? { type, value } : null;
};

export { parseRegValue };
