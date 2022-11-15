module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript/recommended',
    'prettier',
    'plugin:sonarjs/recommended',
  ],
  plugins: ['sonarjs'],
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },

  rules: {
    'vue/multi-word-component-names': [
      'error',
      {
        ignores: ['index'],
      },
    ],

    /* ------------ 以下规则适应sonar扫描 -------------*/
    // 1. 缩进: 使用两个空格
    indent: ['error', 2],
    // 2. 引号：使用单引号
    quotes: ['error', 'single'],
    // 3. 分号：使用分号
    semi: ['error', 'always'],
    // 4. 命名：小驼峰
    camelcase: 'error',
    // 4. 命名：构造函数使用大驼峰
    'new-cap': 'error',

    // 5. 变量：不允许有未使用的变量
    '@typescript-eslint/no-unused-vars': 'error',
    // 7. 变量：使用 let、const 来声明变量
    'no-undef': 'error',
    // 8. 变量：每个变量声明要有单独的 const 或 let
    'one-var': ['error', 'never'],
    // 9. 变量：不要尝试更新 const 声明的常量
    'no-const-assign': 'error',
    // 10. 变量：尽可能使用 const，避免 var
    'prefer-const': 'error',
    // 11. 变量：变量需要重新赋值，使用 let 替代 var
    'no-var': 'error',
    // 12. 变量：只对对象属性使用 delete
    'no-delete-var': 'error',
    // 13. 变量：不要重复声明变量
    'no-redeclare': 'error',
    // 14. 变量：变量一定要先声明后使用
    'no-use-before-define': 'error',
    // 16. 变量：变量不应该自我赋值
    'no-self-assign': 'error',
    // 17. 变量：变量不应该被覆盖
    'no-shadow': 'error',
    // 18. 变量：undefined 不能赋值给变量
    'no-undef-init': 'error',
    // 19. 变量：一些特殊的标识符不能够被重新赋值
    'no-undefined': 'error',
    'no-shadow-restricted-names': 'error',

    // 20. 对象：使用字面量创建对象
    'no-new-object': 'error',
    // 21. 对象：不要使用包装对象
    'no-new-wrappers': 'error',
    // 22. 对象：使用方法简写
    'object-shorthand': 'error',
    // 26. 对象：get 和 set 需要配对出现
    'accessor-pairs': 'error',
    // 27. 对象：setter 不应该返回值
    'no-setter-return': 'error',
    // 28. 对象：避免重复的 key
    'no-dupe-keys': 'error',
    // 29. 对象：使用解构赋值来获取属性值
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: true,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    // 30. 对象：解构赋值模式不能为空
    'no-empty-pattern': 'error',
    // 31. 对象：Symbol 不能作为构造函数
    'no-new-symbol': 'error',

    // 32. 数组：使用数组字面量
    'no-array-constructor': 'error',
    // 36. 数组：避免稀疏数组
    'no-sparse-arrays': 'error',
    // 37. 数组：数组的 map、filter、reduce 等方法的回调函数需要有 return 语句
    'array-callback-return': 'error',

    // 42. 函数：不要在非函数块（if、while 语句块等）中声明函数
    'no-loop-func': 'error',
    'no-inner-declarations': 'error',
    // 43. 函数：函数体不能为空
    'no-empty-function': 'error',
    // 44. 函数实现的圈复杂度不能太高
    complexity: ['error', 10],
    // 48. 函数：函数不能包含太多代码（默认最多 200 行）
    'max-lines-per-function': ['error', 200],
    // 49. 函数：函数不能有太多的参数（默认最多 7 个）
    'max-params': ['error', 7],
    // 50. 函数：generator 应该有 yield 语句
    'require-yield': 'error',
    // 52. 函数：不要使用 arguments，用...代替
    'prefer-rest-params': 'error',
    // 53. 函数：默认参数赋值放在最后
    'default-param-last': 'error',
    // 54. 函数：不要用Function创建函数
    'no-new-func': 'error',
    // 56. 函数：不要修改参数
    'no-param-reassign': 'error',
    // 57. 函数：如果函数体只有一个无副作用的表达式语句，删除大括号和 return
    // 'arrow-parens': ['error', 'as-needed'],
    'arrow-body-style': ['error', 'as-needed'],
    // 58. 函数：避免使用 arguments.callee 和 arguments.caller
    'no-caller': 'error',
    // 59. 函数：不要有重复的参数
    'no-dupe-args': 'error',
    // 62. 函数：函数应该返回相同的类型
    'consistent-return': 'error',
    // 64. 函数：避免不必要的 "await"
    'no-return-await': 'error',

    // 65. 字符串：使用字符串模板而不是字符串拼接
    'prefer-template': 'error',
    // 66. 字符串：不要使用多行字符串
    'no-multi-str': 'error',
    // 67. 字符串：模板字符串语法不能在普通字符串中使用
    'no-template-curly-in-string': 'error',

    // 72. 类：避免重复类成员
    'no-dupe-class-members': 'error',
    // 74. 类：继承的类如果有构造函数，一定要调用 super
    'constructor-super': 'error',
    // 75. 类：类实例化后需要被引用
    'no-new': 'error',

    // 77. 模块：一个路径只 import 一次
    'no-duplicate-imports': 'error',

    // 83. 空格：行末不要有空格
    'no-trailing-spaces': 'error',
    // 84. 空格：文件以一个空行结尾
    'eol-last': ['error', 'always'],

    // 85. 逗号：使用尾逗号
    'comma-dangle': ['error', 'only-multiline'],

    // 86. 控制语句：for 循环的表达式中应该要修改循环计数器
    'no-unmodified-loop-condition': 'error',
    // 87. 控制语句：for 循环的计数器增减方向应该正确
    'for-direction': 'error',
    // 89. 避免无限循环
    // 92. 控制语句：只执行一次的循环应该被重构
    'no-unreachable-loop': 'error',
    // 95. 控制语句：for...in 循环应该过滤属性
    'guard-for-in': 'error',
    // 96. 控制语句：不应该在子表达式中进行赋值
    'no-cond-assign': 'error',
    // 99. 控制语句：不要在 finally 语句块中使用跳转语句
    'no-unsafe-finally': 'error',
    // 102. 控制语句：if...else if 语句不能有相同的条件
    'no-dupe-else-if': 'error',
    // 104. 控制语句：所有代码都应该有可能被执行
    'no-unreachable': 'error',
    // 105. 控制语句：case 语句块中需要使用 break
    'no-fallthrough': 'error',
    // 106. 控制语句：不要使用 label 语句
    'no-labels': 'error',
    // 107. 控制语句：switch 语句需要有 default 从句
    'default-case': 'error',
    // 110. 控制语句：default 从句应该放在最后
    'default-case-last': 'error',

    // 112. 运算符：使用 === 代替 ==
    eqeqeq: 'error',
    // 120. 运算符：位运算符不能和逻辑运算符混用
    'no-bitwise': 'error',
    // 122. 运算符：逗号运算符不应该被使用
    'no-sequences': 'error',
    // 123. 运算符：注意 ! 运算符和 in instanceof 的运算顺序
    'no-unsafe-negation': 'error',
    // 125. 运算符：三元运算符不能嵌套
    'no-nested-ternary': 'error',

    // 128. 代码块：用大括号包裹多行代码块
    curly: ['error', 'multi-line'],
    // 129. 代码块：else 和 if 的闭括号在同一行
    'brace-style': 'error',
    // 131. 代码块：代码块不能为空
    'no-empty': 'error',

    // 133. 异常处理：只 throw Error 对象
    'no-throw-literal': 'error',

    // 135. 安全：不要使用 alert
    'no-alert': 'error',
    // 136. 安全：不要有 debugger 语句
    'no-debugger': 'error',
    // 137. 安全：不要使用 eval
    'no-eval': 'error',

    // 149. 其他：不要使用 NaN 做比较
    'use-isnan': 'error',
    // 150. 其他：parseInt 需要第二个参数
    radix: 'error',
    // 151. 其他：不要使用全局的 this 对象
    'no-invalid-this': 'error',
    // 152. 其他：不要使用 with 语句
    'no-with': 'error',
    // 154. 其他：不要使用八进制
    'no-octal': 'error',
    // 155. 其他：不用使用魔数
    'no-magic-numbers': ['error', { ignore: [0, -1, 1] }],
    // 156. 其他：不要在生产环境中使用 console.log
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    // 157. 其他：一行不能太长（默认最长 180 个字符）
    'max-len': ['error', { code: 180, tabWidth: 2 }],
    // 160. 其他：避免多余的圆括号
    '@typescript-eslint/no-extra-parens': 'error',
    // 161. 其他：多余的分号应该被移除
    'no-extra-semi': 'error',
    // 162. 其他：但文件不应该包含太多行代码（默认最多 1000 行）
    'max-lines': ['error', 1000],
    // 163. 其他：控制流语句不能嵌套太深（默认最多 3 层）
    'max-depth': ['error', 3],
    // 164. 注释不应该放到行尾
    'line-comment-position': ['error', { position: 'above' }],
  },
};
