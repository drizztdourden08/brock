/* @layer electron-main @kind logic */
let counter = 0;

const zStamps = {
  main: 0,
  next: (): number => {
    counter += 1;
    return counter;
  },
};

export { zStamps };
