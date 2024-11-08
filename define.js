class Definition {
  constructor(extension, dependencies = []) {
    this.extension = extension;
    this.dependencies = dependencies;
  }

  with(...dependencies) {
    return new Definition(this.extension, [...this.dependencies, ...dependencies]);
  }

  as(value) {
    return this.extension.provider(
      this.dependencies.map(({ resolve }) => resolve),
      this.dependencies.length < 1 ?
        () => value :
        (...arrays) => value(...arrays.map(([head]) => head))
    );
  }
}

const define = extension => new Definition(extension);

export default define;