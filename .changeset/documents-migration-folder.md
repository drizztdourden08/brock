---
'@drizztdourden08/brock-build': patch
---

Brock 0.81.0 filed the migration documents-access-async under 0.80.0, so an app that upgraded from 0.80.x to 0.81.0 never ran it; it is now filed under 0.81.0. An app already on 0.81.0 runs it with `brock migrate --run documents-access-async`, a new option that runs one migration by id at any version. A keep test now fails when a migration folder is older than the release whose changelog first names it.
