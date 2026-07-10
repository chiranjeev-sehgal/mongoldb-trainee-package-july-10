/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests', '<rootDir>/instructor/hidden-tests'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  setupFilesAfterEnv: ['<rootDir>/tests/helpers/setup.ts'],
  clearMocks: true,
  collectCoverageFrom: [
    'pages/**/*.ts',
    'lib/**/*.ts',
    'models/**/*.ts'
  ]
};
