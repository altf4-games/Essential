process.env.EXPO_USE_UNSAFE_FAST_CREATE = 'true';

jest.mock('expo/virtual/env', () => ({
  env: process.env,
}), { virtual: true });

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {},
  },
}), { virtual: true });

jest.mock('expo-linking', () => ({
  createURL: jest.fn(),
  getInitialURL: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  parseURL: jest.fn(),
}), { virtual: true });

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
    navigate: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useLocalSearchParams: jest.fn(() => ({})),
  Stack: { Screen: jest.fn() },
  Tabs: { Screen: jest.fn() },
}), { virtual: true });

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
}), { virtual: true });

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(() => 
    Promise.resolve({
      execAsync: jest.fn(() => Promise.resolve()),
      runAsync: jest.fn(() => Promise.resolve()),
      getFirstAsync: jest.fn(() => Promise.resolve(null)),
      getAllAsync: jest.fn(() => Promise.resolve([])),
    })
  ),
}), { virtual: true });

jest.mock('expo-image-picker', () => ({
  launchCameraAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
  requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
}), { virtual: true });

jest.mock('expo-file-system', () => ({
  documentDirectory: '/test/',
  readAsStringAsync: jest.fn(),
}), { virtual: true });

jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  TouchableOpacity: 'TouchableOpacity',
  TextInput: 'TextInput',
  StyleSheet: { create: (obj) => obj },
  FlatList: 'FlatList',
  Modal: 'Modal',
  ScrollView: 'ScrollView',
  Pressable: 'Pressable',
  Animated: {
    View: 'View',
    Value: class { constructor() { this.setValue = jest.fn(); } },
    timing: jest.fn(() => ({ start: jest.fn() })),
    spring: jest.fn(() => ({ start: jest.fn() })),
    parallel: jest.fn(() => ({ start: jest.fn() })),
  },
  Alert: {
    alert: jest.fn(),
  },
}), { virtual: true });

global.fetch = global.fetch || jest.fn();
