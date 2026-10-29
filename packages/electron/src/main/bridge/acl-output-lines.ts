/* @layer electron-main @kind logic */
const aclOutputLines = (output: Buffer): string[] =>
  output
    .toString('latin1')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

export { aclOutputLines };
