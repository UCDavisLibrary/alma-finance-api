import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class WebpackUtils {
  constructor() {
    this.publicDir = path.join(__dirname, '../public');
    this.root = __dirname;
    this.entry = path.join(__dirname, '../src/elements/alma-finance-app.js');
    this.bundleName = 'alma-finance.js';
    this.clientModules = [];
  }

  jsDir(isDist) {
    return path.join(this.publicDir, 'js', isDist ? 'dist' : 'dev');
  }

  removeJsDir(isDist) {
    const jsDir = this.jsDir(isDist);
    if (fs.existsSync(jsDir)) {
      fs.rmSync(jsDir, { recursive: true, force: true });
    }
  }
}

export default new WebpackUtils();
