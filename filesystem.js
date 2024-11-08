import Storage from './storage.js';
import path from 'path';
import { promises as fs } from 'fs';

class Filesystem extends Storage {
  constructor(directory) {
    super();
    this.directory = directory;
  }

  async load(id) {
    const file = path.join(this.directory, `${id}.json`);
    const data = await fs.readFile(file, 'utf-8');
    return JSON.parse(data);
  }

  async save(id, object) {
    const file = path.join(this.directory, `${id}.json`);
    await fs.writeFile(file, JSON.stringify(object));
  }
}

export default Filesystem;