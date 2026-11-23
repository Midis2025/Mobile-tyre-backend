const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'src', 'services', 'mtc-templates');
const dest = path.join(__dirname, '..', 'dist', 'src', 'services', 'mtc-templates');

if (fs.existsSync(src)) {
  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
  console.log('[Build] Successfully copied mtc-templates to dist/src/services/mtc-templates');
}
