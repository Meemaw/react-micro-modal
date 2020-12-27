/* eslint-disable global-require */
import path from 'path';

import external from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import sourcemaps from 'rollup-plugin-sourcemaps';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import type { ModuleFormat } from 'rollup';

import { safePackageName } from './safePackageName';
import { pascalcase } from './pascalcase';

export type Options = {
  packageName: string;
  input: string;
  format: ModuleFormat;
  name?: string;
  umdName?: string;
  minify?: boolean;
  env?: string;
  tsconfig?: string;
};

export const createRollupConfig = (options: Options) => {
  const name = options.name || safePackageName(options.packageName);
  const umdName =
    options.umdName || pascalcase(safePackageName(options.packageName));

  const shouldMinify = options.minify || options.env === 'production';
  const tsconfigPath = options.tsconfig || 'tsconfig.json';

  const outputName = [
    path.join('dist', name),
    options.format,
    options.env,
    shouldMinify ? 'min' : '',
    'js',
  ]
    .filter(Boolean)
    .join('.');

  const plugins = [
    external(),
    typescript({ typescript: require('typescript'), tsconfig: tsconfigPath }),
    resolve({ mainFields: ['browser', 'jsnext:main', 'module', 'main'] }),
  ];

  if (options.format === 'umd') {
    plugins.push(commonjs({ include: /\/node_modules\// }));
  }

  if (options.env !== undefined) {
    plugins.push(
      replace({ 'process.env.NODE_ENV': JSON.stringify(options.env) })
    );
  }

  plugins.push(sourcemaps());

  if (shouldMinify) {
    plugins.push(
      terser({
        format: { comments: false },
        compress: { drop_console: true },
      })
    );
  }

  return {
    input: options.input,
    output: {
      file: outputName,
      format: options.format,
      name: umdName,
      sourcemap: true,
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
      exports: 'named',
    },
    plugins,
  };
};
