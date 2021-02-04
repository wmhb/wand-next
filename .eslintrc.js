module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb'
  ],
  rules: {
    'max-len': ['error', 140],
    'comma-dangle': ['error', 'never'],
    semi: ['error', 'never'],
    'function-paren-newline': ['error', 'never'],
    'no-underscore-dangle': 'off',
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state', 'context'] }],
    'no-shadow': ['error', { allow: ['state'] }],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    // Workaround for ESLint failing to parse files with template literals
    // with this error: "TypeError: Cannot read property 'range' of null"
    "template-curly-spacing": "off",
    "indent": ["error", 2, {
      "ignoredNodes": ["TemplateLiteral"]
    }]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
