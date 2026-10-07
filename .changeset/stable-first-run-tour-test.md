---
'@drizztdourden08/brock-react': patch
---

The first-run tour test and the widget state restart test no longer depend on how busy the machine is:

- The first-run tour test imports the tour, profile and app state modules once at the top of the file. Its first restart used to load and transform brock-core's root entry and the tour modules inside the timed test, about 1.5 s on a quiet machine, which went past the 5 s limit in a busy full run. Once a test timed out, its body kept running and could swap the stubbed host and the module registry under the next tests, so a later test could fail with `expected false to be true`. Each restart now only runs the modules again, in a few milliseconds.
- The first-run tour test mocks the platform once for the whole file instead of per restart, and waits for the tour progress save by queuing an empty app state change behind it, instead of waiting 20 timer ticks.
- The widget state restart test also imports its widget modules at the top, so the widget body and the widget state hook aren't transformed inside a timed test.

No product code changed.
