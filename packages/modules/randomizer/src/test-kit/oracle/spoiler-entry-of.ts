/* @layer core @kind logic */
const splitEntry = (line: string): [string, string] | null => {
  const at = line.lastIndexOf(': ');
  return at <= 0 ? null : [line.slice(0, at).trim(), line.slice(at + 2).trim()];
};

const spoilerEntryOf = (line: string): [string, string] | null => (line.trim() === '' ? null : splitEntry(line));

export { spoilerEntryOf };
