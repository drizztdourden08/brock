---
'@drizztdourden08/brock-input': minor
---

The input renderer exports ControllerReportDialog, the guided controller report dialog. Pass it to ControllerReportHost through renderDialog. The app injects the reporter identity, the debug text and a submit function, so the dialog holds no product name or endpoint. The filed report type now carries an optional recordUrl in place of sanctuaryUrl, with a recordLinkLabel prop for its button. Rumble tests and the report device card action were already exported.
