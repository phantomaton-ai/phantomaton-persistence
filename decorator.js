import sigilium from 'sigilium';

const decorator = (base, storage) => {
  const sigil = sigilium.sigil(`${base.name}:persistence`);

  const resolver = base.resolver();
  base.resolver = () => ({
    ...resolver,
    dependencies: [...resolver.dependencies, sigil.resolve],
    factory: (impls, decorators = [], [persistenceImpl]) => {
      const instance = resolver.factory(impls, decorators);
      return new Proxy(instance, {
        get: (target, property, receiver) => {
          if (property === 'advance') {
            return async (...args) => {
              const result = await target[property](...args);
              await storage.save(target.id, target);
              return result;
            };
          }
          return Reflect.get(target, property, receiver);
        }
      });
    }
  });

  base.persistence = sigil;
  return base;
};

export default decorator;