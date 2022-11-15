module.exports = {
  // 超过最大值换行
  printWidth: 100,
  // 缩进字节数
  tabWidth: 2,
  // 使用空格缩进 不使用tab
  useTabs: false,
  // 结尾用分号(true有，false没有)
  semi: true,
  // 使用单引号(true单引号，false双引号)
  singleQuote: true,
  // 使用引号引用对象属性的时机 可选值"<as-needed|consistent|preserve>"
  quoteProps: 'as-needed',
  // 在对象，数组括号与文字之间加空格，如："{ foo: bar }"
  bracketSpacing: true,
  // 在 HTML, Vue 和 JSX 中，把`>`单独放在下一行
  bracketSameLine: false,
  // 在 HTML, Vue 和 JSX 中，强制单个属性一行
  singleAttributePerLine: true,
  // 多行时尽可能打印尾随逗号。（单行数组永远不会出现逗号结尾。） 可选值"<none|es5|all>"
  trailingComma: 'all',
  // 在JSX中使用双引号
  jsxSingleQuote: false,
  //  (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号 ,always：不省略括号
  arrowParens: 'always',
  // 换行符使用 lf 结尾是 可选值"<auto|lf|crlf|cr>"
  endOfLine: 'lf',
};
