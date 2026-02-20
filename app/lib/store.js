import { configureStore, createSlice } from '@reduxjs/toolkit';

// --- Memories Slice ---
const memoriesSlice = createSlice({
  name: 'memories',
  initialState: {
    memories: [],
    filter: 'all', // 'all', 'recent', 'tagged'
  },
  reducers: {
    addMemory: (state, action) => {
      state.memories.unshift({
        id: Date.now().toString(),
        imageUri: action.payload.imageUri || null,
        summary: action.payload.summary || '',
        tags: action.payload.tags || [],
        createdAt: new Date().toISOString(),
      });
    },
    removeMemory: (state, action) => {
      state.memories = state.memories.filter(m => m.id !== action.payload);
    },
    clearAll: (state) => {
      state.memories = [];
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
});

export const { addMemory, removeMemory, clearAll, setFilter } = memoriesSlice.actions;

// --- Store ---
const store = configureStore({
  reducer: {
    memories: memoriesSlice.reducer,
  },
});

export default store;
