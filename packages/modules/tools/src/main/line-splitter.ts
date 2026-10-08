/* @layer electron-main @kind logic */
const lineSplitter = (emit: (line: string) => void): { push: (text: string) => void; end: () => void } => {
  let rest = '';
  return {
    push: (text) => {
      const parts = (rest + text).split(/\r\n|\r|\n/);
      rest = parts.pop() ?? '';
      for (const line of parts) emit(line);
    },
    end: () => {
      if (rest) emit(rest);
      rest = '';
    },
  };
};

export { lineSplitter };
