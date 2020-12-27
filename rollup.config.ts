import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import sourceMaps from 'rollup-plugin-sourcemaps';
import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('./package.json');

export const getNamgeFromPkg = () => {
  const split = pkg.name.split('/');
  const filename = split[split.length - 1];
  return filename.split('.')[0];
};

export default {
  input: pkg.source,
  output: [
    {
      file: pkg.main,
      name: camelCase(getNamgeFromPkg()),
      format: 'umd',
      sourcemap: true,
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ typescript: require('typescript') }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps(),
    terser({
      output: { comments: false },
      compress: {
        pure_getters: true,
      },
      warnings: true,
      ecma: 5,
      // Compress and/or mangle variables in top level scope.
      // @see https://github.com/terser-js/terser
      toplevel: true,
    }),
  ],
};
