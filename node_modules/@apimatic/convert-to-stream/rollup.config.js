import typescript from 'rollup-plugin-typescript2';
const packageJson = require('./package.json');

const createTsPlugin = ({ declaration = true, target } = {}) =>
  typescript({
    clean: true,
    tsconfigOverride: {
      compilerOptions: {
        declaration,
        ...(target && { target })
      }
    }
  });

const createNpmConfig = ({ input, output, external }) => ({
  input,
  output,
  preserveModules: true,
  plugins: [createTsPlugin({ declaration: true })],
  external
});

export default [
  createNpmConfig({
    input: 'src/index.ts',
    output: [
      {
        dir: 'es',
        format: 'esm'
      }
    ]
  })
];
