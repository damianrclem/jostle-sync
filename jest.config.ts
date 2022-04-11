let config: object;
switch (process.env.TEST_TYPE) {
  case 'integration':
    console.log(`running integration tests`);
    config = {
      globalSetup: './__tests__/integration/setup/globalSetup.ts',
      globalTeardown: './__tests__/integration/setup/globalTeardown.ts',
      testMatch: ['**/__tests__/integration/**/*.test.ts'],
      testTimeout: 60 * 1000, // 60 second timeout
    };
    break;
  default:
    // default to unit tests
    console.log(`running unit tests`);
    config = {
      testMatch: ['**/__tests__/unit/**/*unit.test.ts'],
    };
}

module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '/__tests__/utils'],
  ...config,
};
