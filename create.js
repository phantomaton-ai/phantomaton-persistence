import expose from './expose.js';

const create = (...args) => {
  // Initialize defaults
  let components = {};
  let instantiate = config => undefined;
  let install = () => [];

  // Parse arguments based on their type
  args.forEach((arg, index) => {
    if (typeof arg === 'object' && !Array.isArray(arg)) {
      components = arg;
    } else if (Array.isArray(arg)) {
      install = () => arg;
    } else if (typeof arg === 'function') {
      if (index === args.length - 1) {
        install = arg;
      } else {
        instantiate = arg;
      }
    }
  });

  // Create the plugin
  const extensions = expose(components);
  const plugin = configuration => {
    const instance = instantiate(configuration);
    const context = { configuration, extensions, instance };
    return {
      install: [
        ...Object.values(extensions).map(extension => extension.resolver()),
        ...(typeof install === 'function' ? install(context) : install)
      ],
      instance
    };
  };

  // Expose extension points on the plugin function
  Object.keys(extensions).forEach(key => {
    plugin[key] = extensions[key];
  });
  
  return plugin;
};

export default create;