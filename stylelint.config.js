export default {
  extends: ['stylelint-config-standard', 'stylelint-config-tailwindcss'],
  ignoreFiles: ['dist/**', 'coverage/**', 'node_modules/**'],
  rules: {
    'at-rule-prelude-no-invalid': [
      true,
      {
        ignoreAtRules: [
          'apply',
          'theme',
          'source',
          'utility',
          'variant',
          'custom-variant',
          'plugin',
          'reference',
          'config',
        ],
      },
    ],
    'selector-class-pattern': null,
  },
}
