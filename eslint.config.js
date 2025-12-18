import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      // TypeScript specific
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          // varsIgnorePattern intentionally omitted - unused vars should be removed, not prefixed
        },
      ],
      '@typescript-eslint/no-unused-private-class-members': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',

      // Code style
      'no-nested-ternary': 'error',
      'prefer-const': 'error',
      'no-var': 'error',

      // Error prevention
      'no-debugger': 'error',
      eqeqeq: ['error', 'always'],
      'no-throw-literal': 'error',
      'no-param-reassign': 'error',
      'no-return-assign': 'error',

      // Best practices
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
    },
  },
  {
    files: ['tests/**/*.ts', 'tests/**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      // TypeScript specific
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          // varsIgnorePattern intentionally omitted - unused vars should be removed, not prefixed
        },
      ],
      '@typescript-eslint/no-unused-private-class-members': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',

      // Code style
      'no-nested-ternary': 'error',
      'prefer-const': 'error',
      'no-var': 'error',

      // Error prevention
      eqeqeq: ['error', 'always'],
    },
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    rules: {
      'no-nested-ternary': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
    },
  },
  {
    ignores: ['dist/', 'coverage/', 'run/'],
  },
);
