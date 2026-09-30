/* @layer tooling-scripts @kind logic */

/**
 * @param {string} title
 * @param {string[]} lines printed under the title; nothing when empty
 */
const sayLines = (title, lines) => {
  if (!lines.length) return;
  console.log(`create-brock: ${title}`);
  for (const line of lines) console.log(line);
};

export { sayLines };
