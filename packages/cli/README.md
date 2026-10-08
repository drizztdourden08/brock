<!-- @layer docs @kind doc -->
# @drizztdourden08/brock

The global `brock` command. It is installed once per machine, from GitHub Packages:

```
npm config set @drizztdourden08:registry https://npm.pkg.github.com
npm install -g @drizztdourden08/brock
```

You rarely type `brock` yourself. Every Brock repo carries its own command (`my-app`,
`tessera`), and that command reaches this one. The first run of a repo's command
on a machine without Brock offers to install it.

## What it runs

```
brock <anything>           the project's own brock-build, found by walking up from the current folder
                           to node_modules/@drizztdourden08/brock-build; outside a project, or before
                           pnpm install, the brock-build this package carries
brock create <dir> [...]   create-brock, the scaffolder
brock --version            this package's version, and the project's brock-build version inside one
```

A project always runs the Brock version it pinned. When the project's `brock-build` major
differs from the one this package carries, `brock` prints one line with the matching
install command (`npm install -g @drizztdourden08/brock@<major>`) and carries on.

`upgrade` is the one exception to the pinned version. When the project's `brock-build`
is too old to have the verb, `brock upgrade` runs the one this package carries.
