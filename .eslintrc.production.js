module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  reportUnusedDisableDirectives: true,
  plugins: [
    'react',
    'prettier',
    'jest',
    'react-hooks',
    'import',
    'testing-library',
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'airbnb',
    'prettier',
    'prettier/react',
    'plugin:jest/recommended',
    'plugin:testing-library/react',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    browser: true,
    jest: true,
    node: true,
    es6: true,
  },
  rules: {
    'arrow-body-style': ['off'],
    'react/jsx-props-no-spreading': ['off'],
    'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
    'no-use-before-define': ['off'],

    'jsx-a11y/anchor-is-valid': ['off'],

    'jest/expect-expect': ['off'],

    'import/no-unresolved': ['off'],
    'import/no-extraneous-dependencies': ['off'],
    'import/extensions': ['off'],
    'import/prefer-default-export': ['off'],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
      },
    ],

    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
  },
};
