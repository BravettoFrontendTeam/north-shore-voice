module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  verbose: false,
  forceExit: true,
  detectOpenHandles: true,
  testTimeout: 10000,
};
