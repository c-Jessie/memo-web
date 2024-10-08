module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    eqeqeq: 2, //必须使用 === 和 !==
    "no-empty-function": 2, //禁止空函数
    "no-multi-spaces": 2, //禁止使用多个空格
    "no-trailing-spaces": 2, //禁止禁用行尾空格
    "space-infix-ops": 2, // 要求操作符周围有空格
    "space-in-parens": 2, //强制在圆括号内使用一致的空格
    "no-var": 2, //要求使用 let 或 const 而不是 var,
    "no-unused-vars": 2, //禁止出现未使用过的变量
    "react/prop-types": 0, //防止在react组件定义中缺少props验证
  },
  // 别名配置
  settings: {
    "import/resolver": {
      alias: {
        map: [["@", "./src"]],
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
      },
    },
  },
};
