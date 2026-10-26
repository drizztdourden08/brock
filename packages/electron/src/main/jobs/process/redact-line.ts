/* @layer electron-main @kind logic */
const redactLine = (redact: ((line: string) => string) | undefined, line: string): string => {
  if (!redact) return line;
  try {
    return redact(line);
  } catch {
    return '[redaction failed]';
  }
};

export { redactLine };
