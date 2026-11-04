/* @layer core @kind logic */
const hexId = (id: number): string => '0x' + id.toString(16).padStart(2, '0');

export { hexId };
