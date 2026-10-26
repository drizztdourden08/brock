---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-electron': minor
---

A process job now keeps its full output in a log file. The outcome of `ctx.processes.run` (and `jobs.runProcess`) gains `logFile`, the path of a file under the debug folder (`process-logs`) with every cleaned, redacted line of stdout and stderr, next to the 20-line `tail`, which stays as it is. The file is bounded at 5 MiB: it keeps the start and the end and marks the gap. The new `logFile` run option sets another cap (`logFile: { maxBytes }`) or turns the file off (`logFile: false`). `log: false` also writes no file. Brock keeps the newest 20 log files and removes older ones.
