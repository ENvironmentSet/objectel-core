import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { name, index as input, main as cjs, unpkg as umd, module as es, dependencies } from './package.json';

const outputs = [
  { file: cjs, format: 'cjs' },
  { file: es, format: 'es' },
  { file: es.replace(/.js$/, '.mjs'), format: 'es' },
  { file: umd, format: 'umd', name },
];

const toConfig = output => ({
  input,
  output: { indent: false, ...output },
  plugins: [
    nodeResolve(),
    babel(),
  ],
  external: Object.keys(dependencies || {}),
});

export default outputs.map(toConfig);