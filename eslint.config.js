const eslint = require('@eslint/js');
const globals = require('globals');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  {
    ignores: ['coverage/**', 'lib/**', 'node_modules/**']
  },
  eslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2024,
      globals: globals.node,
      parser: tsParser,
      sourceType: 'module'
    }
  }
];
