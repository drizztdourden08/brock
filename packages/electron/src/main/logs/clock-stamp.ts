/* @layer electron-main @kind logic */
const pad = (value: number, width = 2): string => String(value).padStart(width, '0');

const clockStamp = (at: Date = new Date()): string =>
  `${pad(at.getHours())}:${pad(at.getMinutes())}:${pad(at.getSeconds())}.${pad(at.getMilliseconds(), 3)}`;

export { clockStamp };
