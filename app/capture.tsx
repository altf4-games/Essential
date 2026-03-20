import React, { useReducer, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { addMemory } from "./lib/store";
import { useTheme } from "./lib/ThemeContext";
import * as ImagePicker from "expo-image-picker";
import { File } from "expo-file-system";
import { generateGeminiImageSummary } from "../services/api";
import { getAllMemories, insertMemory } from "../services/memorySqlite";
import { updateAfterMemorySaved } from "../services/appStorage";

// --- useReducer: manages multi-step capture form ---
const initialState = {
  step: "capture", // 'capture' | 'summarize' | 'done'
  imageUri: null,
  summary: "",
  tags: [],
  tagInput: "",
  reminderAt: "",
  reminderNote: "",
};

function captureReducer(state, action) {
  switch (action.type) {
    case "SET_IMAGE":
      return { ...state, imageUri: action.payload, step: "summarize" };
    case "SET_SUMMARY":
      return { ...state, summary: action.payload };
    case "SET_TAG_INPUT":
      return { ...state, tagInput: action.payload };
    case "SET_REMINDER_AT":
      return { ...state, reminderAt: action.payload };
    case "SET_REMINDER_NOTE":
      return { ...state, reminderNote: action.payload };
    case "ADD_TAG":
      if (!state.tagInput.trim() || state.tags.includes(state.tagInput.trim()))
        return state;
      return {
        ...state,
        tags: [...state.tags, state.tagInput.trim()],
        tagInput: "",
      };
    case "REMOVE_TAG":
      return { ...state, tags: state.tags.filter((t) => t !== action.payload) };
    case "SUBMIT":
      return { ...state, step: "done" };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function CaptureScreen() {
  const [state, dispatch] = useReducer(captureReducer, initialState);
  const [isPicking, setIsPicking] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const reduxDispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();

  const inferMimeTypeFromUri = (uri) => {
    const lower = (uri || "").toLowerCase();
    if (lower.endsWith(".png")) return "image/png";
    if (lower.endsWith(".webp")) return "image/webp";
    if (lower.endsWith(".heic") || lower.endsWith(".heif")) return "image/heic";
    return "image/jpeg";
  };

  const arrayBufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let base64 = "";

    for (let i = 0; i < bytes.length; i += 3) {
      const byte1 = bytes[i];
      const byte2 = i + 1 < bytes.length ? bytes[i + 1] : 0;
      const byte3 = i + 2 < bytes.length ? bytes[i + 2] : 0;

      const chunk = (byte1 << 16) | (byte2 << 8) | byte3;
      const enc1 = (chunk >> 18) & 63;
      const enc2 = (chunk >> 12) & 63;
      const enc3 = (chunk >> 6) & 63;
      const enc4 = chunk & 63;

      base64 += chars[enc1] + chars[enc2];
      base64 += i + 1 < bytes.length ? chars[enc3] : "=";
      base64 += i + 2 < bytes.length ? chars[enc4] : "=";
    }

    return base64;
  };

  const readImageBase64 = async (uri) => {
    const file = new File(uri);
    const arrayBuffer = await file.arrayBuffer();
    return arrayBufferToBase64(arrayBuffer);
  };

  const processSelectedAsset = async (asset) => {
    if (!asset?.uri) {
      Alert.alert(
        "Image error",
        "Selected image is missing a valid URI. Please try again.",
      );
      return;
    }

    dispatch({ type: "SET_IMAGE", payload: asset.uri });
    dispatch({ type: "SET_SUMMARY", payload: "" });
    setIsGeneratingSummary(true);

    try {
      const base64Data = await readImageBase64(asset.uri);

      if (!base64Data) {
        throw new Error("Could not read image data.");
      }

      const mimeType = asset.mimeType || inferMimeTypeFromUri(asset.uri);
      const result = await generateGeminiImageSummary(base64Data, mimeType);
      dispatch({ type: "SET_SUMMARY", payload: result.text });
    } catch (error) {
      const message =
        error?.message ||
        "Gemini could not generate a summary. Tap Retry Summary to try again.";
      Alert.alert("Summary generation failed", message);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleRetrySummary = async () => {
    if (!state.imageUri) {
      Alert.alert("Image missing", "No image found for summary retry.");
      return;
    }

    setIsGeneratingSummary(true);
    dispatch({ type: "SET_SUMMARY", payload: "" });

    try {
      const base64Data = await readImageBase64(state.imageUri);

      if (!base64Data) {
        throw new Error("Could not read image data.");
      }

      const result = await generateGeminiImageSummary(
        base64Data,
        inferMimeTypeFromUri(state.imageUri),
      );
      dispatch({ type: "SET_SUMMARY", payload: result.text });
    } catch (error) {
      const message =
        error?.message || "Please check internet or API key and try again.";
      Alert.alert("Summary generation failed", message);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleTakeScreenshot = async () => {
    setIsPicking(true);

    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission needed",
          "Camera permission is required to take a screenshot/photo.",
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        await processSelectedAsset(result.assets[0]);
      }
    } catch {
      Alert.alert("Error", "Could not open camera. Please try again.");
    } finally {
      setIsPicking(false);
    }
  };

  const handlePickFromGallery = async () => {
    setIsPicking(true);

    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission needed",
          "Gallery permission is required to pick an image.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        await processSelectedAsset(result.assets[0]);
      }
    } catch {
      Alert.alert("Error", "Could not open gallery. Please try again.");
    } finally {
      setIsPicking(false);
    }
  };

  const handleSubmit = async () => {
    if (!state.summary.trim()) {
      Alert.alert(
        "Summary required",
        "Wait for Gemini summary or tap Retry Summary.",
      );
      return;
    }

    const reminderAt = state.reminderAt.trim();
    let normalizedReminderAt = null;

    if (reminderAt) {
      const parsed = new Date(reminderAt);
      if (Number.isNaN(parsed.getTime())) {
        Alert.alert(
          "Invalid reminder date",
          "Use a valid date like 2026-03-25 09:00.",
        );
        return;
      }
      normalizedReminderAt = parsed.toISOString();
    }

    const memoryPayload = {
      id: Date.now().toString(),
      imageUri: state.imageUri,
      summary: state.summary.trim(),
      tags: state.tags,
      reminderAt: normalizedReminderAt,
      reminderNote: state.reminderNote.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      await insertMemory(memoryPayload);
    } catch (error) {
      const message = error?.message ||
        "Could not save memory to local SQL storage. Please try again.";
      Alert.alert(
        "Storage error",
        message,
      );
      return;
    }

    try {
      const allMemories = await getAllMemories();
      await updateAfterMemorySaved(memoryPayload.summary, allMemories.length);
    } catch (error) {
      console.warn("Minimal AsyncStorage update failed:", error?.message || error);
    }

    dispatch({ type: "SUBMIT" });

    // Dispatch to Redux global store
    reduxDispatch(addMemory(memoryPayload));
    setTimeout(() => router.back(), 800);
  };

  // --- Step 1: Capture ---
  if (state.step === "capture") {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <View style={styles.captureArea}>
          <TouchableOpacity
            style={[styles.captureButton, { borderColor: theme.border }]}
            onPress={handleTakeScreenshot}
            disabled={isPicking}
          >
            <Ionicons name="camera-outline" size={56} color={theme.subtitle} />
            <Text style={[styles.captureText, { color: theme.text }]}>
              Take Screenshot / Photo
            </Text>
            <Text style={[styles.captureHint, { color: theme.subtitle }]}>
              Uses device camera
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.galleryButton,
              { borderColor: theme.border, backgroundColor: theme.card },
            ]}
            onPress={handlePickFromGallery}
            disabled={isPicking}
          >
            <Ionicons name="images-outline" size={22} color={theme.text} />
            <Text style={[styles.galleryButtonText, { color: theme.text }]}>
              Pick From Gallery
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- Step 2: Summarize ---
  if (state.step === "summarize") {
    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
        {/* Image preview */}
        <View
          style={[
            styles.previewBox,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Image source={{ uri: state.imageUri }} style={styles.previewImage} />
          <Text
            style={[styles.previewText, { color: theme.text }]}
            numberOfLines={2}
          >
            {state.imageUri}
          </Text>
        </View>

        {/* Summary input */}
        <Text style={[styles.label, { color: theme.subtitle }]}>SUMMARY</Text>
        <Text style={[styles.summaryHelper, { color: theme.subtitle }]}>
          Generated by Gemini from the selected image
        </Text>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: theme.card,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          placeholder={
            isGeneratingSummary
              ? "Generating summary..."
              : "Gemini summary will appear here..."
          }
          placeholderTextColor={theme.subtitle}
          multiline
          value={state.summary}
          onChangeText={(text) =>
            dispatch({ type: "SET_SUMMARY", payload: text })
          }
        />

        <TouchableOpacity
          style={[
            styles.retryButton,
            { borderColor: theme.border, backgroundColor: theme.card },
          ]}
          onPress={handleRetrySummary}
          disabled={isGeneratingSummary}
        >
          <Ionicons name="refresh" size={16} color={theme.text} />
          <Text style={[styles.retryButtonText, { color: theme.text }]}>
            {isGeneratingSummary ? "Generating..." : "Retry Summary"}
          </Text>
        </TouchableOpacity>

        {/* Tags */}
        <Text style={[styles.label, { color: theme.subtitle }]}>TAGS</Text>
        <View style={styles.tagInputRow}>
          <TextInput
            style={[
              styles.tagInput,
              {
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder="Add tag..."
            placeholderTextColor={theme.subtitle}
            value={state.tagInput}
            onChangeText={(text) =>
              dispatch({ type: "SET_TAG_INPUT", payload: text })
            }
            onSubmitEditing={() => dispatch({ type: "ADD_TAG" })}
          />
          <TouchableOpacity
            style={[styles.tagAddBtn, { backgroundColor: theme.accent }]}
            onPress={() => dispatch({ type: "ADD_TAG" })}
          >
            <Ionicons name="add" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.tagsContainer}>
          {state.tags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tag,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
              onPress={() => dispatch({ type: "REMOVE_TAG", payload: tag })}
            >
              <Text style={[styles.tagText, { color: theme.text }]}>{tag}</Text>
              <Ionicons name="close-circle" size={16} color={theme.subtitle} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: theme.subtitle }]}>
          REMINDER DATE/TIME
        </Text>
        <TextInput
          style={[
            styles.tagInput,
            styles.reminderInput,
            {
              backgroundColor: theme.card,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          placeholder="2026-03-25 09:00"
          placeholderTextColor={theme.subtitle}
          value={state.reminderAt}
          onChangeText={(text) =>
            dispatch({ type: "SET_REMINDER_AT", payload: text })
          }
        />

        <Text style={[styles.label, { color: theme.subtitle }]}>
          REMINDER NOTE
        </Text>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: theme.card,
              color: theme.text,
              borderColor: theme.border,
              minHeight: 80,
            },
          ]}
          placeholder="What should this remind you about?"
          placeholderTextColor={theme.subtitle}
          multiline
          value={state.reminderNote}
          onChangeText={(text) =>
            dispatch({ type: "SET_REMINDER_NOTE", payload: text })
          }
        />

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
    <View
      style={[styles.container, styles.center, { backgroundColor: theme.bg }]}
    >
      <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
      <Text style={[styles.doneText, { color: theme.text }]}>
        Memory Saved!
      </Text>
      <Text style={[styles.doneHint, { color: theme.subtitle }]}>
        Returning to home...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { justifyContent: "center", alignItems: "center" },

  // Step 1
  captureArea: { flex: 1, justifyContent: "center", alignItems: "center" },
  captureButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  galleryButton: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  galleryButtonText: { fontSize: 14, fontWeight: "500" },
  captureText: { fontSize: 18, fontWeight: "500", marginTop: 12 },
  captureHint: { fontSize: 12, marginTop: 6 },

  // Step 2
  previewBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    marginTop: 10,
  },
  previewImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  previewText: { fontSize: 14, marginLeft: 12, flex: 1 },
  label: { fontSize: 12, letterSpacing: 1, marginBottom: 8, fontWeight: "600" },
  textInput: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 24,
  },
  summaryHelper: {
    fontSize: 12,
    marginBottom: 8,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  retryButtonText: {
    fontSize: 13,
    fontWeight: "500",
  },
  tagInputRow: { flexDirection: "row", marginBottom: 12 },
  tagInput: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    fontSize: 15,
    marginRight: 10,
  },
  reminderInput: {
    marginRight: 0,
    marginBottom: 20,
  },
  tagAddBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 24 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: { fontSize: 14, marginRight: 6 },
  submitBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 40,
  },
  submitText: { color: "#FFF", fontSize: 16, fontWeight: "600" },

  // Step 3
  doneText: { fontSize: 24, fontWeight: "300", marginTop: 20 },
  doneHint: { fontSize: 14, marginTop: 8 },
});
