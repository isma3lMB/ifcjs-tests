import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'index_proto.js',
  output: [
    {
      format: 'esm',
      file: 'bundle.js'
    },
  ],
  plugins: [
    resolve(),
  ]
};