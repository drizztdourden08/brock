---
'@drizztdourden08/brock-port-kit': minor
---

A port session takes a schedule option, 'display' or 'timer', for its frame loop at start. PortSession.setSchedule switches the live loop, so a V-Sync toggle applies without a restart.
