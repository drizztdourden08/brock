/* @layer electron-main @kind logic */
const regPathValue = (output: string, env: NodeJS.ProcessEnv): string => {
  const raw = /^\s*Path\s+REG_(?:EXPAND_)?SZ\s+(.*)$/im.exec(output)?.[1]?.trim() ?? '';
  return raw.replace(/%([^%]+)%/g, (whole, name: string) => env[name] ?? whole);
};

export { regPathValue };
