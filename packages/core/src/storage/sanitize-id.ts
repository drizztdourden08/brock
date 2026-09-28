/* @layer core @kind logic */
const sanitizeId = (id: string): string => id.replace(/[^A-Za-z0-9_-]/g, '_');

export { sanitizeId };
