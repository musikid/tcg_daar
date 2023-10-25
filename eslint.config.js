import { antfu } from '@antfu/eslint-config'
import unocss from '@unocss/eslint-plugin'
import glob from 'fast-glob'
import chaiFriendly from 'eslint-plugin-chai-friendly'

export default antfu(
  {
    gitignore: {
      files: glob.sync('**/.gitignore', { deep: 2 }),
    },
  },
  unocss.configs.flat,
  {
    files: ['packages/contracts/**/*.test.ts'],
    plugins: {
      'chai-friendly': chaiFriendly,
    },
    rules: {
      "no-unused-expressions": 0,
      "chai-friendly/no-unused-expressions": 2
    },
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
      },
    },
  },
)
