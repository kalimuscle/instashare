

module.exports = {
    setupFiles: ['./jest.setup.js'],
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
      },
      moduleFileExtensions: ['js', 'jsx'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  };