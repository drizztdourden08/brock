/* @layer mcp-helper @kind logic */
const helperLog = (line: string): void => {
  process.stderr.write(`[brock-mcp] ${new Date().toISOString()} ${line}\n`);
};

export { helperLog };
