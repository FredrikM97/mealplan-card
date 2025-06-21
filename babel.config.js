module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { version: '2023-05', decoratorsBeforeExport: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }]
  ]
};
