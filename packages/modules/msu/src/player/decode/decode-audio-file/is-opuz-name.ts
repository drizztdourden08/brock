/* @layer core @kind logic */
const isOpuzName = (fileName: string): boolean => /\.opuz$/i.test(fileName);

export { isOpuzName };
