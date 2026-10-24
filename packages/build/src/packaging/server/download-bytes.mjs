/* @layer tooling-scripts @kind logic */

/**
 * @param {string} url
 * @returns {Promise<Buffer>} the body, or an error with the status
 */
const downloadBytes = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} answered ${response.status} ${response.statusText}`.trim());
  return Buffer.from(await response.arrayBuffer());
};

export { downloadBytes };
