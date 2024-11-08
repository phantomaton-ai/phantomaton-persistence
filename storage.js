class Storage {
  async load(id) {
    throw new Error('load method not implemented');
  }

  async save(id, object) {
    throw new Error('save method not implemented');
  }
}

export default Storage;