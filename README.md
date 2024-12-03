# Phantomaton Persistence 💾

The Phantomaton Persistence module provides a flexible storage abstraction for the Phantomaton ecosystem. It allows other plugins to define and use custom storage providers, enabling a wide range of persistence options.

## Storage Extension Point 🗄️

The core of the Phantomaton Persistence module is the `storage` extension point. This extension point allows plugins to provide their own storage implementation, which can then be used by other parts of the Phantomaton system.

The `storage` extension point is optional - if no storage provider is registered, it will resolve to `undefined`. This allows Phantomaton to function without a persistence layer, if needed.

To define a custom storage provider, you can use the `plugins.define` helper:

```javascript
import plugins from 'phantomaton-plugins';
import persistence from 'phantomaton-persistence';

const myPlugin = plugins.create([
  plugins.define(persistence.storage)
    .as(new MyStorageProvider())
]);
```

The storage provider must implement the following interface:

```typescript
interface StorageProvider {
  load(id: string): Promise<any>;
  save(id: string, object: any): Promise<any>;
}
```

The `load` method should retrieve the object with the given `id`, while the `save` method should persist the provided `object` with the given `id`.

## Example Usage 📚

Here's an example of how to use the `storage` extension point in a Phantomaton plugin:

```javascript
import plugins from 'phantomaton-plugins';
import persistence from 'phantomaton-persistence';

const myPlugin = plugins.create({
  // Declare that we depend on the storage extension point
  storage: persistence.storage
}, ({ extensions }) => [
  // Define how to use the storage provider
  plugins.define(extensions.start)
    .with(extensions.storage)
    .as(async (storage) => {
      // Check if storage is available
      if (storage) {
        const data = await storage.load('my-data');
        console.log('Loaded data:', data);

        const updatedData = { ...data, new: 'value' };
        await storage.save('my-data', updatedData);
        console.log('Saved data:', updatedData);
      } else {
        console.log('No storage provider available');
      }
    })
]);
```

In this example, the plugin declares a dependency on the `persistence.storage` extension point. When the `start` extension point is resolved, it checks if a storage provider is available before using it to load and save data.

## Contributing 🦄

We welcome contributions to the Phantomaton Persistence project! If you have any ideas, bug reports, or pull requests, please feel free to submit them on the [Phantomaton Persistence GitHub repository](https://github.com/phantomaton-ai/phantomaton-persistence).

## License 🔒

The Phantomaton Persistence module is licensed under the [MIT License](LICENSE).