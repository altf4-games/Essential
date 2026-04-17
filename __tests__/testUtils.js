// Utility functions for testing
export const createMockMemory = (overrides = {}) => {
  return {
    id: 'test-id-' + Date.now(),
    imageUri: 'file:///test-image.jpg',
    summary: 'Test memory summary',
    tags: ['test', 'sample'],
    reminderAt: null,
    reminderNote: '',
    createdAt: new Date().toISOString(),
    location: null,
    ...overrides,
  };
};

export const createMockAppData = (overrides = {}) => {
  return {
    lastSavedSummary: 'Last saved summary',
    lastSavedAt: new Date().toISOString(),
    totalSaved: 5,
    ...overrides,
  };
};

export const createMockGeminiResponse = (text = 'Test response') => {
  return {
    candidates: [{
      content: {
        parts: [{ text }]
      }
    }]
  };
};

export const createMockFetchResponse = (data, ok = true) => {
  return {
    ok,
    json: jest.fn(() => Promise.resolve(data)),
  };
};

export const waitForAsync = () => new Promise(resolve => setImmediate(resolve));
