/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  collectCoverage:true,
  coveragePathIgnorePatterns: [
    'node_modules',
    'test-config',
    'interfaces',
    'repositories',
    'middlewares',
    '<rootDir>/src/controllers/testController.ts',
    'jestGlobalMocks.ts',
    '<rootDir>/src/server.ts',
    '<rootDir>/src/database.ts',
    '<rootDir>/src/utils',
    '<rootDir>/src/config',
    '<rootDir>/tests/factories'
  ]
};
