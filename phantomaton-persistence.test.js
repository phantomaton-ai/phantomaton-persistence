import { expect, stub } from 'lovecraft';
import hierophant from 'hierophant';
import plugins from 'phantomaton-plugins';

import persistence from './phantomaton-persistence.js';

describe('Phantomaton Persistence Plugin', () => {
  let container;

  beforeEach(() => {
    const plugin = persistence();
    container = hierophant();
    plugin.install.forEach(extension => container.install(extension));
  });

  it('provides an optional storage extension point', () => {
    const [getStorage] = container.resolve(persistence.storage.resolve);
    expect(getStorage).to.be.undefined;
  });

  it('allows custom storage providers', async () => {
    class MemoryStorage {
      async load(id) {
        return { id, data: 'test' };
      }

      async save(id, object) {
        return object;
      }
    }

    const plugin = plugins.create([
      plugins.define(persistence.storage).as(new MemoryStorage())
    ])();
    plugin.install.forEach(extension => container.install(extension));

    const [storage] = container.resolve(persistence.storage.resolve);
    expect(storage).to.be.an.instanceOf(MemoryStorage);

    const loaded = await storage.load('abc');
    expect(loaded).to.deep.equal({ id: 'abc', data: 'test' });

    const saved = await storage.save('abc', { id: 'abc', data: 'updated' });
    expect(saved).to.deep.equal({ id: 'abc', data: 'updated' });
  });
});