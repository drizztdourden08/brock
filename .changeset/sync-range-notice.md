---
"@drizztdourden08/brock-build": patch
---

brock sync now prints one line per package when it moves a dependency range off the brock.version pin, naming the old range, the new range and `brock upgrade`, and brock migrate warns when --report lands outside --root because it is relative to the current directory.
