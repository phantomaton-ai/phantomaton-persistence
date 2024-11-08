import Storage from './storage.js';
import path from 'path';
import { promises as fs } from 'fs';

class Filesystem extends Storage {
  constructor(basePath) {
    super();
    this.basePath = basePath;
  }

  async load(id) {
    const filePath = path.join(this.basePath, `${id}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  }

  async save(id, object) {
    const filePath = path.join(this.basePath, `${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(object));
  }
}

export default Filesystem;