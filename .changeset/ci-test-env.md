---
'@drizztdourden08/brock-build': minor
---

Set up the Linux test job of the managed ci.yml. `workflows.testEnv` in `brock.config.ts` takes `linuxPackages`, Debian package names that the `quality` job installs with `apt-get install -y --no-install-recommends` before the build (checked with the pattern `server.osPackages` uses), and `userNamespaces: true`, which adds the step that sets `kernel.apparmor_restrict_unprivileged_userns=0` so a test can run a real bubblewrap sandbox. The step is the one the `review` job runs, now shared. It is a sibling of `workflows.ci` because that key is the `managed` or `own` mode. An app that sets neither option gets the same ci.yml as before. `docs/architecture.md` says that `server.osPackages: ['bubblewrap']` already reaches the `.deb` `Depends` and the Docker image, and lists the `docker run` and compose security options a container running bubblewrap needs.
