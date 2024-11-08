import sigilium from 'sigilium';
import priestess from 'priestess';

import create from './create.js';
import define from './define.js';

const { composite, singleton } = sigilium;
const { start, input } = priestess;

export default { create, define, composite, singleton, start, input };