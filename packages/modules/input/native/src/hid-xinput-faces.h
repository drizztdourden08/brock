/* @layer electron-main @kind native */
// Tells whether a HID device is the HID face of a pad that XInput serves.
//
// On Windows a Bluetooth Xbox pad shows up twice. It is a HID device of its
// own (045e:0b13 for a Series pad), and the xinputhid driver adds a child
// HID interface whose path holds "&IG_". XInput reads that child, and SDL
// opens the pad through XInput as 045e:02ff. hidapi skips "&IG_" paths, so a
// HID listing shows only 045e:0b13, with nothing that names it as the same
// pad. Both interfaces sit in one device container, the grouping Windows
// keeps for one physical device, so the container id links them.
#pragma once

#include <string>
#include <unordered_set>

class XInputFaces {
 public:
  // Takes a snapshot of every container that holds an XInput interface.
  // Empty off Windows, where no such pairing exists.
  XInputFaces();

  // True when the HID interface at this hidapi path shares a container with
  // an XInput interface. False when the path is not a Windows interface path
  // (a libusb device, say) or Windows cannot name its container.
  bool Has(const char* hidPath) const;

 private:
  std::unordered_set<std::string> containers_;
};
