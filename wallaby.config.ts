// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.env.example' });

module.exports = () => ({
  files: ['src/**/*.ts', '!__tests__/**'],
  tests: ['__tests__/unit/**/*.unit.test.ts'],
  runMode: 'onsave',
  autoDetect: true,
});
