/* @layer renderer-shell @kind logic */
const pad = (value: number): string => value.toString().padStart(2, '0');

const formatClockTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

export { formatClockTime };
