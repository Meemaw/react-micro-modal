import type { Config } from '@jest/types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pack = require('./package');

const config: Config.InitialOptions = {
  roots: ['<rootDir>/src'],
  transform: {
    '.ts': 'ts-jest',
  },
  coveragePathIgnorePatterns: ['/node_modules/'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  displayName: pack.name,
  name: pack.name,
  testEnvironment: 'jest-environment-jsdom-sixteen',
  globals: {
    'ts-jest': { tsconfig: 'tsconfig.jest.json' },
  },
};

export default config;
