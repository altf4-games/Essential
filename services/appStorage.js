import AsyncStorage from '@react-native-async-storage/async-storage';

const APP_META_KEY = 'essential_app_meta_v1';

const DEFAULT_META = {
  lastSavedSummary: '',
  lastSavedAt: null,
  totalSaved: 0,
};

export async function getMinimalAppData() {
  try {
    const raw = await AsyncStorage.getItem(APP_META_KEY);
    if (!raw) {
      return DEFAULT_META;
    }

    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_META,
      ...(parsed || {}),
    };
  } catch {
    return DEFAULT_META;
  }
}

export async function setMinimalAppData(data) {
  const next = {
    ...DEFAULT_META,
    ...(data || {}),
  };
  await AsyncStorage.setItem(APP_META_KEY, JSON.stringify(next));
  return next;
}

export async function updateAfterMemorySaved(summary, totalSaved) {
  return setMinimalAppData({
    lastSavedSummary: summary || '',
    lastSavedAt: new Date().toISOString(),
    totalSaved: Number.isFinite(totalSaved) ? totalSaved : 0,
  });
}

export async function clearMinimalAppData() {
  await AsyncStorage.removeItem(APP_META_KEY);
}
