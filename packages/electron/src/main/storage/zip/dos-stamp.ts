/* @layer electron-main @kind logic */
const dosStamp = (when: Date): { time: number; date: number } => ({
  time: (when.getHours() << 11) | (when.getMinutes() << 5) | Math.floor(when.getSeconds() / 2),
  date: ((Math.max(when.getFullYear(), 1980) - 1980) << 9) | ((when.getMonth() + 1) << 5) | when.getDate(),
});

export { dosStamp };
