/* @layer electron-main @kind logic */
let depth = 0;

const clusterTow = {
  run: (place: () => void): void => {
    depth += 1;
    try {
      place();
    } finally {
      depth -= 1;
    }
  },
  active: (): boolean => depth > 0,
};

export { clusterTow };
