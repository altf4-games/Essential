import React, { useReducer } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { addMemory } from './lib/store';
import { useTheme } from './lib/ThemeContext';

// --- useReducer: manages multi-step capture form ---
const initialState = {
  step: 'capture',   // 'capture' | 'summarize' | 'done'
  imageUri: null,
  summary: '',
  tags: [],
  tagInput: '',
};

function captureReducer(state, action) {
  switch (action.type) {
    case 'SET_IMAGE':
      return { ...state, imageUri: action.payload, step: 'summarize' };
    case 'SET_SUMMARY':
      return { ...state, summary: action.payload };
    case 'SET_TAG_INPUT':
      return { ...state, tagInput: action.payload };
    case 'ADD_TAG':
      if (!state.tagInput.trim() || state.tags.includes(state.tagInput.trim())) return state;
      return { ...state, tags: [...state.tags, state.tagInput.trim()], tagInput: '' };
    case 'REMOVE_TAG':
      return { ...state, tags: state.tags.filter(t => t !== action.payload) };
    case 'SUBMIT':
      return { ...state, step: 'done' };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export default function CaptureScreen() {
  const [state, dispatch] = useReducer(captureReducer, initialState);
  const reduxDispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();

  const handleCapture = () => {
    // Simulate capturing an image
    const fakeUri = `memory_${Date.now()}.jpg`;
    dispatch({ type: 'SET_IMAGE', payload: fakeUri });
  };

  const handleSubmit = () => {
    dispatch({ type: 'SUBMIT' });
    // Dispatch to Redux global store
    reduxDispatch(addMemory({
      imageUri: state.imageUri,
      summary: state.summary,
      tags: state.tags,
    }));
    setTimeout(() => router.back(), 800);
  };

  // --- Step 1: Capture ---
  if (state.step === 'capture') {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <View style={styles.captureArea}>
          <TouchableOpacity style={[styles.captureButton, { borderColor: theme.border }]} onPress={handleCapture}>
            <Ionicons name="camera-outline" size={64} color={theme.subtitle} />
            <Text style={[styles.captureText, { color: theme.text }]}>Tap to Capture</Text>
            <Text style={[styles.captureHint, { color: theme.subtitle }]}>Simulates taking a screenshot</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- Step 2: Summarize ---
  if (state.step === 'summarize') {
    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
        {/* Image preview */}
        <View style={[styles.previewBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="image" size={40} color={theme.accent} />
          <Text style={[styles.previewText, { color: theme.text }]}>{state.imageUri}</Text>
        </View>

        {/* Summary input */}
        <Text style={[styles.label, { color: theme.subtitle }]}>SUMMARY</Text>
        <TextInput
          style={[styles.textInput, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
          placeholder="Describe this memory..."
          placeholderTextColor={theme.subtitle}
          multiline
          value={state.summary}
          onChangeText={text => dispatch({ type: 'SET_SUMMARY', payload: text })}
        />

        {/* Tags */}
        <Text style={[styles.label, { color: theme.subtitle }]}>TAGS</Text>
        <View style={styles.tagInputRow}>
          <TextInput
            style={[styles.tagInput, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
            placeholder="Add tag..."
            placeholderTextColor={theme.subtitle}
            value={state.tagInput}
            onChangeText={text => dispatch({ type: 'SET_TAG_INPUT', payload: text })}
            onSubmitEditing={() => dispatch({ type: 'ADD_TAG' })}
          />
          <TouchableOpacity
            style={[styles.tagAddBtn, { backgroundColor: theme.accent }]}
            onPress={() => dispatch({ type: 'ADD_TAG' })}
          >
            <Ionicons name="add" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.tagsContainer}>
          {state.tags.map(tag => (
            <TouchableOpacity
              key={tag}
              style={[styles.tag, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => dispatch({ type: 'REMOVE_TAG', payload: tag })}
            >
              <Text style={[styles.tagText, { color: theme.text }]}>{tag}</Text>
              <Ionicons name="close-circle" size={16} color={theme.subtitle} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: theme.accent }]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>Save Memory</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // --- Step 3: Done ---
  return (
    <View style={[styles.container, styles.center, { backgroundColor: theme.bg }]}>
      <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
      <Text style={[styles.doneText, { color: theme.text }]}>Memory Saved!</Text>
      <Text style={[styles.doneHint, { color: theme.subtitle }]}>Returning to home...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { justifyContent: 'center', alignItems: 'center' },

  // Step 1
  captureArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  captureButton: {
    width: 220, height: 220, borderRadius: 110,
    borderWidth: 2, borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center',
  },
  captureText: { fontSize: 18, fontWeight: '500', marginTop: 12 },
  captureHint: { fontSize: 12, marginTop: 6 },

  // Step 2
  previewBox: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
    borderRadius: 12, borderWidth: 1, marginBottom: 24, marginTop: 10,
  },
  previewText: { fontSize: 14, marginLeft: 12, flex: 1 },
  label: { fontSize: 12, letterSpacing: 1, marginBottom: 8, fontWeight: '600' },
  textInput: {
    borderRadius: 12, borderWidth: 1, padding: 16,
    fontSize: 15, minHeight: 100, textAlignVertical: 'top', marginBottom: 24,
  },
  tagInputRow: { flexDirection: 'row', marginBottom: 12 },
  tagInput: {
    flex: 1, borderRadius: 12, borderWidth: 1,
    padding: 12, fontSize: 15, marginRight: 10,
  },
  tagAddBtn: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
  },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 },
  tag: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 16, borderWidth: 1, marginRight: 8, marginBottom: 8,
  },
  tagText: { fontSize: 14, marginRight: 6 },
  submitBtn: { paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 40 },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '600' },

  // Step 3
  doneText: { fontSize: 24, fontWeight: '300', marginTop: 20 },
  doneHint: { fontSize: 14, marginTop: 8 },
});
