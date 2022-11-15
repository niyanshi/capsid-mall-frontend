/**
 * @see https://stylelint.io/user-guide/rules/list
 */
module.exports = {
  extends: [
    'stylelint-config-standard', // 配置stylelint拓展插件
    'stylelint-config-prettier', // 配置stylelint和prettier兼容
    'stylelint-config-recess-order', // 配置stylelint css属性书写顺序插件,
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue/scss',
  ],
  plugins: ['stylelint-scss', 'stylelint-order'],

  rules: {
    'scss/at-import-partial-extension': 'always',
    'string-quotes': 'single',
    'no-descending-specificity': null,
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts'],
};
