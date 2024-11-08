const expose = object => Object.keys(object).reduce(
  (extensions, key) => ({ ...extensions, [key]: object[key](key) }),
  {}
);

export default expose;