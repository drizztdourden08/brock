/* @layer tooling-scripts @kind logic */

/**
 * @param {string | undefined} text
 * @returns {number | null} a slot of 0 or more, or null
 */
const parseSlot = (text) => {
  const trimmed = text?.trim() ?? '';
  const slot = Number(trimmed);
  return trimmed && Number.isInteger(slot) && slot >= 0 ? slot : null;
};

export { parseSlot };
