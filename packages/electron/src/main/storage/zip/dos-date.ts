/* @layer electron-main @kind logic */
const dosDate = (date: number, time: number): Date =>
  new Date(1980 + (date >> 9), ((date >> 5) & 0x0f) - 1, date & 0x1f, time >> 11, (time >> 5) & 0x3f, (time & 0x1f) * 2);

export { dosDate };
