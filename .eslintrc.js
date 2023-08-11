module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', '@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2021,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      files: ['*.js', '*.ts', '*.jsx', '*.tsx'],
      rules: {
        curly: 'error',
      },
    },
  ],
};
