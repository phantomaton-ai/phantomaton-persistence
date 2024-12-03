import { expect, stub } from 'lovecraft';
import hierophant from 'hierophant';
import persistence from './phantomaton-persistence.js';
import Storage from './storage.js';

describe('Phantomaton Persistence Plugin', () => {
  let container;

  beforeEach(() => {
    container = hierophant();
    container.install(persistence.plugin());
  });

  it('provides the storage extension point', () => {
    const [getStorage] = container.resolve(persistence.storage.resolve);
    expect(getStorage).to.be.a('function');
  });

  it('allows custom storage providers', async () => {
    class MemoryStorage extends Storage {
      async load(id) {
        return { id, data: 'test' };
      }

      async save(id, object) {
        return object;
      }
    }

    const customPersistence = persistence.plugin({
      storage: plugins.create([
        plugins.define(persistence.storage).as(MemoryStorage)
      ])
    });

    container.install(customPersistence);
    const [getStorage] = container.resolve(persistence.storage.resolve);
    const storage = await getStorage();
    expect(storage).to.be.an.instanceOf(MemoryStorage);

    const loaded = await storage.load('abc');
    expect(loaded).to.deep.equal({ id: 'abc', data: 'test' });

    const saved = await storage.save('abc', { id: 'abc', data: 'updated' });
    expect(saved).to.deep.equal({ id: 'abc', data: 'updated' });
  });
});