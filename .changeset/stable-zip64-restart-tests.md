---
'@drizztdourden08/brock-electron': patch
'@drizztdourden08/brock-react': patch
---

Two tests no longer depend on how busy the machine is:

- The data export zip64 test no longer writes a real zip of 65,540 files. The zip writer and its end record take the zip64 limits (`{ count, bytes }`, 65535 entries and 4 GB by default), so the test sets a limit of 4 entries, writes 3 and then 5 small files, and checks that only the second zip carries the zip64 end record and its locator, that the classic end record holds the 0xFFFF marker, and that the reader follows the locator back to all 5 entries. A separate check covers the default switch at 65535 entries on the end record alone. The written zips are unchanged.
- The screen state restart test imports the persistence modules once at the top of the file. Its first restart used to load and transform Tessera's whole composites entry (through the widget layout store) inside the timed test, which took 20 to 30 s on a quiet machine and could pass the 60 s limit on a busy one. The first import is now part of collecting the file, which has no time limit, and each restart only runs the modules again, in under a second.
