/* @layer core @kind logic */
const sanitizePackName = (value: string): string =>
  value.replace(/[<>:"/\\|?*]|(?![\u007f-\u009f])\p{Cc}/gu, '').replace(/\s+/g, ' ').trim();

export { sanitizePackName };
