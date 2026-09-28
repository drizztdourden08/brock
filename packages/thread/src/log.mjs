/* @layer tooling-scripts @kind logic */
const createLog = (name) => (message) => console.log(`[${name}] ${message}`);

const fail = (name, message) => {
  console.error(`[${name}] x ${message}`);
  return 1;
};

export { createLog, fail };
