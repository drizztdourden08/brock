/* @layer electron-main @kind logic */
class BridgeError extends Error {
  override readonly name = 'BridgeError';
}

export { BridgeError };
