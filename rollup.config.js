import resolve from '@rollup/plugin-node-resolve';

export default [
{
  input: './src/model.js',
  output: [
    {
      format: 'esm',
      file: './dist/model_bundle.js'
    },
  ],
  plugins: [
    resolve(),
  ]
}
];