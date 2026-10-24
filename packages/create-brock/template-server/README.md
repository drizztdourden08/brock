<!-- @layer docs @kind doc -->
# Brock App

A blank Brock server. It has no window. `server/main.ts` calls `runServer`, and
`server/start.ts` holds the start function and the data domains.

```
pnpm install
pnpm build
pnpm start -- --user-data=.user-data
```

The data folder comes from `--user-data=`, then `BROCK_DATA_DIR`, then the systemd
`STATE_DIRECTORY`, then `./.user-data`. `node dist/server/main.mjs health` exits 0
while the server is up.

`pnpm package` writes the Linux tarball, and the `.deb` when run on Linux with
`dpkg-deb`.
