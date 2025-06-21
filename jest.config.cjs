module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/tests/**/*.test.ts'],
  setupFilesAfterEnv: [],
  transformIgnorePatterns: [
    '/node_modules/(?!(lit|lit-html|@lit|@open-wc|lit-element|lit-element/lit-element.js|lit-html/is-server.js)/)'
  ],
  globals: {
    'ts-jest': {
      useESM: true
    }
  }
};
