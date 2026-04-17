module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^expo/virtual/env$': '<rootDir>/jest.setup.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/__tests__/**/*.test.jsx',
  ],
  collectCoverageFrom: [
    'services/**/*.{js,jsx}',
    'components/**/*.{js,jsx}',
    'screens/**/*.{js,jsx}',
    'app/lib/**/*.{js,jsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/.expo/', '/app/'],
  modulePaths: ['<rootDir>'],
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { rootMode: 'upward' }],
  },
};
