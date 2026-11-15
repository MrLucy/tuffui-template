export default {
  extends: ['stylelint-config-standard', 'stylelint-config-tailwindcss'],
  ignoreFiles: ['dist/**', 'coverage/**', 'node_modules/**'],
  overrides: [
    {
      files: ['src/styles/**/*.css'],
      rules: {
        // Independent component classes and responsive overrides share leaf
        // selectors; comparing their specificity without the DOM is misleading.
        'no-descending-specificity': null,
      },
    },
  ],
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
