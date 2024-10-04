import * as parser from '@typescript-eslint/parser'
import antfu from '@antfu/eslint-config'

export default antfu({
  languageOptions: {
    parser,
    parserOptions: { extraFileExtensions: ['.json'], project: 'tsconfig.eslint.json' },
  },
  rules: {
    'import/order': 0,
    'perfectionist/sort-exports': 'error',
    'perfectionist/sort-imports': ['error', {
      groups: ['type', 'builtin', 'external', 'internal-type', 'internal', 'parent-type', 'sibling-type', 'index-type', 'parent', 'sibling', 'index', 'object', 'unknown'],
      order: 'asc',
      type: 'natural',
    }],
    'perfectionist/sort-interfaces': 'error',
    'perfectionist/sort-object-types': 'error',
    'perfectionist/sort-objects': 'error',
    'style/function-paren-newline': ['error', 'multiline'],
    'style/padded-blocks': ['error', 'always', { allowSingleLineBlocks: true }],
    'style/padding-line-between-statements': ['error', { blankLine: 'always', next: '*', prev: ['block', 'block-like'] }],
    'ts/consistent-type-imports': ['error', { prefer: 'no-type-imports' }],
    'ts/naming-convention': [
      'error',
      {
        filter: {
          match: false,
          regex: '^_.*$',
        },
        format: ['camelCase', 'PascalCase', 'snake_case', 'UPPER_CASE'],
        selector: 'default',
      },
      {
        format: ['PascalCase', 'UPPER_CASE'],
        selector: 'enum',
      },
      {
        format: ['PascalCase', 'UPPER_CASE'],
        selector: 'enumMember',
      },
      {
        format: ['camelCase', 'UPPER_CASE', 'PascalCase', 'snake_case'],
        selector: 'variable',
      },
      {
        format: ['PascalCase'],
        prefix: ['I'],
        selector: 'interface',
      },
      {
        format: ['PascalCase'],
        selector: 'typeLike',
      },
      {
        format: ['camelCase'],
        leadingUnderscore: 'forbid',
        modifiers: ['private'],
        selector: 'memberLike',
      },
      {
        format: ['PascalCase'],
        prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
        selector: 'variable',
        types: ['boolean'],
      },
    ],
    'unicorn/no-array-for-each': 'error',
    'unicorn/no-for-loop': 'error',
    'unicorn/no-thenable': 'error',
    'unicorn/no-useless-spread': 'error',
    'unicorn/no-useless-switch-case': 'error',
  },
  ignores: ['migrations/**', 'eslint.config.mjs', 'tsconfig*.json', 'package.json'],
})
