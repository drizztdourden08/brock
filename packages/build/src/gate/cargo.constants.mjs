/* @layer tooling-scripts @kind constants */
import { join } from 'node:path';

const CARGO_ENV = 'BROCK_CARGO';
const CARGO_MANIFEST = 'Cargo.toml';
const CARGO_MANIFEST_ROOT = /^\s*\[(?:workspace|package)\]/m;
const CARGO_MISSING = `cargo is not on PATH, so the cargo lane cannot run. Install Rust (https://rustup.rs), or turn the lane off with gate.cargo.enabled: false. ${CARGO_ENV} names another cargo.`;
const CLIPPY_CONFIG_FILES = ['clippy.toml', '.clippy.toml'];
const CLIPPY_LINTS = ['-D', 'warnings', '-W', 'clippy::too_many_lines', '-W', 'clippy::cognitive_complexity'];
const CLIPPY_DEFAULT_DIR = join(import.meta.dirname, 'clippy');
const RUST_SKIP_DIRS = new Set(['target', 'node_modules']);
const RUST_SOURCE = /\.rs$/;
const RUST_SAFETY = /^\/\/ SAFETY:/;
const RUST_UNSAFE = /\bunsafe\b/;
const RUST_COMMENT_RULE = 'only /// and //! doc comments are allowed; a // SAFETY: comment may sit directly above an unsafe block';

export {
  CARGO_ENV, CARGO_MANIFEST, CARGO_MANIFEST_ROOT, CARGO_MISSING, CLIPPY_CONFIG_FILES, CLIPPY_DEFAULT_DIR, CLIPPY_LINTS, RUST_COMMENT_RULE, RUST_SAFETY, RUST_SKIP_DIRS, RUST_SOURCE, RUST_UNSAFE,
};
