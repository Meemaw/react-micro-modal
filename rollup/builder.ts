/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import path from 'path';

import { createRollupConfig, Options } from './createRollupConfig';
import { writeCjsEntryFile, getNameFromMain } from './writeCjsEntry';

type Format = 'cjs' | 'esm' | 'umd';

type FormatOptions = Pick<Options, 'env' | 'format'>;
type BaseOption = Pick<FormatOptions, 'env'>;

const OPTIONS: Record<Format, BaseOption[]> = {
  cjs: [{ env: 'development' }, { env: 'production' }],
  esm: [{}],
  umd: [{ env: 'development' }, { env: 'production' }],
};

type Config = {
  name: string;
  packageName: string;
  source: string;
  formats: Format[];
};

const prepare = ({ name, formats, source, packageName }: Config) => {
  const uniqueFormats = [...new Set(formats)];
  const rollupOptions = uniqueFormats.reduce((acc: FormatOptions[], format) => {
    const formatOptions = OPTIONS[format].map((o: BaseOption) => ({
      ...o,
      format,
    }));
    return [...acc, ...formatOptions];
  }, []);

  return rollupOptions.map((option: FormatOptions) =>
    createRollupConfig({
      ...option,
      input: source,
      name,
      tsconfig: 'tsconfig.build.json',
      packageName,
    })
  );
};

export const bundle = () => {
  const pkg = require(path.join(process.cwd(), 'package.json'));
  const formats: Format[] = ['cjs'];
  const name = getNameFromMain(pkg.main);

  if (pkg.module || pkg['jsnext:main']) {
    formats.push('esm');
  }

  if (pkg['umd:main']) {
    formats.push('umd');
  }

  writeCjsEntryFile(pkg.main);

  return prepare({ name, formats, source: pkg.source, packageName: pkg.name });
};
