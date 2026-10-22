---
"@drizztdourden08/brock-input": patch
---

A Bluetooth Xbox pad on Windows lists once. SDL opens it through XInput as `045e:02ff`, and the HID listing also showed its real id, `045e:0b13`, as a second unavailable pad. The addon now reads the Windows device container of each HID device and marks the ones that share a container with an XInput interface. The snapshot lets each open XInput pad claim one such device, so two real pads still list as two. The SDL3 addon moves to 1.2.0. An older addon sends no mark, and the list behaves as before.
