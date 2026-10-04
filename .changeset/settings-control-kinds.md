---
'@drizztdourden08/brock-react': minor
---

Settings items take the control kinds `number` (`min`, `max`, `step`, `unit`), `text` and `password` (`placeholder`), `select` (`options`, `searchable`), `radio` and `tags` (`suggestions`, `placeholder`), each mapped to the Tessera `SettingsRow` input of the same name. A `choice` control takes `look: 'segmented' | 'select' | 'radio'` and is drawn as a select when it has more than three options, a segmented control otherwise. In development a row that resolves to no control logs a warning once instead of drawing nothing in silence.
