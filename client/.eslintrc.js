module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/airbnb'
  ],
  rules: {
    "max-len": ["error", 120],
    "comma-dangle": ["error", "never"],
    "semi": ["error", "never"],
    "function-paren-newline": ["error", "never"],
    "no-underscore-dangle": "off",
    "no-param-reassign": ["error", { "props": true, "ignorePropertyModificationsFor": ["state", "context"] }],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
