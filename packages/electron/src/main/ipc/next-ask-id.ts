/* @layer electron-main @kind logic */
const askIds = { last: 0 };

const nextAskId = (): number => {
  askIds.last += 1;
  return askIds.last;
};

export { nextAskId };
