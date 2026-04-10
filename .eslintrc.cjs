module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'no-underscore-dangle': 'off',
    'prefer-const': 'off',
    'prefer-template': 'off',
    'no-plusplus': 'off',
    'import/extensions': 'off',
    'indent': ['error', 2],
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2],
    'max-len': ['error', { code: 120 }],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'react/jsx-one-expression-per-line': 'off',
    'arrow-parens': ['error', 'as-needed'],
  },
};
