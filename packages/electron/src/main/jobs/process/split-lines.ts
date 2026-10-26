/* @layer electron-main @kind logic */
const splitLines = (emit: (line: string) => void, max: number): { push: (text: string) => void; end: () => void } => {
  let rest = '';
  const flush = (line: string): void => emit(line.length > max ? line.slice(0, max) : line);
  return {
    push: (text) => {
      const parts = (rest + text).split(/\r\n|\r|\n/);
      rest = parts.pop() ?? '';
      for (const line of parts) flush(line);
      if (rest.length > max) {
        flush(rest);
        rest = '';
      }
    },
    end: () => {
      if (rest) flush(rest);
      rest = '';
    },
  };
};

export { splitLines };
