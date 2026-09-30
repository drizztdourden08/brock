/* @layer renderer-shell @kind logic */
const titleCase = (id: string): string =>
  id.split(/[-_]/).filter((word) => word !== '').map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(' ');

export { titleCase };
